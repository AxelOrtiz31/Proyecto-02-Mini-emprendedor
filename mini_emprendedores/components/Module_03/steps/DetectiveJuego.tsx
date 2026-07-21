"use client";

import { useState } from "react";
import { DETECTIVE_PARES } from "../data";
import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";

interface DetectiveJuegoProps {
  onDone: () => void;
}

export function DetectiveJuego({ onDone }: DetectiveJuegoProps) {
  const [seleccionNegocio, setSeleccionNegocio] = useState<number | null>(null);
  const [emparejados, setEmparejados] = useState<number[]>([]);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);

  const completo = emparejados.length === DETECTIVE_PARES.length;

  function elegirNegocio(i: number) {
    if (emparejados.includes(i)) return;
    setSeleccionNegocio(i);
    setErrorIndex(null);
  }

  function elegirCliente(i: number) {
    if (seleccionNegocio === null || emparejados.includes(i)) return;

    if (seleccionNegocio === i) {
      setEmparejados((prev) => [...prev, i]);
      setSeleccionNegocio(null);
      setErrorIndex(null);
      return;
    }

    setErrorIndex(i);
    setTimeout(() => setErrorIndex(null), 500);
    setSeleccionNegocio(null);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 pb-8 pt-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <span className="mx-auto rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
          Práctica · Detective de clientes
        </span>

        <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl flex items-center gap-3">
          <SpeakButton text={speechTexts.nivel01_modulo03_detective} />
          <span>Une cada negocio con su cliente ideal</span>
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col gap-3">
            {DETECTIVE_PARES.map((par, i) => (
              <button
                key={i}
                type="button"
                onClick={() => elegirNegocio(i)}
                disabled={emparejados.includes(i)}
                className={`rounded-2xl border-2 bg-card px-3 py-4 text-left text-xs font-extrabold transition-all active:translate-y-0.5 sm:text-sm ${
                  emparejados.includes(i)
                    ? "border-success bg-success/10 text-success"
                    : seleccionNegocio === i
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground shadow-(--shadow-card)"
                }`}
              >
                <span className="mr-1">{par.emojiNegocio}</span>
                {par.negocio}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {DETECTIVE_PARES.map((par, i) => (
              <button
                key={i}
                type="button"
                onClick={() => elegirCliente(i)}
                disabled={emparejados.includes(i)}
                className={`rounded-2xl border-2 bg-card px-3 py-4 text-left text-xs font-extrabold transition-all active:translate-y-0.5 sm:text-sm ${
                  emparejados.includes(i)
                    ? "border-success bg-success/10 text-success"
                    : errorIndex === i
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground shadow-(--shadow-card)"
                }`}
              >
                <span className="mr-1">{par.emojiCliente}</span>
                {par.cliente}
              </button>
            ))}
          </div>
        </div>

        {completo && (
          <div className="mt-6 rounded-2xl border-2 border-success/40 bg-success/10 px-4 py-3 text-center text-sm font-extrabold text-success">
            🏆 ¡Perfecto! Cada negocio tiene un cliente especial.
          </div>
        )}

        <div className="mt-auto w-full pt-8">
          <button
            type="button"
            onClick={() => {
              onDone();
              playSfx("click");
            }}
            disabled={!completo}
            className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {completo ? "Continuar →" : "Une los 4 pares"}
          </button>
        </div>
      </div>
    </main>
  );
}
