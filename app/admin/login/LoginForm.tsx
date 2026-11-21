"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label htmlFor="password" className="sr-only">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus placeholder="Password" className="field" />
      {state?.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn w-full justify-center disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
