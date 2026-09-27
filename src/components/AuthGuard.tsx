"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/medical-access");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="w-full max-w-6xl mx-auto px-gutter py-space-xl flex items-center justify-center">
        <span className="font-body text-body-md text-on-surface-variant">
          Verificando sesión médica…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
