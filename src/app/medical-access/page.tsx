"use client";

import { useState } from "react";
import Link from "next/link";

export default function MedicalAccessPage() {
  const [mode, setMode] = useState<"medico" | "cabildo">("medico");

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

      <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex bg-surface-container rounded-xl p-space-xs gap-space-xs">
          <button
            type="button"
            onClick={() => setMode("medico")}
            className={`flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg font-body text-label-lg transition-colors ${
              mode === "medico" ? "bg-primary text-on-primary" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-title-md">stethoscope</span>
            Médico / ReTHUS
          </button>
          <button
            type="button"
            onClick={() => setMode("cabildo")}
            className={`flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg font-body text-label-lg transition-colors ${
              mode === "cabildo" ? "bg-primary text-on-primary" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-title-md">shield_person</span>
            Cabildo / Promotor
          </button>
        </div>

        <div className="flex flex-col gap-space-xs">
          <label htmlFor="credencial" className="font-body text-label-lg text-on-surface">
            {mode === "medico" ? "Registro médico ReTHUS o correo clínico" : "Correo institucional del cabildo"}
          </label>
          <input
            id="credencial"
            type="text"
            placeholder={mode === "medico" ? "dr.intercultural@mida.gov.co" : "cabildo@mida.gov.co"}
            className="w-full bg-surface-container-low text-on-surface font-body text-body-md px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-space-xs">
          <label htmlFor="clave" className="font-body text-label-lg text-on-surface">
            Clave criptográfica institucional
          </label>
          <input
            id="clave"
            type="password"
            placeholder="••••••••••••"
            className="w-full bg-surface-container-low text-on-surface font-body text-body-md px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
          />
        </div>

        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-space-sm bg-primary hover:bg-primary-container text-on-primary font-heading text-headline-sm px-space-lg py-space-sm rounded-xl transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-headline-sm">shield</span>
          Ingresar al panel clínico experto
        </button>

        <p className="font-body text-body-sm text-on-surface-variant text-center">
          La autenticación real se conectará al backend cuando esté disponible.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/anthropometry"
          className="inline-flex items-center gap-space-xs text-secondary hover:text-primary font-body text-label-lg transition-colors"
        >
          <span className="material-symbols-outlined text-title-md">medical_services</span>
          ¿Requiere valoración sin credencial? Portal abierto antropométrico →
        </Link>
      </div>
    </div>
  );
}
