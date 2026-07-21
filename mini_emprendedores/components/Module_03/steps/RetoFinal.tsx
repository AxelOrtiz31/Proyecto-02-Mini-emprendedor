"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio } from "@/lib/negocio";
import { CLIENTE_PERSONAS, LUGARES_CLIENTE, type ClientePersona } from "../data";
import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";

interface RetoFinalProps {
  onSaved: (datos: {
    persona: ClientePersona;
    necesita: string;
    lugares: string;
  }) => void;
}

export function RetoFinal({ onSaved }: RetoFinalProps) {
  const [ideaNombre, setIdeaNombre] = useState<string | null>(null);
  const [persona, setPersona] = useState<ClientePersona | null>(null);
  const [necesita, setNecesita] = useState("");
  const [lugares, setLugares] = useState<string[]>([]);
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

  function alternarLugar(id: string) {
    setLugares((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  }

  const listo = persona !== null && necesita.trim().length > 0 && lugares.length > 0;

  function confirmar() {
    if (!listo || !persona) return;
    setGuardando(true);
    onSaved({
      persona,
      necesita: necesita.trim(),
      lugares: lugares
        .map((id) => LUGARES_CLIENTE.find((l) => l.id === id)?.nombre ?? id)
        .join(", "),
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
        Reto final · Conoce a tu cliente ideal
      </span>

      <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl flex items-center gap-3">
        <SpeakButton text={speechTexts.nivel01_modulo03_retoFinal} />
        <span>{ideaNombre ? `¿Quién comprará "${ideaNombre}"?` : "¿Quién será tu cliente?"}</span>
      </h1>

      <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        Lo comprarían principalmente
      </p>
      <div className="mt-2 grid w-full max-w-sm grid-cols-2 gap-2">
        {CLIENTE_PERSONAS.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => setPersona(op)}
            className={`flex items-center gap-2 rounded-2xl border-2 bg-card px-3 py-3 text-left transition-transform active:translate-y-0.5 ${
              persona?.id === op.id ? "border-primary bg-primary/10 shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            <span className="text-xl">{op.emoji}</span>
            <span className="text-sm font-extrabold text-foreground">{op.nombre}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          Mi cliente lo necesita porque...
        </label>
        <textarea
          value={necesita}
          onChange={(e) => setNecesita(e.target.value.slice(0, 120))}
          placeholder="Ej. no tiene tiempo para hacerlo él mismo"
          rows={2}
          className="w-full resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
        />
      </div>

      <p className="mt-5 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        ¿Dónde podrías encontrar a tus clientes?
      </p>
      <div className="mt-2 grid w-full max-w-sm grid-cols-2 gap-2">
        {LUGARES_CLIENTE.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => alternarLugar(l.id)}
            className={`flex items-center gap-2 rounded-2xl border-2 bg-card px-3 py-2.5 text-left transition-transform active:translate-y-0.5 ${
              lugares.includes(l.id) ? "border-primary bg-primary/10 shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            <span className="text-lg">{l.emoji}</span>
            <span className="text-xs font-extrabold text-foreground">{l.nombre}</span>
          </button>
        ))}
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
        {guardando ? "Guardando..." : "Confirmar mi cliente →"}
      </button>
    </main>
  );
}
