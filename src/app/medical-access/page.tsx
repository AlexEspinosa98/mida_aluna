"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function MedicalAccessPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace("/anthropometry");
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/anthropometry");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto px-gutter py-space-xl flex flex-col gap-space-lg">
      <div className="text-center flex flex-col items-center gap-space-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mida-logo.svg" alt="MIDA · Medición Inteligente Diferencial Aplicada" className="h-16 w-auto mb-space-sm" />
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-title-md">verified_user</span>
          <span className="font-body text-label-sm uppercase tracking-wider">
            Módulo clínico &amp; auditoría especializada
          </span>
        </div>
        <h1 className="font-heading text-headline-lg text-primary">Acceso médico diferencial</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Portal de validación para especialistas en pediatría intercultural, nutrición clínica e
          investigadores del modelo ALUNA IA.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
      >
        <div className="flex flex-col gap-space-xs">
          <label htmlFor="username" className="font-body text-label-lg text-on-surface">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="dr.intercultural"
            className="w-full bg-surface-container-low text-on-surface font-body text-body-md px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-space-xs">
          <label htmlFor="password" className="font-body text-label-lg text-on-surface">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-surface-container-low text-on-surface font-body text-body-md px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
          />
        </div>

        {error && (
          <p className="font-body text-body-sm text-error bg-error-container/40 rounded-lg px-space-md py-space-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-space-sm bg-primary hover:bg-primary-container text-on-primary font-heading text-headline-sm px-space-lg py-space-sm rounded-xl transition-colors shadow-md disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-headline-sm">shield</span>
          {submitting ? "Ingresando…" : "Ingresar al panel clínico experto"}
        </button>
      </form>
    </div>
  );
}
