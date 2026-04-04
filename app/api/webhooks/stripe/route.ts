import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const supabase = supabaseAdmin();

    // Find the participation
    const { data: participation, error: findError } = await supabase
      .from("participations")
      .select("*, lots(*)")
      .eq("stripe_session_id", session.id)
      .single();

    if (findError || !participation) {
      console.error("Participation not found for session:", session.id, findError);
      return NextResponse.json(
        { error: "Participation not found" },
        { status: 404 }
      );
    }

    // Idempotency: already processed
    if (participation.statut === "confirme") {
      return NextResponse.json({ received: true });
    }

    const lot = participation.lots;
    if (!lot) {
      console.error("Lot not found for participation:", participation.id);
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    // Assign ticket numbers sequentially
    // Get max ticket number already assigned to this lot
    const { data: existingTickets, error: ticketError } = await supabase
      .from("participations")
      .select("ticket_numbers")
      .eq("lot_id", participation.lot_id)
      .eq("statut", "confirme");

    if (ticketError) {
      console.error("Error fetching existing tickets:", ticketError);
      return NextResponse.json(
        { error: "Error fetching existing tickets" },
        { status: 500 }
      );
    }

    // Find the highest ticket number assigned so far
    let maxTicket = 0;
    if (existingTickets && existingTickets.length > 0) {
      for (const p of existingTickets) {
        if (p.ticket_numbers && p.ticket_numbers.length > 0) {
          const localMax = Math.max(...p.ticket_numbers);
          if (localMax > maxTicket) {
            maxTicket = localMax;
          }
        }
      }
    }

    // Assign next sequential ticket numbers
    const quantite = participation.quantite;
    const newTickets: number[] = [];
    for (let i = 1; i <= quantite; i++) {
      newTickets.push(maxTicket + i);
    }

    // Update participation with ticket numbers and confirm it
    const { error: updateParticipationError } = await supabase
      .from("participations")
      .update({
        ticket_numbers: newTickets,
        stripe_payment_id: session.payment_intent as string || null,
        statut: "confirme",
      })
      .eq("id", participation.id);

    if (updateParticipationError) {
      console.error("Error updating participation:", updateParticipationError);
      return NextResponse.json(
        { error: "Error updating participation" },
        { status: 500 }
      );
    }

    // Update lot tickets_vendus
    const { error: updateLotError } = await supabase
      .from("lots")
      .update({
        tickets_vendus: lot.tickets_vendus + quantite,
      })
      .eq("id", participation.lot_id);

    if (updateLotError) {
      console.error("Error updating lot:", updateLotError);
      // Non-fatal, continue
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail({
        to: participation.email,
        prenom: participation.prenom,
        nom: participation.nom,
        lotNom: lot.nom,
        lotReference: lot.reference_lot,
        ticketNumbers: newTickets,
        quantite,
        prixTotal: Number(lot.prix_ticket) * quantite,
      });
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
      // Non-fatal: payment is confirmed, email failure shouldn't fail the webhook
    }

    console.log(
      `Participation ${participation.id} confirmed. Tickets: ${newTickets.join(", ")}`
    );
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = supabaseAdmin();

    await supabase
      .from("participations")
      .update({ statut: "annule" })
      .eq("stripe_session_id", session.id)
      .eq("statut", "en_attente");
  }

  return NextResponse.json({ received: true });
}
