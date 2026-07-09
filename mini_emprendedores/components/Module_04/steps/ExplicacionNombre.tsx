"use client";

export function ExplicacionNombre({ onNext }: { onNext: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
        ¿Qué hace bueno un nombre?
      </span>

      <span className="text-6xl" aria-hidden="true">
        🏷️
      </span>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        El nombre es lo primero que tus clientes van a recordar. Un buen
        nombre de negocio es:
      </p>

      <ul className="w-full max-w-sm space-y-2 text-left">
        <li className="rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-(--shadow-card)">
          ✂️ Corto y fácil de recordar
        </li>
        <li className="rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-(--shadow-card)">
          🔗 Relacionado con lo que vendes
        </li>
        <li className="rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-(--shadow-card)">
          😀 Agradable de decir en voz alta
        </li>
      </ul>

      <button
        type="button"
        onClick={onNext}
        className="mt-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        Ya entendí →
      </button>
    </main>
  );
}
