"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { fetchCatalogoInsignias, formatearFecha, type InsigniaCatalogo } from "@/lib/admin";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";

export default function AdminInsigniasPage() {
  const [insignias, setInsignias] = useState<InsigniaCatalogo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  function recargar() {
    setError(null);
    setInsignias(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    fetchCatalogoInsignias()
      .then((data) => {
        if (activo) setInsignias(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudieron cargar las insignias");
      });

    return () => {
      activo = false;
    };
  }, [nonce]);

  if (error) return <AdminError message={error} onRetry={recargar} />;
  if (!insignias) return <AdminLoading />;

  const totalOtorgadas = insignias.reduce((sum, i) => sum + i.totalAlumnos, 0);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">Insignias</h1>
        <p className="text-sm font-semibold text-muted-foreground">
          {insignias.length} insignias distintas otorgadas · {totalOtorgadas} en total entre todo el grupo
        </p>
      </header>

      {insignias.length === 0 ? (
        <p className="rounded-2xl bg-card p-8 text-center text-sm font-semibold text-muted-foreground shadow-(--shadow-card)">
          Todavía nadie ha ganado una insignia.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-(--shadow-card)">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Insignia</th>
                <th className="px-4 py-3">Módulo</th>
                <th className="px-4 py-3">Alumnos</th>
                <th className="px-4 py-3">Última vez otorgada</th>
              </tr>
            </thead>
            <tbody>
              {insignias.map((insignia) => (
                <tr key={insignia.nombre} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-bold text-foreground">
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/25 text-accent-foreground">
                      <Award className="h-4 w-4" />
                    </span>
                    {insignia.nombre}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {insignia.moduloNumero ? `Módulo ${insignia.moduloNumero}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{insignia.totalAlumnos}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatearFecha(insignia.ultimaObtenidaEn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
