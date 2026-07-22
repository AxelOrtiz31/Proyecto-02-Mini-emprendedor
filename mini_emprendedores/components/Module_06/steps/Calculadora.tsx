"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio } from "@/lib/negocio";

import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";

interface CalculadoraProps {
  onSaved: (datos: { costo: number; precio: number; estrategia: string }) => void;
}

export function Calculadora({ onSaved }: CalculadoraProps) {
  const [ideaNombre, setIdeaNombre] = useState<string | null>(null);
  const [costo, setCosto] = useState("");
  const [precio, setPrecio] = useState("");
  const [estrategia, setEstrategia] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMiNegocio().then((negocio) => {
      if (active && negocio?.ideaNombre) setIdeaNombre(negocio.ideaNombre);
    });
    return () => {
      active = false;
    };
  }, []);

  const costoNum = Number(costo);
  const precioNum = Number(precio);
  const costoValido = costo.trim() !== "" && costoNum > 0;
  const precioValido = precio.trim() !== "" && precioNum > 0;
  const ganancia = costoValido && precioValido ? precioNum - costoNum : null;
  const listo = costoValido && precioValido && estrategia.trim().length > 0;

  function confirmar() {
    if (!listo) return;
    setGuardando(true);
    onSaved({ costo: costoNum, precio: precioNum, estrategia: estrategia.trim() });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
        Reto final · Calcula el precio de tu producto
      </span>

      <h1 className="mt-4 max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        <SpeakButton text={speechTexts.nivel01_modulo06_calculo} />
        <span>{ideaNombre ? `Hagamos cuentas para "${ideaNombre}"` : "Hagamos las cuentas de tu negocio"} </span>
      </h1>

      <div className="mt-6 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          💵 ¿Cuánto cuesta hacerlo? (materiales)
        </label>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          placeholder="$"
          className="w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-center font-display text-lg font-extrabold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
        />
      </div>

      <div className="mt-4 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          🏷️ ¿En cuánto lo venderás?
        </label>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="$"
          className="w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-center font-display text-lg font-extrabold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
        />
      </div>

      {ganancia !== null && (
        <div
          className={`mt-4 w-full max-w-sm rounded-2xl border-2 px-5 py-3 font-display text-base font-extrabold ${
            ganancia > 0
              ? "border-success/40 bg-success/10 text-success"
              : "border-accent bg-accent/10 text-accent-foreground"
          }`}
        >
          {ganancia > 0
            ? `📈 Ganarás $${ganancia.toFixed(2)} por cada uno que vendas`
            : "⚠️ Con estos números no ganarías nada. ¡Ajusta el costo o el precio!"}
        </div>
      )}

      <div className="mt-4 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          💡 ¿Qué podrías hacer para ganar más sin afectar a tus clientes?
        </label>
        <textarea
          value={estrategia}
          onChange={(e) => setEstrategia(e.target.value.slice(0, 120))}
          placeholder="Ej. comprar los materiales más baratos sin bajar la calidad"
          rows={3}
          className="w-full resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          confirmar();
          playSfx("click");
        }}
        disabled={!listo || guardando}
        className="mt-8 w-full max-w-sm rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        {guardando ? "Guardando..." : "Confirmar mis cuentas →"}
      </button>
    </main>
  );
}
