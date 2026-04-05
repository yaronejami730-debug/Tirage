import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const supabase = supabaseAdmin();
  const { data, error } = await supabase.from("lots").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Lot introuvable." }, { status: 404 });
  return NextResponse.json({ lot: data });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      nom,
      description,
      image_url,
      prix_ticket,
      total_tickets,
      reference_lot,
      date_fin,
      date_ouverture,
      medias,
      statut,
      categorie,
      valeur_estimee,
    } = body;

    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("lots")
      .update({
        nom,
        description: description || null,
        image_url: image_url || null,
        prix_ticket,
        total_tickets,
        reference_lot,
        date_fin: date_fin || null,
        date_ouverture: date_ouverture || null,
        medias: medias || [],
        statut: statut === "programme" ? "actif" : statut,
        categorie: categorie || "autre",
        valeur_estimee: valeur_estimee || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Cette référence de lot est déjà utilisée." }, { status: 400 });
      }
      if (error.code === "23514") {
        return NextResponse.json({ error: "CONSTRAINT_ERROR", detail: error.message }, { status: 422 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lot: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = supabaseAdmin();

  // Check if there are confirmed participations
  const { data: participations } = await supabase
    .from("participations")
    .select("id")
    .eq("lot_id", id)
    .eq("statut", "confirme")
    .limit(1);

  if (participations && participations.length > 0) {
    return NextResponse.json(
      {
        error:
          "Impossible de supprimer un lot avec des participations confirmées.",
      },
      { status: 400 }
    );
  }

  // Delete pending participations first
  await supabase
    .from("participations")
    .delete()
    .eq("lot_id", id)
    .neq("statut", "confirme");

  const { error } = await supabase.from("lots").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
