"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { etiquetaGrupo, type Grupo } from "@/lib/grupos";

export type FiltroEstado = "todos" | "activos" | "inactivos";

interface StudentFiltersProps {
  busqueda: string;
  onBusqueda: (valor: string) => void;
  estado: FiltroEstado;
  onEstado: (estado: FiltroEstado) => void;
  grupos: Grupo[];
  escuelaId: number | null;
  onEscuela: (escuelaId: number | null) => void;
  grupoId: number | null;
  onGrupo: (grupoId: number | null) => void;
}

const ESTADOS: { valor: FiltroEstado; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "activos", label: "Activos" },
  { valor: "inactivos", label: "Inactivos" },
];

const SELECT =
  "rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary";

export function StudentFilters({
  busqueda,
  onBusqueda,
  estado,
  onEstado,
  grupos,
  escuelaId,
  onEscuela,
  grupoId,
  onGrupo,
}: StudentFiltersProps) {
  const escuelas = escuelasDe(grupos);
  const salones = escuelaId === null ? grupos : grupos.filter((g) => g.escuelaId === escuelaId);

  function cambiarEscuela(valor: string) {
    onEscuela(valor ? Number(valor) : null);
    onGrupo(null);
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-2 transition-colors focus-within:border-primary sm:w-56">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={busqueda}
            onChange={(event) => onBusqueda(event.target.value)}
            placeholder="Buscar alumno..."
            className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </div>

        <select
          className={SELECT}
          value={escuelaId ?? ""}
          onChange={(event) => cambiarEscuela(event.target.value)}
          aria-label="Filtrar por escuela"
        >
          <option value="">Todas las escuelas</option>
          {escuelas.map((escuela) => (
            <option key={escuela.id} value={escuela.id}>
              {escuela.nombre}
            </option>
          ))}
        </select>

        <select
          className={SELECT}
          value={grupoId ?? ""}
          onChange={(event) => onGrupo(event.target.value ? Number(event.target.value) : null)}
          aria-label="Filtrar por grupo"
        >
          <option value="">Todos los grupos</option>
          {salones.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {etiquetaGrupo(grupo)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1 self-start rounded-xl bg-muted p-1">
        {ESTADOS.map((item) => (
          <button
            key={item.valor}
            type="button"
            onClick={() => onEstado(item.valor)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
              estado === item.valor
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function escuelasDe(grupos: Grupo[]): { id: number; nombre: string }[] {
  const porId = new Map<number, string>();

  for (const grupo of grupos) {
    porId.set(grupo.escuelaId, grupo.escuelaNombre);
  }

  return [...porId.entries()]
    .map(([id, nombre]) => ({ id, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}
