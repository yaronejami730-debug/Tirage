import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth");
  return adminAuth?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: lotId } = await params;
  const supabase = supabaseAdmin();

  // Get lot
  const { data: lot, error: lotError } = await supabase
    .from("lots")
    .select("*")
    .eq("id", lotId)
    .single();

  if (lotError || !lot) {
    return NextResponse.json({ error: "Lot introuvable." }, { status: 404 });
  }

  if (lot.winner_participation_id) {
    return NextResponse.json({ error: "Ce lot a déjà été tiré." }, { status: 400 });
  }

  // Get all confirmed participations
  const { data: participations, error: partError } = await supabase
    .from("participations")
    .select("*")
    .eq("lot_id", lotId)
    .eq("statut", "confirme");

  if (partError || !participations || participations.length === 0) {
    return NextResponse.json({ error: "Aucune participation confirmée pour ce lot." }, { status: 400 });
  }

  // Build ticket pool
  const ticketPool: { participationId: string; ticketNumber: number; prenom: string; nom: string; email: string }[] = [];
  for (const p of participations) {
    for (const ticketNum of (p.ticket_numbers || [])) {
      ticketPool.push({ participationId: p.id, ticketNumber: ticketNum, prenom: p.prenom, nom: p.nom, email: p.email });
    }
  }

  if (ticketPool.length === 0) {
    return NextResponse.json({ error: "Aucun ticket dans le pool." }, { status: 400 });
  }

  // Crypto RNG draw
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const winnerIndex = randomBuffer[0] % ticketPool.length;
  const winner = ticketPool[winnerIndex];

  // Mark winner participation
  await supabase.from("participations")
    .update({ statut: "confirme" })
    .eq("id", winner.participationId);

  // Update lot
  await supabase.from("lots").update({
    winner_participation_id: winner.participationId,
    drawn_at: new Date().toISOString(),
    statut: "termine",
  }).eq("id", lotId);

  // Record in draws table
  await supabase.from("draws").insert({
    lot_id: lotId,
    winning_ticket: winner.ticketNumber,
    winner_id: winner.participationId,
    total_tickets: ticketPool.length,
    total_players: participations.length,
    draw_method: "crypto-rng",
  });

  return NextResponse.json({
    winner: {
      prenom: winner.prenom,
      nom: winner.nom,
      email: winner.email,
      winning_ticket: winner.ticketNumber,
      total_tickets: ticketPool.length,
      total_players: participations.length,
      drawn_at: new Date().toISOString(),
    }
  });
}
