"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, TrendingUp, Zap, GraduationCap, Activity } from "lucide-react";
import { fetchKpisGlobales, type KpisGlobales } from "@/lib/admin";
import { KpiCard } from "@/components/Admin/KpiCard";
import { ModuleFunnel } from "@/components/Admin/ModuleFunnel";
import { SkillDistribution } from "@/components/Admin/SkillDistribution";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";

export default function AdminResumenPage() {
  const [kpis, setKpis] = useState<KpisGlobales | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  function recargar() {
    setError(null);
    setKpis(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    fetchKpisGlobales()
      .then((data) => {
        if (activo) setKpis(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudo cargar el resumen");
      });

    return () => {
      activo = false;
    };
  }, [nonce]);

  if (error) return <AdminError message={error} onRetry={recargar} />;
  if (!kpis) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
          Resumen del taller
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">Avance general del grupo</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KpiCard label="Alumnos" value={kpis.totalAlumnos} icon={<Users className="h-5 w-5" />} tone="primary" />
        <KpiCard
          label="Activos"
          value={kpis.alumnosActivos}
          icon={<UserCheck className="h-5 w-5" />}
          tone="success"
        />
        <KpiCard
          label="Avance promedio"
          value={`${kpis.promedioAvance}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="info"
        />
        <KpiCard
          label="XP del grupo"
          value={kpis.xpTotalGrupo}
          icon={<Zap className="h-5 w-5" />}
          tone="accent"
        />
        <KpiCard
          label="Cursos completos"
          value={kpis.cursosCompletados}
          icon={<GraduationCap className="h-5 w-5" />}
          tone="success"
        />
        <KpiCard
          label="Con actividad"
          value={kpis.alumnosConActividad}
          icon={<Activity className="h-5 w-5" />}
          tone="primary"
          hint={`de ${kpis.totalAlumnos} alumnos`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ModuleFunnel embudo={kpis.embudoModulos} total={kpis.totalAlumnos} />
        <SkillDistribution distribucion={kpis.distribucionHabilidad} />
      </div>
    </div>
  );
}
