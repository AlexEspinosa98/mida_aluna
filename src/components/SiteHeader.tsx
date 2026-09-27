"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const navItems = user
    ? [
        { href: "/anthropometry", label: "Nuevo reporte antropométrico" },
        ...(user.rol === "superadmin" ? [{ href: "/admin", label: "Usuarios" }] : []),
      ]
    : [];

  function handleLogout() {
    logout();
    router.push("/medical-access");
  }

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

        <nav className="hidden lg:flex items-center gap-space-sm p-space-xs bg-surface-container rounded-xl empty:hidden">
          {navItems.map((item) => {
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
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="font-body text-label-lg text-on-surface">{user.nombre}</span>
                <span className="font-body text-label-sm text-tertiary-container uppercase tracking-wider">
                  {user.rol}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-heading text-label-md shrink-0">
                {user.nombre.slice(0, 2).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-title-md">logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/medical-access"
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-body text-label-lg hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-title-md">login</span>
              <span className="hidden sm:inline">Acceso médico</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
