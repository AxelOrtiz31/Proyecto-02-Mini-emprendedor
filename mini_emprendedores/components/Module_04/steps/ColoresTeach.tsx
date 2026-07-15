"use client";

import { useState } from "react";
import { COLORES_MARCA } from "../data";

interface ColoresTeachProps {
  onNext: () => void;
}

export function ColoresTeach({ onNext }: ColoresTeachProps) {
  const [index, setIndex] = useState(0);
  const color = COLORES_MARCA[index];
  const esUltimo = index === COLORES_MARCA.length - 1;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Los colores cuentan una historia
      </span>

      <div
        className="flex w-full max-w-xs flex-col items-center gap-3 rounded-3xl border-2 border-border px-6 py-8 shadow-(--shadow-card)"
        style={{ backgroundColor: `${color.hex}22` }}
      >
        <span
          className="grid h-16 w-16 place-items-center rounded-full text-3xl shadow-(--shadow-node)"
          style={{ backgroundColor: color.hex }}
        >
          {color.emoji}
        </span>
        <h2 className="font-display text-xl font-extrabold text-foreground">
          {color.nombre}
        </h2>
        <p className="text-sm font-extrabold text-foreground">
          Transmite: {color.sensacion}
        </p>
        <p className="text-xs font-semibold text-muted-foreground">
          Se usa en: {color.ejemplo}
        </p>
      </div>

      <div className="flex gap-2">
        {COLORES_MARCA.map((c, i) => (
          <span
            key={c.id}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => (esUltimo ? onNext() : setIndex(index + 1))}
        className="w-full max-w-xs rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        {esUltimo ? "Elegir mis colores →" : "Siguiente color →"}
      </button>
    </main>
  );
}
