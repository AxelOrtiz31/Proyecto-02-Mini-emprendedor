"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvaluationOption } from "@/lib/evaluations";
import { playSfx } from "@/audio/AudioManager";

interface OptionButtonProps {
  option: EvaluationOption;
  selected: boolean;
  showResult: boolean;
  onToggle: (optionId: number) => void;
}

export function OptionButton({
  option,
  selected,
  showResult,
  onToggle,
}: OptionButtonProps) {
  const showCorrect = showResult && option.isCorrect;
  const showWrong = showResult && selected && !option.isCorrect;

  return (
    <button
      type="button"
      onClick={() => {
        onToggle(option.id);
        playSfx("respuestas");
      }}
      className={cn(
        "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border-2 bg-card px-4 py-4 text-left transition-all active:translate-y-0.5 sm:px-5 sm:py-5",
        !selected && !showCorrect && "border-border shadow-(--shadow-card)",
        selected &&
          !showResult &&
          "border-primary bg-primary/10 shadow-(--shadow-node)",
        showCorrect &&
          "border-success bg-success/10 shadow-(--shadow-node-success)",
        showWrong &&
          "border-primary bg-primary/10 shadow-(--shadow-node)",
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-2xl sm:h-12 sm:w-12">
        {option.emoji}
      </span>

      <span
        className={cn(
          "min-w-0 text-base font-extrabold sm:text-lg",
          selected && !showResult && "text-primary",
          showCorrect && "text-success",
          showWrong && "text-primary",
          !selected && !showCorrect && "text-foreground",
        )}
      >
        {option.label}
      </span>

      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors",
          !selected && !showCorrect && "border-border",
          selected && !showResult && "border-primary bg-primary",
          showCorrect && "border-success bg-success",
          showWrong && "border-primary bg-primary",
        )}
      >
        {showCorrect ? (
          <Check className="h-4 w-4 text-success-foreground" strokeWidth={4} />
        ) : showWrong ? (
          <X className="h-4 w-4 text-primary-foreground" strokeWidth={4} />
        ) : selected ? (
          <Check className="h-4 w-4 text-primary-foreground" strokeWidth={4} />
        ) : null}
      </span>
    </button>
  );
}