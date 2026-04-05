import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword, generateSalt, verifyPassword } from "@/lib/admin-auth";

const SETUP_CODE = "2652";

function setAuthCookie(response: NextResponse, email: string) {
  response.cookies.set("admin_auth", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function POST(req: NextRequest) {
  const { action, email, password, code } = await req.json();

  if (!email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  if (action === "register") {
    if (code !== SETUP_CODE) {
      return NextResponse.json({ error: "Code d'accès incorrect" }, { status: 403 });
    }

    const { data: existing } = await supabaseAdmin()
      .from("admin_accounts")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const salt = generateSalt();
    const password_hash = `${salt}:${hashPassword(password, salt)}`;

    const { error } = await supabaseAdmin()
      .from("admin_accounts")
      .insert({ email: email.trim().toLowerCase(), password_hash });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const response = NextResponse.json({ success: true });
    setAuthCookie(response, email.trim().toLowerCase());
    return response;
  }

  if (action === "login") {
    const { data: account } = await supabaseAdmin()
      .from("admin_accounts")
      .select("email, password_hash")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (!account || !verifyPassword(password, account.password_hash)) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setAuthCookie(response, account.email);
    return response;
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_auth");
  return response;
}
