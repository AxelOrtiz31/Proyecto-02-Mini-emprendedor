"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OpcionLocal {
  key: string;
  id?: number;
  etiqueta: string;
  valor: number;
  emoji: string | null;
  esCorrecta: boolean;
  orden: number;
}

interface OptionRowProps {
  opcion: OpcionLocal;
  onChange: (patch: Partial<OpcionLocal>) => void;
  onDelete: () => void;
}

const INPUT =
  "rounded-lg border-2 border-border bg-card px-2 py-1.5 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary";

export function OptionRow({ opcion, onChange, onDelete }: OptionRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-secondary/40 p-2">
      <input
        className={cn(INPUT, "w-14 text-center")}
        value={opcion.emoji ?? ""}
        onChange={(event) => onChange({ emoji: event.target.value || null })}
        placeholder="🙂"
        aria-label="Emoji"
      />
      <input
        className={cn(INPUT, "min-w-0 flex-1")}
        value={opcion.etiqueta}
        onChange={(event) => onChange({ etiqueta: event.target.value })}
        placeholder="Texto de la respuesta"
        aria-label="Texto de la respuesta"
      />
      <input
        type="number"
        min={1}
        className={cn(INPUT, "w-16")}
        value={opcion.valor}
        onChange={(event) => onChange({ valor: parseInt(event.target.value, 10) || 1 })}
        aria-label="Valor"
        title="Valor. En el test inicial define la habilidad (1-4)."
      />
      <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
        <input
          type="checkbox"
          checked={opcion.esCorrecta}
          onChange={(event) => onChange({ esCorrecta: event.target.checked })}
          className="h-4 w-4 accent-success"
        />
        Correcta
      </label>
      <button
        type="button"
        onClick={onDelete}
        title="Eliminar opción"
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
