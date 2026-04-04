import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id requis" },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("participations")
    .select("*, lots(nom, reference_lot, image_url)")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Participation introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({ participation: data });
}
