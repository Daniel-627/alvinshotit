import "server-only";
import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "asi_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const secret = () => process.env.ADMIN_SESSION_SECRET || "";
export const authConfigured = () => Boolean(process.env.ADMIN_PASSWORD) && secret().length >= 16;

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

export function makeToken() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token?: string | null) {
  if (!token || !authConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const good = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  if (good.length !== given.length || !timingSafeEqual(good, given)) return false;
  return Number(exp) > Date.now() / 1000;
}

export function checkPassword(input: string) {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(process.env.ADMIN_PASSWORD || "").digest();
  return Boolean(process.env.ADMIN_PASSWORD) && timingSafeEqual(a, b);
}

export async function setSession() {
  (await cookies()).set(COOKIE, makeToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  return verifyToken((await cookies()).get(COOKIE)?.value);
}

/** Call at the top of every server action and route handler that changes data. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not signed in");
}
