"use client";

import { useState } from "react";
import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";

interface IdeaNegocioProps {
  onSaved: (idea: { nombre: string; tipo: "producto" | "servicio"; ayuda: string }) => void;
}

export function IdeaNegocio({ onSaved }: IdeaNegocioProps) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<"producto" | "servicio" | null>(null);
  const [ayuda, setAyuda] = useState("");
  const [guardando, setGuardando] = useState(false);

  const listo = nombre.trim().length > 0 && tipo !== null && ayuda.trim().length > 0;

  function confirmar() {
    if (!listo || !tipo) return;
    setGuardando(true);
    onSaved({ nombre: nombre.trim(), tipo, ayuda: ayuda.trim() });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
        Aplícalo: mi primera idea de negocio
      </span>

      <h1 className="max-w-sm font-display text-2xl font-extrabold text-foreground sm:text-3xl flex items-center gap-3">
        <SpeakButton text={speechTexts.nivel01_modulo02_ideaNegocio} />
        <span>M¡Crea tu propia idea!</span>
      </h1>

      <div className="mt-6 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          Nombre provisional de tu idea
        </label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value.slice(0, 40))}
          placeholder="Ej. Pulseras de Ana"
          className="w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-center font-display text-lg font-extrabold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
        />
      </div>

      <div className="mt-5 w-full max-w-sm text-left">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          ¿Es un producto o un servicio?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTipo("producto")}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 bg-card px-3 py-4 transition-all active:translate-y-0.5 ${
              tipo === "producto" ? "border-primary bg-primary/10 shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            <span className="text-3xl">📦</span>
            <span className="font-display text-sm font-extrabold text-foreground">Producto</span>
            <span className="text-[11px] font-semibold text-muted-foreground">Algo que se compra y se lleva</span>
          </button>
          <button
            type="button"
            onClick={() => setTipo("servicio")}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 bg-card px-3 py-4 transition-all active:translate-y-0.5 ${
              tipo === "servicio" ? "border-primary bg-primary/10 shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            <span className="text-3xl">🤝</span>
            <span className="font-display text-sm font-extrabold text-foreground">Servicio</span>
            <span className="text-[11px] font-semibold text-muted-foreground">Una actividad que ayuda</span>
          </button>
        </div>
      </div>

      <div className="mt-5 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          Mi idea ayuda a las personas porque...
        </label>
        <textarea
          value={ayuda}
          onChange={(e) => setAyuda(e.target.value.slice(0, 120))}
          placeholder="Ej. les regala algo bonito y único para usar todos los días"
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
        {guardando ? "Guardando..." : "Confirmar mi idea →"}
      </button>
    </main>
  );
}
