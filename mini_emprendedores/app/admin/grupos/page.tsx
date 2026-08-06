"use client";

import { useEffect, useState } from "react";
import { fetchEscuelasAdmin, fetchGruposAdmin, type Escuela, type Grupo } from "@/lib/grupos";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";
import { SchoolsPanel } from "@/components/Admin/SchoolsPanel";
import { GroupsPanel } from "@/components/Admin/GroupsPanel";

export default function AdminGruposPage() {
  const [escuelas, setEscuelas] = useState<Escuela[] | null>(null);
  const [grupos, setGrupos] = useState<Grupo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  function recargar() {
    setError(null);
    setEscuelas(null);
    setGrupos(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    Promise.all([fetchEscuelasAdmin(), fetchGruposAdmin()])
      .then(([listaEscuelas, listaGrupos]) => {
        if (!activo) return;
        setEscuelas(listaEscuelas);
        setGrupos(listaGrupos);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudieron cargar los grupos");
      });

    return () => {
      activo = false;
    };
  }, [nonce]);

  if (error) return <AdminError message={error} onRetry={recargar} />;
  if (!escuelas || !grupos) return <AdminLoading />;

  const gruposActivos = grupos.filter((grupo) => grupo.activo).length;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">Grupos</h1>
        <p className="text-sm font-semibold text-muted-foreground">
          {escuelas.length} escuelas · {grupos.length} grupos · {gruposActivos} abiertos al registro
        </p>
      </header>

      <SchoolsPanel escuelas={escuelas} onCambio={recargar} onError={setError} />
      <GroupsPanel escuelas={escuelas} grupos={grupos} onCambio={recargar} onError={setError} />
    </div>
  );
}
