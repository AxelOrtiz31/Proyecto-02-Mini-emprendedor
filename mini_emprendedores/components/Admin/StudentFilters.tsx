"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type FiltroEstado = "todos" | "activos" | "inactivos";

interface StudentFiltersProps {
  busqueda: string;
  onBusqueda: (valor: string) => void;
  estado: FiltroEstado;
  onEstado: (estado: FiltroEstado) => void;
}

const ESTADOS: { valor: FiltroEstado; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "activos", label: "Activos" },
  { valor: "inactivos", label: "Inactivos" },
];

export function StudentFilters({ busqueda, onBusqueda, estado, onEstado }: StudentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-2 transition-colors focus-within:border-primary sm:w-72">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={busqueda}
          onChange={(event) => onBusqueda(event.target.value)}
          placeholder="Buscar alumno..."
          className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/70"
        />
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
