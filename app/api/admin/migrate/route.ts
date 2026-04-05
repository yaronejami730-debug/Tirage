import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET → retourne les noms réels des contraintes CHECK sur la table lots
export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("information_schema.table_constraints" as any)
    .select("constraint_name")
    .eq("table_name", "lots")
    .eq("constraint_type", "CHECK");

  if (error) {
    // Fallback via rpc si la requête directe échoue
    return NextResponse.json({ constraints: [], error: error.message });
  }

  return NextResponse.json({ constraints: data?.map((r: any) => r.constraint_name) ?? [] });
}
