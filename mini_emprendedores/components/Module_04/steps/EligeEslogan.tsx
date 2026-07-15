"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio } from "@/lib/negocio";

interface EligeEsloganProps {
  onSaved: (eslogan: string) => void;
}

export function EligeEslogan({ onSaved }: EligeEsloganProps) {
  const [nombreNegocio, setNombreNegocio] = useState<string | null>(null);
  const [eslogan, setEslogan] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMiNegocio().then((negocio) => {
      if (active && negocio?.nombreNegocio) setNombreNegocio(negocio.nombreNegocio);
    });
    return () => {
      active = false;
    };
  }, []);

  function confirmar() {
    const limpio = eslogan.trim();
    if (!limpio) return;
    setGuardando(true);
    onSaved(limpio);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Aplícalo a tu negocio
      </span>

      <h1 className="max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        {nombreNegocio ? `¿Cuál será el eslogan de "${nombreNegocio}"?` : "¿Cuál será tu eslogan?"}
      </h1>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground">
        Una frase corta y fácil de recordar que diga por qué tu negocio es
        especial.
      </p>

      <input
        value={eslogan}
        onChange={(e) => setEslogan(e.target.value.slice(0, 60))}
        placeholder="Ej. Hecho con amor, para ti"
        className="w-full max-w-sm rounded-2xl border-2 border-border bg-card px-5 py-4 text-center font-display text-lg font-extrabold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
      />

      <button
        type="button"
        onClick={confirmar}
        disabled={!eslogan.trim() || guardando}
        className="mt-2 w-full max-w-sm rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        {guardando ? "Guardando..." : "Confirmar eslogan →"}
      </button>
    </main>
  );
}
