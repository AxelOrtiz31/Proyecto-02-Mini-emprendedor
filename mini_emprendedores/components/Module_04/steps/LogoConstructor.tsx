"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio } from "@/lib/negocio";
import { LOGO_ICONOS, LOGO_FORMAS, type LogoForma } from "../data";

interface LogoConstructorProps {
  onSaved: (icono: string, forma: LogoForma) => void;
}

export function LogoConstructor({ onSaved }: LogoConstructorProps) {
  const [colorPrimario, setColorPrimario] = useState("#FFD93D");
  const [icono, setIcono] = useState<string | null>(null);
  const [forma, setForma] = useState<LogoForma | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let active = true;

    fetchMiNegocio().then((negocio) => {
      if (active && negocio?.colorPrimario) {
        setColorPrimario(negocio.colorPrimario);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const listo = icono && forma;

  function confirmar() {
    if (!icono || !forma) return;
    setGuardando(true);
    onSaved(icono, forma);
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Un buen logo es simple y fácil de reconocer
      </span>

      <h1 className="mt-4 font-display text-lg font-extrabold text-foreground sm:text-xl">
        Crea el logo de tu negocio
      </h1>

      <div
        className="mt-6 grid h-28 w-28 place-items-center border-4 border-border text-5xl shadow-(--shadow-node)"
        style={{
          backgroundColor: colorPrimario,
          borderRadius: forma?.radius ?? "9999px",
        }}
      >
        {icono ?? "❔"}
      </div>

      <p className="mt-3 text-xs font-bold text-muted-foreground">
        1. Elige un ícono
      </p>
      <div className="mt-2 grid w-full max-w-sm grid-cols-6 gap-2">
        {LOGO_ICONOS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setIcono(item)}
            className={`grid aspect-square place-items-center rounded-xl border-2 bg-card text-xl transition-transform active:translate-y-0.5 ${
              icono === item ? "border-primary shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-bold text-muted-foreground">
        2. Elige una forma
      </p>
      <div className="mt-2 grid w-full max-w-sm grid-cols-4 gap-2">
        {LOGO_FORMAS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setForma(item)}
            className={`rounded-xl border-2 bg-card px-2 py-2 text-[11px] font-extrabold text-foreground transition-transform active:translate-y-0.5 ${
              forma?.id === item.id ? "border-primary shadow-(--shadow-node)" : "border-border shadow-(--shadow-card)"
            }`}
          >
            {item.nombre}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={confirmar}
        disabled={!listo || guardando}
        className="mt-8 w-full max-w-sm rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        {guardando ? "Guardando..." : "Confirmar mi logo →"}
      </button>
    </main>
  );
}
