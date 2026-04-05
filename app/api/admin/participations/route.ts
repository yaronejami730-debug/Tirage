import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lotId = req.nextUrl.searchParams.get("lot_id");
  const supabase = supabaseAdmin();
  let query = supabase
    .from("participations")
    .select("*, lots(nom, reference_lot, prix_ticket)")
    .order("created_at", { ascending: false });

  if (lotId) query = query.eq("lot_id", lotId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ participations: data });
}
