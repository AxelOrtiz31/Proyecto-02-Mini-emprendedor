"use client";

export function Historia({ onNext }: { onNext: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
        Historias que inspiran
      </span>

      <span className="text-6xl" aria-hidden="true">
        💫
      </span>

      <h1 className="max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        Ana y sus pulseras
      </h1>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        Ana notó que a sus compañeros de escuela les encantaban las pulseras
        de colores. En vez de solo desearlas, decidió crearlas ella misma y
        venderlas. 🎨
      </p>

      <p className="max-w-sm rounded-2xl border-2 border-border bg-card px-5 py-4 text-sm font-bold text-foreground shadow-(--shadow-card) sm:text-base">
        Ana tuvo una idea, y trabajó para hacerla realidad. Eso es
        exactamente lo que hace un{" "}
        <span className="text-primary">emprendedor</span>. 🚀
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
