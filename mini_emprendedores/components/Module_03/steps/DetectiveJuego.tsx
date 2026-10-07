"use client";

import { useState } from "react";
import { DETECTIVE_PARES, type ParClienteNegocio } from "../data";
import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";
import { shuffle } from "@/lib/utils";

interface DetectiveJuegoProps {
  onDone: () => void;
}

// Cada pareja se identifica por su posición en DETECTIVE_PARES, sin importar
// en qué fila de la pantalla quede.
interface PairItem {
  index: number;
  pair: ParClienteNegocio;
}

const PAIR_ITEMS: PairItem[] = DETECTIVE_PARES.map((pair, index) => ({ pair, index }));

// Mezcla cada columna por separado. Si el sorteo dejara todas las filas
// alineadas, el juego se resolvería de corrido, así que se vuelve a sortear.
function mixColumns() {
  const businesses = shuffle(PAIR_ITEMS);
  let clients = shuffle(PAIR_ITEMS);

  while (PAIR_ITEMS.length > 1 && clients.every((item, row) => item === businesses[row])) {
    clients = shuffle(PAIR_ITEMS);
  }

  return { businesses, clients };
}

export function DetectiveJuego({ onDone }: DetectiveJuegoProps) {
  const [columns] = useState(mixColumns);
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
            {columns.businesses.map(({ pair, index }) => (
              <button
                key={index}
                type="button"
                onClick={() => elegirNegocio(index)}
                disabled={emparejados.includes(index)}
                className={`rounded-2xl border-2 bg-card px-3 py-4 text-left text-xs font-extrabold transition-all active:translate-y-0.5 sm:text-sm ${
                  emparejados.includes(index)
                    ? "border-success bg-success/10 text-success"
                    : seleccionNegocio === index
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground shadow-(--shadow-card)"
                }`}
              >
                <span className="mr-1">{pair.emojiNegocio}</span>
                {pair.negocio}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {columns.clients.map(({ pair, index }) => (
              <button
                key={index}
                type="button"
                onClick={() => elegirCliente(index)}
                disabled={emparejados.includes(index)}
                className={`rounded-2xl border-2 bg-card px-3 py-4 text-left text-xs font-extrabold transition-all active:translate-y-0.5 sm:text-sm ${
                  emparejados.includes(index)
                    ? "border-success bg-success/10 text-success"
                    : errorIndex === index
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground shadow-(--shadow-card)"
                }`}
              >
                <span className="mr-1">{pair.emojiCliente}</span>
                {pair.cliente}
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
