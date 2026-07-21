"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio, type MiNegocio } from "@/lib/negocio";
import { playSfx } from "@/audio/AudioManager";

interface ResumenNegocioProps {
  onNext: () => void;
}

export function ResumenNegocio({ onNext }: ResumenNegocioProps) {
  const [negocio, setNegocio] = useState<MiNegocio | null>(null);

  useEffect(() => {
    let active = true;
    fetchMiNegocio().then((data) => {
      if (active) setNegocio(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
        Gran reto final · Presenta tu emprendimiento
      </span>

      <h1 className="mt-4 max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        Este es tu negocio hasta ahora
      </h1>

      <div
        className="mt-5 flex w-full max-w-sm flex-col items-center gap-2 rounded-3xl border-4 px-6 py-6 shadow-(--shadow-card)"
        style={{
          borderColor: negocio?.colorPrimario ?? "#FFD93D",
          backgroundColor: `${negocio?.colorPrimario ?? "#FFD93D"}15`,
        }}
      >
        <span className="text-4xl">{negocio?.logoIcono ?? "⭐"}</span>
        <h2 className="font-display text-lg font-extrabold text-foreground">
          {negocio?.nombreNegocio ?? "Mi negocio"}
        </h2>
        {negocio?.eslogan && (
          <p className="text-sm font-bold italic text-foreground">&ldquo;{negocio.eslogan}&rdquo;</p>
        )}
        <p className="text-xs font-bold text-muted-foreground">
          {negocio?.ideaNombre ?? "Mi idea"} ·{" "}
          {negocio?.ideaTipo === "servicio" ? "Servicio" : "Producto"}
        </p>
        {negocio?.clienteNombre && (
          <p className="text-xs font-semibold text-muted-foreground">
            Para {negocio.clienteEmoji} {negocio.clienteNombre.toLowerCase()}
          </p>
        )}
        {negocio?.empaqueMaterial && (
          <p className="text-xs font-semibold text-muted-foreground">
            📦 Empaque: {negocio.empaqueMaterial}
          </p>
        )}
        {negocio?.ideaGanancia !== null && negocio?.ideaGanancia !== undefined && (
          <p className="text-xs font-extrabold text-success">
            📈 Ganancia: ${negocio.ideaGanancia.toFixed(2)} por producto
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          onNext();
          playSfx("click");
        }}
        className="mt-8 w-full max-w-sm rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        Continuar →
      </button>
    </main>
  );
}
