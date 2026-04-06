import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

const DB_CATEGORY_MAP: Record<string, string> = {
  smartphone: "tech", audio: "tech", photo: "tech", tv: "tech",
  electromenager: "maison", gastronomie: "maison",
  bijoux: "luxe", montres: "luxe", art: "luxe",
  sacs: "mode", chaussures: "mode", parfum: "mode",
  sport: "autre", voiture: "autre", moto: "autre",
  voyage: "autre", enfants: "autre", culture: "autre", crypto: "autre",
  // already valid:
  tech: "tech", mode: "mode", gaming: "gaming", maison: "maison", luxe: "luxe", autre: "autre",
};
function safeCategorie(cat: string): string {
  return DB_CATEGORY_MAP[cat] ?? "autre";
}

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lots: data });
}

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      packs,
    } = body;

    if (!nom || !prix_ticket || !total_tickets || !reference_lot) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("lots")
      .insert({
        nom,
        description: description || null,
        image_url: image_url || null,
        prix_ticket,
        total_tickets,
        reference_lot,
        date_fin: date_fin || null,
        date_ouverture: date_ouverture || null,
        medias: medias || [],
        packs: packs || [],
        statut: body.statut && body.statut !== "programme" ? body.statut : "actif",
        categorie: safeCategorie(body.categorie || "autre"),
        valeur_estimee: body.valeur_estimee || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Cette référence de lot existe déjà." }, { status: 400 });
      }
      if (error.code === "23514") {
        return NextResponse.json({ error: "CONSTRAINT_ERROR", detail: error.message }, { status: 422 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lot: data }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
