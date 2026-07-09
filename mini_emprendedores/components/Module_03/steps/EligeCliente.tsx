"use client";

import { useState } from "react";
import { CLIENTE_PERSONAS, type ClientePersona } from "../data";

interface EligeClienteProps {
  onSaved: (persona: ClientePersona) => void;
}

export function EligeCliente({ onSaved }: EligeClienteProps) {
  const [elegido, setElegido] = useState<ClientePersona | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function confirmar() {
    if (!elegido) return;
    setGuardando(true);
    onSaved(elegido);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 pb-8 pt-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center text-center">
        <span className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
          Aplícalo a tu negocio
        </span>

        <h1 className="mt-4 font-display text-xl font-extrabold text-foreground sm:text-2xl">
          ¿Quién será el cliente de TU negocio?
        </h1>

        <p className="mt-2 max-w-sm text-sm font-semibold text-muted-foreground">
          Elige con quién vas a empezar. ¡Podrás pensar en más clientes más
          adelante!
        </p>

        <div className="mt-6 flex w-full flex-col gap-3">
          {CLIENTE_PERSONAS.map((persona) => {
            const selected = elegido?.id === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => setElegido(persona)}
                className={`grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 text-left transition-all active:translate-y-0.5 ${
                  selected
                    ? "border-primary bg-primary/10 shadow-(--shadow-node)"
                    : "border-border shadow-(--shadow-card)"
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-2xl">
                  {persona.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-extrabold text-foreground sm:text-base">
                    {persona.nombre}
                  </span>
                  <span className="block text-xs font-semibold text-muted-foreground sm:text-sm">
                    {persona.descripcion}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold text-primary">
                    {persona.ejemplos}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {elegido && (
          <div className="mt-6 w-full rounded-2xl border-2 border-success/40 bg-success/10 px-4 py-3 text-sm font-extrabold text-success">
            ¡Genial elección! Ahora sabrás exactamente qué crear para {" "}
            {elegido.nombre.toLowerCase()}.
          </div>
        )}

        <div className="mt-8 w-full">
          <button
            type="button"
            onClick={confirmar}
            disabled={!elegido || guardando}
            className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {guardando ? "Guardando..." : "Confirmar mi cliente →"}
          </button>
        </div>
      </div>
    </main>
  );
}
