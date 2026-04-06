import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";
import { sendBailiffEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: lotId } = await params;
  const body = await req.json();
  const { bailiffEmail } = body;

  if (!bailiffEmail) {
    return NextResponse.json({ error: "Email de l'huissier manquant." }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // Get lot info
  const { data: lot, error: lotError } = await supabase
    .from("lots")
    .select("*")
    .eq("id", lotId)
    .single();

  if (lotError || !lot) {
    return NextResponse.json({ error: "Lot introuvable." }, { status: 404 });
  }

  // Get all confirmed participations
  const { data: participations, error: partError } = await supabase
    .from("participations")
    .select("*")
    .eq("lot_id", lotId)
    .eq("statut", "confirme")
    .order("created_at", { ascending: true });

  if (partError || !participations || participations.length === 0) {
    return NextResponse.json({ error: "Aucune participation confirmée pour ce lot." }, { status: 400 });
  }

  // Build CSV content
  const headers = ["ID", "Prenom", "Nom", "Email", "Telephone", "Quantite", "Tickets", "Date"];
  const rows = participations.map(p => [
    p.id,
    p.prenom,
    p.nom,
    p.email,
    p.telephone || "",
    p.quantite,
    (p.ticket_numbers || []).join(";"),
    p.created_at
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const csvBase64 = Buffer.from(csvContent).toString("base64");

  try {
    await sendBailiffEmail({
      to: bailiffEmail,
      lotNom: lot.nom,
      lotReference: lot.reference_lot,
      csvContentBase64: csvBase64,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email : " + err.message }, { status: 500 });
  }
}
