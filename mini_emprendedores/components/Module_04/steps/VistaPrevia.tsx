"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio, type MiNegocio } from "@/lib/negocio";
import { LogoBadge } from "@/components/shared/LogoBadge";

import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";

interface VistaPreviaProps {
  onSaved: (percepcion: string) => void;
}

export function VistaPrevia({ onSaved }: VistaPreviaProps) {
  const [negocio, setNegocio] = useState<MiNegocio | null>(null);
  const [percepcion, setPercepcion] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMiNegocio().then((data) => {
      if (active) setNegocio(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const colorPrimario = negocio?.colorPrimario ?? "#FFD93D";
  const colorSecundario = negocio?.colorSecundario ?? "#4FACFE";

  function confirmar() {
    const limpio = percepcion.trim();
    if (!limpio) return;
    setGuardando(true);
    onSaved(limpio);
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Reto final · Crea la identidad de tu negocio
      </span>

      <h1 className="mt-4 font-display text-lg font-extrabold text-foreground sm:text-xl">
        <SpeakButton text={speechTexts.nivel01_modulo04_vistaPrevia} />
        <span>¡Así se ve tu negocio!</span>
      </h1>

      <div
        className="mt-4 flex w-full max-w-xs flex-col items-center gap-3 rounded-3xl border-4 px-6 py-8 shadow-(--shadow-card)"
        style={{ borderColor: colorPrimario, backgroundColor: `${colorPrimario}15` }}
      >
        <LogoBadge
          icono={negocio?.logoIcono ?? "⭐"}
          color={colorPrimario}
          formaId={negocio?.logoForma ?? "circulo"}
          size={80}
          className="text-4xl"
        />

        <h2 className="font-display text-xl font-extrabold text-foreground">
          {negocio?.nombreNegocio ?? "Mi negocio"}
        </h2>

        {negocio?.eslogan && (
          <p className="text-sm font-bold italic text-foreground">&ldquo;{negocio.eslogan}&rdquo;</p>
        )}

        <div className="flex gap-2">
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: colorPrimario }} />
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: colorSecundario }} />
        </div>

        {negocio?.clienteNombre && (
          <p className="text-xs font-bold text-muted-foreground">
            Para {negocio.clienteEmoji} {negocio.clienteNombre.toLowerCase()}
          </p>
        )}
      </div>

      <div className="mt-6 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          🌟 ¿Qué quieres que las personas piensen cuando vean tu marca?
        </label>
        <textarea
          value={percepcion}
          onChange={(e) => setPercepcion(e.target.value.slice(0, 120))}
          placeholder="Ej. que es confiable, alegre y hecha con cuidado"
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
        disabled={!percepcion.trim() || guardando}
        className="mt-8 w-full max-w-sm rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        {guardando ? "Guardando..." : "Terminar mi marca →"}
      </button>
    </main>
  );
}
