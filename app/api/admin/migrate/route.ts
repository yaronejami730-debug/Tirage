import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";

const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL!
  .replace("https://", "")
  .replace(".supabase.co", "");

const SQL = `
ALTER TABLE lots DROP CONSTRAINT IF EXISTS lots_statut_check;
ALTER TABLE lots ADD CONSTRAINT lots_statut_check
  CHECK (statut IN ('actif', 'termine', 'archive', 'programme'));

ALTER TABLE lots DROP CONSTRAINT IF EXISTS lots_categorie_check;
ALTER TABLE lots ADD CONSTRAINT lots_categorie_check
  CHECK (categorie IN (
    'smartphone','tech','gaming','audio','photo','tv',
    'maison','electromenager','mode','bijoux','montres','sacs',
    'chaussures','parfum','sport','voiture','moto','voyage',
    'gastronomie','art','luxe','enfants','culture','crypto','autre'
  ));
`.trim();

export async function POST() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  try {
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ query: SQL }),
      }
    );

    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    // L'API Management Supabase nécessite un token personnel.
    // Fallback : renvoyer le SQL pour que l'admin le colle manuellement.
    return NextResponse.json({ sql: SQL, manual: true });
  } catch {
    return NextResponse.json({ sql: SQL, manual: true });
  }
}
