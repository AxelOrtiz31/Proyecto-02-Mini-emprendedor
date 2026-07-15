"use client";

import { useEffect, useState } from "react";
import { fetchMiNegocio, type MiNegocio } from "@/lib/negocio";

interface MiPitchProps {
  onSaved: (datos: { diseno: string; razon: string }) => void;
}

export function MiPitch({ onSaved }: MiPitchProps) {
  const [negocio, setNegocio] = useState<MiNegocio | null>(null);
  const [miNombre, setMiNombre] = useState("");
  const [diseno, setDiseno] = useState("");
  const [razon, setRazon] = useState("");
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

  const listo =
    miNombre.trim().length > 0 && diseno.trim().length > 0 && razon.trim().length > 0;

  const pitch = listo
    ? `Hola, mi nombre es ${miNombre.trim()} y soy el creador de ${negocio?.nombreNegocio ?? "mi negocio"}. Mi producto ayuda a ${
        negocio?.clienteNombre?.toLowerCase() ?? "mis clientes"
      } porque ${negocio?.ideaAyuda ?? "resuelve lo que necesitan"}. Lo diseñé pensando en ${diseno.trim()}. Estoy seguro de que les gustará porque ${razon.trim()}. ¡Muchas gracias por conocer mi emprendimiento!`
    : null;

  function confirmar() {
    if (!listo) return;
    setGuardando(true);
    onSaved({ diseno: diseno.trim(), razon: razon.trim() });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 pb-8 pt-6 text-center sm:px-6">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        🎤 Mi pitch de ventas (30 a 60 segundos)
      </span>

      <div className="mt-6 w-full max-w-sm space-y-4 text-left">
        <div>
          <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Tu nombre
          </label>
          <input
            value={miNombre}
            onChange={(e) => setMiNombre(e.target.value.slice(0, 40))}
            placeholder="Ej. Valentina"
            className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Lo diseñé pensando en...
          </label>
          <input
            value={diseno}
            onChange={(e) => setDiseno(e.target.value.slice(0, 60))}
            placeholder="Ej. que fuera fácil de usar todos los días"
            className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Estoy seguro de que les gustará porque...
          </label>
          <input
            value={razon}
            onChange={(e) => setRazon(e.target.value.slice(0, 60))}
            placeholder="Ej. es único, útil y hecho con mucho cariño"
            className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-(--shadow-card) outline-none focus:border-primary"
          />
        </div>
      </div>

      {pitch && (
        <div className="mt-6 w-full max-w-sm rounded-2xl border-2 border-primary/40 bg-primary/5 px-5 py-4 text-left text-sm font-semibold italic text-foreground shadow-(--shadow-card)">
          &ldquo;{pitch}&rdquo;
        </div>
      )}

      <button
        type="button"
        onClick={confirmar}
        disabled={!listo || guardando}
        className="mt-8 w-full max-w-sm rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        {guardando ? "Guardando..." : "¡Listo para presentarlo! →"}
      </button>
    </main>
  );
}
