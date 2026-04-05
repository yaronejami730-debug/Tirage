import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET → retourne les noms réels des contraintes CHECK sur la table lots
export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();

  // Try via information_schema (PostgREST may expose it)
  const { data, error } = await supabase
    .from("information_schema.table_constraints" as any)
    .select("constraint_name")
    .eq("table_name", "lots")
    .eq("constraint_type", "CHECK");

  if (!error && data && data.length > 0) {
    return NextResponse.json({
      constraints: (data as Array<{ constraint_name: string }>).map((r) => r.constraint_name),
    });
  }

  // Fallback: try via RPC with a simple SQL function call
  const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
    "get_lots_check_constraints"
  );

  if (!rpcError && rpcData) {
    return NextResponse.json({ constraints: rpcData as string[] });
  }

  // Final fallback: return empty with error info so the client can show the DO $$ block
  return NextResponse.json({
    constraints: [],
    error: error?.message ?? rpcError?.message ?? "Unable to query constraints",
  });
}
