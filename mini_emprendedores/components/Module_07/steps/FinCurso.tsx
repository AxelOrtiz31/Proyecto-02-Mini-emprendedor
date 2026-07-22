"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio } from "@/lib/negocio";
import { playSfx } from "@/audio/AudioManager";

interface FinCursoProps {
  insignias: string[];
  competencias: string[];
  onNext: () => void;
}

export function FinCurso({ insignias, competencias, onNext }: FinCursoProps) {
  const [nombreNegocio, setNombreNegocio] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchMiNegocio().then((data) => {
      if (active) setNombreNegocio(data?.nombreNegocio ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="text-7xl" aria-hidden="true">
        👑
      </span>

      <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        ¡Terminaste todas las lecciones!
      </h1>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        Construiste {nombreNegocio ? `"${nombreNegocio}"` : "tu negocio"} desde
        cero: elegiste tu idea, tu cliente, tu marca, tus precios y aprendiste
        a presentarlo. Eres un verdadero emprendedor. 🎉
      </p>

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

      <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-success/40 bg-success/10 px-6 py-4">
        <p className="font-display text-base font-extrabold text-success">
          ⭐ +1000 XP
        </p>
        <p className="text-xs font-semibold text-success">
          Ahora falta tu última misión: la Evaluación Final
        </p>
      </div>

      <p className="max-w-sm text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Desarrollaste: {competencias.join(" · ")}
      </p>

      <button
        type="button"
        onClick={() => {
          playSfx("click");
          onNext();
        }}
        className="mt-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        Ir a mi Evaluación Final →
      </button>
    </main>
  );
}
