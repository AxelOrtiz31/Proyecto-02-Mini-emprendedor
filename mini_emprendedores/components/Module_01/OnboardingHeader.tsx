"use client";

import { ArrowLeft } from "lucide-react";

interface OnboardingHeaderProps {
  title: string;
  step: number;
  total: number;
  onBack: () => void;
}

export function OnboardingHeader({ title, step, total, onBack }: OnboardingHeaderProps) {
  return (
    <div className="mx-auto flex w-full max-w-md items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Atrás"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-border bg-card text-primary transition-transform active:translate-y-0.5"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black uppercase tracking-wider text-primary">
          Módulo de preguntas
        </p>
        <p className="truncate font-display text-sm font-extrabold text-foreground">
          {title}
        </p>
      </div>

      <span className="shrink-0 text-sm font-black text-muted-foreground">
        {step + 1}/{total}
      </span>
    </div>
  );
}
