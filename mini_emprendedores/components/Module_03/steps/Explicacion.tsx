"use client";

export function Explicacion({ onNext }: { onNext: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        ¿Qué aprendimos?
      </span>

      <h1 className="max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        Un cliente es quien quiere lo que tú ofreces
      </h1>

      <div className="flex w-full max-w-sm items-center justify-center gap-4">
        <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-4 shadow-(--shadow-card)">
          <span className="text-4xl" aria-hidden="true">
            👶
          </span>
          <p className="text-xs font-bold text-muted-foreground">
            No necesita una laptop
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-4 shadow-(--shadow-card)">
          <span className="text-4xl" aria-hidden="true">
            🧓
          </span>
          <p className="text-xs font-bold text-muted-foreground">
            No necesita pañales
          </p>
        </div>
      </div>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        No todas las personas quieren o necesitan lo mismo. Por eso, antes de
        vender algo, un buen emprendedor primero piensa:{" "}
        <span className="font-extrabold text-foreground">
          ¿a quién le puede interesar esto?
        </span>
      </p>

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
