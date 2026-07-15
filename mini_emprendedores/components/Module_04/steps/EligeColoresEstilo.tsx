"use client";

import { useState } from "react";
import { COLORES_MARCA, ESTILOS_MARCA, type ColorMarca, type EstiloMarca } from "../data";

interface EligeColoresEstiloProps {
  onSaved: (colores: { primario: ColorMarca; secundario: ColorMarca }, estilo: EstiloMarca) => void;
}

export function EligeColoresEstilo({ onSaved }: EligeColoresEstiloProps) {
  const [primario, setPrimario] = useState<ColorMarca | null>(null);
  const [secundario, setSecundario] = useState<ColorMarca | null>(null);
  const [estilo, setEstilo] = useState<EstiloMarca | null>(null);
  const [guardando, setGuardando] = useState(false);

  function elegirColor(color: ColorMarca) {
    if (primario?.id === color.id) {
      setPrimario(null);
      return;
    }
    if (secundario?.id === color.id) {
      setSecundario(null);
      return;
    }
    if (!primario) {
      setPrimario(color);
      return;
    }
    if (!secundario) {
      setSecundario(color);
    }
  }

  const listo = primario && secundario && estilo;

  function confirmar() {
    if (!primario || !secundario || !estilo) return;
    setGuardando(true);
    onSaved({ primario, secundario }, estilo);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 pb-8 pt-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center text-center">
        <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
          Aplícalo a tu negocio
        </span>

        <h1 className="mt-4 font-display text-lg font-extrabold text-foreground sm:text-xl">
          Elige 2 colores para tu marca
        </h1>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {COLORES_MARCA.map((color) => {
            const selected = primario?.id === color.id || secundario?.id === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => elegirColor(color)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 transition-transform active:translate-y-0.5 ${
                  selected ? "border-primary shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
                }`}
                style={{ backgroundColor: `${color.hex}22` }}
              >
                <span
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-extrabold text-foreground">
                  {color.nombre}
                </span>
              </button>
            );
          })}
        </div>

        <h2 className="mt-8 font-display text-lg font-extrabold text-foreground sm:text-xl">
          ¿Cuál es la personalidad de tu negocio?
        </h2>

        <div className="mt-4 flex w-full flex-col gap-2">
          {ESTILOS_MARCA.map((op) => {
            const selected = estilo?.id === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => setEstilo(op)}
                className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 text-left transition-all active:translate-y-0.5 ${
                  selected ? "border-primary bg-primary/10 shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
                }`}
              >
                <span className="text-2xl">{op.emoji}</span>
                <span>
                  <span className="block font-display text-sm font-extrabold text-foreground">
                    {op.nombre}
                  </span>
                  <span className="block text-xs font-semibold text-muted-foreground">
                    {op.descripcion}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 w-full">
          <button
            type="button"
            onClick={confirmar}
            disabled={!listo || guardando}
            className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {guardando ? "Guardando..." : listo ? "Confirmar →" : "Elige 2 colores y un estilo"}
          </button>
        </div>
      </div>
    </main>
  );
}
