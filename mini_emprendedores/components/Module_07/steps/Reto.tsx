"use client";

export function Reto({ onNext }: { onNext: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Módulo 7 · Reto final
      </span>

      <span className="text-6xl" aria-hidden="true">
        🎤
      </span>

      <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        ¡A vender!
      </h1>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        Construiste tu negocio paso a paso. Ahora aprenderás a presentarlo y
        convencer a tus clientes de que lo elijan. 🚀
      </p>

      <button
        type="button"
        onClick={onNext}
        className="mt-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        ¡Es mi turno! →
      </button>
    </main>
  );
}
