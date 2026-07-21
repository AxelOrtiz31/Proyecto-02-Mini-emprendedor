"use client";

import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";

interface RetoProps {
  onNext: () => void;
}

export function Reto({ onNext }: RetoProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Módulo 3 · Reto
      </span>

      <span className="text-6xl" aria-hidden="true">
        🏪
      </span>

      <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl flex items-center gap-3">
        <SpeakButton text={speechTexts.nivel01_modulo03_reto} />
        <span>¿Quién será mi cliente?</span>
      </h1>

      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        Imagina que abres una tiendita. ¿Le venderías las mismas galletas a un
        bebé de 1 año que a tu abuela? 🤔 Todo negocio necesita saber
        exactamente a quién le va a vender.
      </p>

      <button
        type="button"
        onClick={() => {
          onNext();
          playSfx("click");
        }}
        className="mt-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        ¡Descúbrelo! →
      </button>
    </main>
  );
}
