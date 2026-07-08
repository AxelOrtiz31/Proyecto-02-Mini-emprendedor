"use client";

interface EvaluationErrorProps {
  onBack: () => void;
}

export function EvaluationError({ onBack }: EvaluationErrorProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <p className="font-display text-xl font-extrabold text-foreground">
          No pudimos cargar las preguntas
        </p>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          Revisa tu conexión e inténtalo de nuevo en un momento.
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
