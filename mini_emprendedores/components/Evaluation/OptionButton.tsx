"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvaluationOption } from "@/lib/evaluations";
import { playSfx } from "@/audio/AudioManager";

interface OptionButtonProps {
  option: EvaluationOption;
  selected: boolean;
  onToggle: (optionId: number) => void;
}

// La opción solo tiene dos estados visuales: sin seleccionar y seleccionada.
// No existe un estado "correcta" o "incorrecta" para no revelar la respuesta
// mientras el alumno contesta el examen final.
export function OptionButton({
  option,
  selected,
  onToggle,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        onToggle(option.id);
        playSfx("respuestas");
      }}
      className={cn(
        "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border-2 bg-card px-4 py-4 text-left transition-all active:translate-y-0.5 sm:px-5 sm:py-5",
        selected
          ? "border-primary bg-primary/10 shadow-(--shadow-node)"
          : "border-border shadow-(--shadow-card)",
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-2xl sm:h-12 sm:w-12">
        {option.emoji}
      </span>

      <span
        className={cn(
          "min-w-0 text-base font-extrabold sm:text-lg",
          selected ? "text-primary" : "text-foreground",
        )}
      >
        {option.label}
      </span>

      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors",
          selected ? "border-primary bg-primary" : "border-border",
        )}
      >
        {selected && (
          <Check className="h-4 w-4 text-primary-foreground" strokeWidth={4} />
        )}
      </span>
    </button>
  );
}
