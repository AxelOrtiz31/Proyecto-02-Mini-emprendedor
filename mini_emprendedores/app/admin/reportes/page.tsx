"use client";

import { useEffect, useState } from "react";
import { fetchReporteGrupo, type AlumnoResumen, type KpisGlobales } from "@/lib/admin";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";
import { ModuleFunnel } from "@/components/Admin/ModuleFunnel";
import { SkillDistribution } from "@/components/Admin/SkillDistribution";
import { ReportsPanel } from "@/components/Admin/ReportsPanel";

interface Datos {
  resumen: AlumnoResumen[];
  kpis: KpisGlobales;
}

export default function AdminReportesPage() {
  const [datos, setDatos] = useState<Datos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  function recargar() {
    setError(null);
    setDatos(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    fetchReporteGrupo()
      .then((data) => {
        if (activo) setDatos(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudo cargar el reporte");
      });

    return () => {
      activo = false;
    };
  }, [nonce]);

  if (error) return <AdminError message={error} onRetry={recargar} />;
  if (!datos) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">Reportes</h1>
        <p className="text-sm font-semibold text-muted-foreground">
          Descarga el avance del grupo en PDF o CSV
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <ModuleFunnel embudo={datos.kpis.embudoModulos} total={datos.kpis.totalAlumnos} />
        <SkillDistribution distribucion={datos.kpis.distribucionHabilidad} />
      </div>

      <ReportsPanel resumen={datos.resumen} kpis={datos.kpis} />
    </div>
  );
}
