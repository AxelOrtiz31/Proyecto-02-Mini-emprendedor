"use client";

import { School, Layers, Users } from "lucide-react";
import { type Grupo } from "@/lib/grupos";
import { cn } from "@/lib/utils";

// Cascada Escuela -> Grado -> Grupo. Recibe la lista completa de grupos por
// props y solo avisa el id elegido; la usan el registro del alumno y el modal
// de edición del panel.

interface GroupPickerProps {
  grupos: Grupo[];
  escuelaId: number | null;
  grado: string | null;
  grupoId: number | null;
  onEscuela: (escuelaId: number | null) => void;
  onGrado: (grado: string | null) => void;
  onGrupo: (grupoId: number | null) => void;
  onFocus?: (campo: string) => void;
  onBlur?: () => void;
  error?: string;
}

const SELECT_BASE =
  "w-full bg-transparent font-semibold text-foreground outline-none disabled:text-muted-foreground/60";

export function GroupPicker({
  grupos,
  escuelaId,
  grado,
  grupoId,
  onEscuela,
  onGrado,
  onGrupo,
  onFocus,
  onBlur,
  error,
}: GroupPickerProps) {
  const escuelas = escuelasDe(grupos);
  const grados = gradosDe(grupos, escuelaId);
  const salones = salonesDe(grupos, escuelaId, grado);

  function cambiarEscuela(valor: string) {
    onEscuela(valor ? Number(valor) : null);
    onGrado(null);
    onGrupo(null);
  }

  function cambiarGrado(valor: string) {
    onGrado(valor || null);
    onGrupo(null);
  }

  return (
    <div className="space-y-3">
      <Campo icon={School} hasError={Boolean(error)}>
        <select
          className={SELECT_BASE}
          value={escuelaId ?? ""}
          onChange={(e) => cambiarEscuela(e.target.value)}
          onFocus={() => onFocus?.("escuela")}
          onBlur={onBlur}
          aria-label="Escuela"
        >
          <option value="">Elige tu escuela</option>
          {escuelas.map((escuela) => (
            <option key={escuela.id} value={escuela.id}>
              {escuela.nombre}
            </option>
          ))}
        </select>
      </Campo>

      <div className="grid grid-cols-2 gap-3">
        <Campo icon={Layers} hasError={Boolean(error)}>
          <select
            className={SELECT_BASE}
            value={grado ?? ""}
            onChange={(e) => cambiarGrado(e.target.value)}
            onFocus={() => onFocus?.("grado")}
            onBlur={onBlur}
            disabled={escuelaId === null}
            aria-label="Grado"
          >
            <option value="">Grado</option>
            {grados.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>
        </Campo>

        <Campo icon={Users} hasError={Boolean(error)}>
          <select
            className={SELECT_BASE}
            value={grupoId ?? ""}
            onChange={(e) => onGrupo(e.target.value ? Number(e.target.value) : null)}
            onFocus={() => onFocus?.("grupo")}
            onBlur={onBlur}
            disabled={grado === null}
            aria-label="Grupo"
          >
            <option value="">Grupo</option>
            {salones.map((salon) => (
              <option key={salon.id} value={salon.id}>
                {salon.nombre}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      {error && <p className="pl-2 text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}

function Campo({
  icon: Icon,
  hasError,
  children,
}: {
  icon: typeof School;
  hasError: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 transition-all focus-within:ring-4",
        hasError
          ? "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/15"
          : "border-border focus-within:border-primary focus-within:ring-primary/15",
      )}
    >
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
      {children}
    </div>
  );
}

// ============================================================
// Derivaciones de la cascada
// ============================================================

function escuelasDe(grupos: Grupo[]): { id: number; nombre: string }[] {
  const porId = new Map<number, string>();

  for (const grupo of grupos) {
    porId.set(grupo.escuelaId, grupo.escuelaNombre);
  }

  return [...porId.entries()]
    .map(([id, nombre]) => ({ id, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function gradosDe(grupos: Grupo[], escuelaId: number | null): string[] {
  if (escuelaId === null) return [];

  const grados = new Set(
    grupos.filter((grupo) => grupo.escuelaId === escuelaId).map((grupo) => grupo.grado),
  );

  return [...grados].sort((a, b) => a.localeCompare(b, "es"));
}

function salonesDe(grupos: Grupo[], escuelaId: number | null, grado: string | null): Grupo[] {
  if (escuelaId === null || grado === null) return [];

  return grupos
    .filter((grupo) => grupo.escuelaId === escuelaId && grupo.grado === grado)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

// Los tres valores de la cascada que corresponden a un grupo ya guardado.
export function cascadaDeGrupo(grupos: Grupo[], grupoId: number | null) {
  const grupo = grupos.find((item) => item.id === grupoId);

  return {
    escuelaId: grupo?.escuelaId ?? null,
    grado: grupo?.grado ?? null,
    grupoId: grupo?.id ?? null,
  };
}
