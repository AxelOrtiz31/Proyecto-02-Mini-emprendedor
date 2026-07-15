"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio } from "@/lib/negocio";

interface EligeNombreProps {
  onSaved: (nombre: string) => void;
}

export function EligeNombre({ onSaved }: EligeNombreProps) {
  const [cliente, setCliente] = useState<{ nombre: string; emoji: string } | null>(null);
  const [nombre, setNombre] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let active = true;

    fetchMiNegocio().then((negocio) => {
      if (!active || !negocio?.clienteNombre) return;
      setCliente({
        nombre: negocio.clienteNombre,
        emoji: negocio.clienteEmoji ?? "🙂",
      });
    });

    return () => {
      active = false;
    };
  }, []);

  function confirmar() {
    const limpio = nombre.trim();
    if (!limpio) return;
    setGuardando(true);
    onSaved(limpio);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 py-10 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Aplícalo a tu negocio
      </span>

      <h1 className="max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
        ¿Cómo se llamará tu negocio?
      </h1>

      {cliente && (
        <p className="max-w-sm text-sm font-semibold text-muted-foreground">
          Recuerda: tus clientes son {cliente.emoji} {cliente.nombre.toLowerCase()}.
          ¡Piensa en un nombre que les guste!
        </p>
      )}

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value.slice(0, 40))}
        placeholder="Ej. Dulces de Sofía"
        className="w-full max-w-sm rounded-2xl border-2 border-border bg-card px-5 py-4 text-center font-display text-lg font-extrabold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
      />

      <button
        type="button"
        onClick={confirmar}
        disabled={!nombre.trim() || guardando}
        className="mt-2 w-full max-w-sm rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        {guardando ? "Guardando..." : "Confirmar nombre →"}
      </button>
    </main>
  );
}
