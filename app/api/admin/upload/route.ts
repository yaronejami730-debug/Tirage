import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: isVideo ? "Vidéo trop lourde (max 100 Mo)." : "Image trop lourde (max 5 Mo)." }, { status: 400 });
  }

  const allowedImages = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const allowedVideos = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
  if (![...allowedImages, ...allowedVideos].includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté (JPG, PNG, WEBP, MP4, WEBM, MOV)." }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = supabaseAdmin();

  const { error } = await supabase.storage
    .from("lot-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from("lot-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
