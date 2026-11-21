"use server";

import { redirect } from "next/navigation";
import { authConfigured, checkPassword, clearSession, setSession } from "@/lib/auth";

export async function login(_: { error?: string } | undefined, form: FormData) {
  if (!authConfigured()) return { error: "Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (16+ characters) in the environment." };
  const ok = checkPassword(String(form.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "Wrong password." };
  }
  await setSession();
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}
