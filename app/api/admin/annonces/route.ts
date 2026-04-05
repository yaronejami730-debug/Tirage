import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  if (!(await checkAdminAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin()
    .from("annonces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ annonces: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { texte, couleur, emoji, actif } = await req.json();
  if (!texte?.trim()) return NextResponse.json({ error: "Texte requis" }, { status: 400 });

  const { data, error } = await supabaseAdmin()
    .from("annonces")
    .insert({ texte: texte.trim(), couleur: couleur ?? "#6C5CE7", emoji: emoji ?? null, actif: actif ?? true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ annonce: data }, { status: 201 });
}
