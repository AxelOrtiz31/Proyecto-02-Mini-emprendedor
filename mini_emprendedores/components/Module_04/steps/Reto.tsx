"use client";

interface RetoProps {
  onNext: () => void;
}

export function Reto({ onNext }: RetoProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Módulo 4 · Reto
      </span>

      <span className="text-6xl" aria-hidden="true">
        🎨
      </span>

      <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        ¡Le doy color a mi negocio!
      </h1>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        Ya sabes quién es tu cliente. Ahora toca darle identidad a tu negocio:
        un nombre, colores y un logo que todos puedan reconocer. ✨
      </p>

      <button
        type="button"
        onClick={onNext}
        className="mt-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        ¡Vamos a crearla! →
      </button>
    </main>
  );
}
