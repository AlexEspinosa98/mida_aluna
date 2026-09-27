"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: UserRole;
}

export default function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const roleMismatch = !!user && !!requireRole && user.rol !== requireRole;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/medical-access");
    } else if (roleMismatch) {
      router.replace("/anthropometry");
    }
  }, [loading, user, roleMismatch, router]);

  if (loading || !user || roleMismatch) {
    return (
      <div className="w-full max-w-6xl mx-auto px-gutter py-space-xl flex items-center justify-center">
        <span className="font-body text-body-md text-on-surface-variant">
          {roleMismatch ? "No tienes permisos para ver esta sección…" : "Verificando sesión médica…"}
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
