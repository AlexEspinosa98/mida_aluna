"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard Territorial" },
  { href: "/anthropometry", label: "Portal Abierto / Valoración Antropométrica" },
  { href: "/medical-access", label: "Acceso Médico / Clínico Especializado" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(43,43,43,0.04)]">
      <div className="h-20 w-full max-w-7xl mx-auto px-gutter flex items-center justify-between gap-space-md">
        <Link href="/anthropometry" className="flex items-center gap-space-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mida-logo.svg" alt="MIDA · Medición Inteligente Diferencial Aplicada" className="h-9 w-auto" />
          <div className="hidden sm:flex flex-col border-l border-outline-variant pl-space-md">
            <span className="font-heading text-label-lg text-primary leading-none">ALUNA IA</span>
            <span className="font-body text-label-sm text-tertiary-container tracking-wider uppercase mt-space-xs">
              Pueblo Kággaba · Sierra Nevada
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-space-sm p-space-xs bg-surface-container rounded-xl">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-space-md py-space-sm font-body text-label-lg transition-colors rounded-lg ${
                  active
                    ? "bg-primary-container text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-md">
          <div className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high">
            <span className="w-2 h-2 rounded-full bg-surface-tint animate-pulse" />
            <span className="font-body text-label-sm text-on-surface-variant">
              Sincronizado CARE
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-heading text-label-md">
            KA
          </div>
        </div>
      </div>
    </header>
  );
}
