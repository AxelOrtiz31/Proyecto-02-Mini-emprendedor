"use client";

interface FinBloqueProps {
  insignias: string[];
  xp: number;
  competencias: string[];
  onNext: () => void;
}

export function FinBloque({ insignias, xp, competencias, onNext }: FinBloqueProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="text-6xl" aria-hidden="true">
        🌟
      </span>

      <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        ¡Terminaste el Módulo 2!
      </h1>

      <div className="flex w-full max-w-sm flex-wrap items-center justify-center gap-2">
        {insignias.map((nombre) => (
          <span
            key={nombre}
            className="rounded-full border-2 border-accent bg-accent/10 px-3 py-1.5 text-xs font-extrabold text-accent-foreground"
          >
            🏅 {nombre}
          </span>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-success/40 bg-success/10 px-5 py-3 font-display text-base font-extrabold text-success">
        ⭐ +{xp} XP ganados
      </div>

      <p className="max-w-sm text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Desarrollaste: {competencias.join(" · ")}
      </p>

      <button
        type="button"
        onClick={onNext}
        className="mt-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        Continuar →
      </button>
    </main>
  );
}
