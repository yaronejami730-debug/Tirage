import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";
import { createHash, randomBytes, timingSafeEqual } from "crypto";

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const email = cookieStore.get("admin_auth")?.value;
  if (!email) return false;

  const { data } = await supabaseAdmin()
    .from("admin_accounts")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  return !!data;
}

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(password + salt).digest("hex");
}

export function generateSalt(): string {
  return randomBytes(16).toString("hex");
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const inputHash = hashPassword(password, salt);
  const hashBuffer = Buffer.from(hash, "hex");
  const inputBuffer = Buffer.from(inputHash, "hex");
  if (hashBuffer.length !== inputBuffer.length) return false;
  return timingSafeEqual(hashBuffer, inputBuffer);
}
