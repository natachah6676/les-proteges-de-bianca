"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return loginAction(formData);
    },
    null,
  );

  return (
    <form action={action} className="photo-frame mx-auto max-w-md rounded-[1.5rem] p-6 sm:p-8">
      <h1 className="font-serif text-3xl text-bordeaux-deep">Connexion</h1>
      <p className="mt-2 text-ink-soft">Espace réservé à l’administration du site.</p>
      <input type="hidden" name="next" value={next} />
      <label className="admin-label mt-6" htmlFor="email">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
        className="admin-input"
      />
      <label className="admin-label mt-4" htmlFor="password">
        Mot de passe
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="admin-input"
      />
      {state?.error ? (
        <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary mt-6 w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
