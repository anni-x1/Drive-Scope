import { cookies } from "next/headers";
import { sign, verify } from "./security";
export async function getUserId() {
  const token = (await cookies()).get("ds_session")?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !verify(payload, signature)) return null;
  try { const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as { userId: string; expiresAt: number }; return session.userId && session.expiresAt > Date.now() ? session.userId : null; } catch { return null; }
}
export async function setSession(userId: string) {
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString("base64url");
  (await cookies()).set("ds_session", `${payload}.${sign(payload)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}
