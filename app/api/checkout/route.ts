import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lot_id, nom, prenom, email, telephone, quantite } = body;

    // Validate required fields
    if (!lot_id || !nom || !prenom || !email || !quantite) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    if (quantite < 1 || quantite > 10) {
      return NextResponse.json(
        { error: "La quantité doit être entre 1 et 10." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Fetch the lot
    const { data: lot, error: lotError } = await supabase
      .from("lots")
      .select("*")
      .eq("id", lot_id)
      .eq("statut", "actif")
      .single();

    if (lotError || !lot) {
      return NextResponse.json(
        { error: "Ce lot n'existe pas ou n'est plus disponible." },
        { status: 404 }
      );
    }

    // Check available tickets
    const remaining = lot.total_tickets - lot.tickets_vendus;
    if (remaining < quantite) {
      return NextResponse.json(
        {
          error: `Il ne reste que ${remaining} ticket${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}.`,
        },
        { status: 400 }
      );
    }

    const unitAmountCents = Math.round(Number(lot.prix_ticket) * 100); // price per ticket in cents

    // Create Stripe Checkout session first to get session ID
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: lot.nom,
              description: `Participation au tirage • Référence: ${lot.reference_lot}`,
            },
            unit_amount: unitAmountCents,
          },
          quantity: quantite,
        },
      ],
      customer_email: email,
      metadata: {
        lot_id,
        nom,
        prenom,
        email,
        telephone: telephone || "",
        quantite: String(quantite),
        lot_reference: lot.reference_lot,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/lots/${lot_id}?cancelled=true`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
    });

    // Create pending participation in DB
    const { error: insertError } = await supabase
      .from("participations")
      .insert({
        lot_id,
        nom,
        prenom,
        email,
        telephone: telephone || null,
        quantite,
        ticket_numbers: [],
        stripe_session_id: session.id,
        statut: "en_attente",
      });

    if (insertError) {
      console.error("Error creating participation:", insertError);
      // Try to expire the Stripe session
      await stripe.checkout.sessions.expire(session.id).catch(console.error);
      return NextResponse.json(
        { error: "Erreur lors de la création de la participation." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
