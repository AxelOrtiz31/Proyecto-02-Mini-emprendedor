"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio } from "@/lib/negocio";
import { MATERIALES_EMPAQUE, ELEMENTOS_IMPRESOS, type MaterialEmpaque } from "../data";

import { speechTexts } from "@/audio/SpeechTexts";
import { SpeakButton } from "@/controllers/SpeakButtonController";
import { playSfx } from "@/audio/AudioManager";

interface DisenoEmpaqueProps {
  onSaved: (datos: {
    color: string;
    material: string;
    elementos: string;
    ambiental: string;
  }) => void;
}

const COLORES = ["#FF6B6B", "#4FACFE", "#6BCB77", "#FFD93D", "#C77DFF", "#FFB347"];

export function DisenoEmpaque({ onSaved }: DisenoEmpaqueProps) {
  const [ideaNombre, setIdeaNombre] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [material, setMaterial] = useState<MaterialEmpaque | null>(null);
  const [elementos, setElementos] = useState<string[]>([]);
  const [ambiental, setAmbiental] = useState("");
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

  function alternarElemento(id: string) {
    setElementos((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  const listo =
    color !== null && material !== null && elementos.length > 0 && ambiental.trim().length > 0;

  function confirmar() {
    if (!listo || !color || !material) return;
    setGuardando(true);
    onSaved({
      color,
      material: material.nombre,
      elementos: elementos
        .map((id) => ELEMENTOS_IMPRESOS.find((e) => e.id === id)?.nombre ?? id)
        .join(", "),
      ambiental: ambiental.trim(),
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
        Reto final · Diseña el empaque de tu producto
      </span>

      <h1 className="mt-4 max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        <SpeakButton text={speechTexts.nivel01_modulo05_disenoEmpaque} />
        <span>{ideaNombre ? `El empaque de "${ideaNombre}"` : "El empaque de tu producto"}</span>
      </h1>

      <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        🎨 ¿De qué color será?
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {COLORES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            aria-label={c}
            className={`h-10 w-10 rounded-full border-4 transition-transform active:translate-y-0.5 ${
              color === c ? "border-foreground" : "border-border"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <p className="mt-5 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        ♻️ ¿Qué material utilizarás?
      </p>
      <div className="mt-2 grid w-full max-w-sm grid-cols-3 gap-2">
        {MATERIALES_EMPAQUE.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMaterial(m)}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 bg-card px-2 py-3 transition-transform active:translate-y-0.5 ${
              material?.id === m.id ? "border-primary bg-primary/10 shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[11px] font-extrabold text-foreground">{m.nombre}</span>
            {m.ecologico && <span className="text-[9px] font-bold text-success">🌱 ecológico</span>}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        🖼️ ¿Qué llevará impreso el empaque?
      </p>
      <div className="mt-2 grid w-full max-w-sm grid-cols-2 gap-2">
        {ELEMENTOS_IMPRESOS.map((el) => (
          <button
            key={el.id}
            type="button"
            onClick={() => alternarElemento(el.id)}
            className={`flex items-center gap-2 rounded-2xl border-2 bg-card px-3 py-2.5 text-left transition-transform active:translate-y-0.5 ${
              elementos.includes(el.id) ? "border-primary bg-primary/10 shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            <span className="text-lg">{el.emoji}</span>
            <span className="text-xs font-extrabold text-foreground">{el.nombre}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 w-full max-w-sm text-left">
        <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          🌍 ¿Cómo ayudará tu empaque a cuidar el planeta?
        </label>
        <textarea
          value={ambiental}
          onChange={(e) => setAmbiental(e.target.value.slice(0, 120))}
          placeholder="Ej. se puede reutilizar como maceta"
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
        {guardando ? "Guardando..." : "Confirmar mi empaque →"}
      </button>
    </main>
  );
}
