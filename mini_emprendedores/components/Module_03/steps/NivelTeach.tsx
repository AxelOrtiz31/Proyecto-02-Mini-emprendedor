"use client";

import type { Nivel } from "../data";

interface NivelTeachProps {
  nivel: Nivel;
  totalNiveles: number;
  onNext: () => void;
}

export function NivelTeach({ nivel, totalNiveles, onNext }: NivelTeachProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Nivel {nivel.numero} de {totalNiveles}
      </span>

      <span className="text-6xl" aria-hidden="true">
        {nivel.emoji}
      </span>

      <h1 className="max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        {nivel.titulo}
      </h1>

      <p className="max-w-sm rounded-2xl border-2 border-border bg-card px-5 py-4 text-sm font-bold text-foreground shadow-(--shadow-card) sm:text-base">
        🤖 <span className="text-primary">EmprenBot dice:</span> &ldquo;
        {nivel.emprenbot}&rdquo;
      </p>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        {nivel.explicacion}
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
