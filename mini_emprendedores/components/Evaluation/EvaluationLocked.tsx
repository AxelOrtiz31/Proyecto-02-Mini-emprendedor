"use client";

import { Lock } from "lucide-react";

interface EvaluationLockedProps {
  onBack: () => void;
}

export function EvaluationLocked({ onBack }: EvaluationLockedProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <Lock className="h-6 w-6" strokeWidth={2.6} />
        </div>
        <p className="font-display text-xl font-extrabold text-foreground">
          La evaluación final está bloqueada
        </p>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          Completa todas las secciones de tu camino para desbloquearla. ¡Ya
          falta poco!
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 rounded-2xl bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
        >
          Volver al camino
        </button>
      </div>
    </main>
  );
}
