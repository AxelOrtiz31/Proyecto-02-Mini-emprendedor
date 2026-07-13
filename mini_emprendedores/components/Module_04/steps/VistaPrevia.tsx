"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio, type MiNegocio } from "@/lib/negocio";
import { LOGO_FORMAS } from "../data";

interface VistaPreviaProps {
  onNext: () => void;
}

export function VistaPrevia({ onNext }: VistaPreviaProps) {
  const [negocio, setNegocio] = useState<MiNegocio | null>(null);

  useEffect(() => {
    let active = true;
    fetchMiNegocio().then((data) => {
      if (active) setNegocio(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const forma = LOGO_FORMAS.find((f) => f.id === negocio?.logoForma) ?? LOGO_FORMAS[0];
  const colorPrimario = negocio?.colorPrimario ?? "#FFD93D";
  const colorSecundario = negocio?.colorSecundario ?? "#4FACFE";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        ¡Así se ve tu negocio!
      </span>

      <div
        className="flex w-full max-w-xs flex-col items-center gap-3 rounded-3xl border-4 px-6 py-8 shadow-(--shadow-card)"
        style={{ borderColor: colorPrimario, backgroundColor: `${colorPrimario}15` }}
      >
        <div
          className="grid h-20 w-20 place-items-center border-4 border-border text-4xl shadow-(--shadow-node)"
          style={{ backgroundColor: colorPrimario, borderRadius: forma.radius }}
        >
          {negocio?.logoIcono ?? "⭐"}
        </div>

        <h2 className="font-display text-xl font-extrabold text-foreground">
          {negocio?.nombreNegocio ?? "Mi negocio"}
        </h2>

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

      <p className="max-w-sm text-sm font-semibold text-muted-foreground">
        ¡Tu negocio ya tiene nombre, colores y logo propios! Lo seguirás
        construyendo en los próximos módulos. 🚀
      </p>

      <button
        type="button"
        onClick={onNext}
        className="mt-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
      >
        Continuar →
      </button>
    </main>
  );
}
