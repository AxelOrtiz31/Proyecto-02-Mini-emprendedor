"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { fetchCurrentProfileRole, isStaffRole } from "@/lib/admin";
import { AdminShell } from "@/components/Admin/AdminShell";

// Puerta de acceso del panel. La seguridad real la imponen las políticas RLS
// (admin_module.sql); esta verificación evita que un alumno vea la interfaz.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [estado, setEstado] = useState<"verificando" | "permitido">("verificando");

  useEffect(() => {
    let activo = true;

    async function verificar() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      const rol = await fetchCurrentProfileRole();

      if (!activo) return;

      if (isStaffRole(rol)) {
        setEstado("permitido");
      } else {
        router.replace("/dashboard");
      }
    }

    verificar();

    return () => {
      activo = false;
    };
  }, [router]);

  if (estado === "verificando") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
