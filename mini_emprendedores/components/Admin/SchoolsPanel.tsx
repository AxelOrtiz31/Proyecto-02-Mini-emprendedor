"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { crearEscuela, setEscuelaActiva, type Escuela } from "@/lib/grupos";

const INPUT =
  "w-full rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary";

interface SchoolsPanelProps {
  escuelas: Escuela[];
  onCambio: () => void;
  onError: (mensaje: string) => void;
}

export function SchoolsPanel({ escuelas, onCambio, onError }: SchoolsPanelProps) {
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function agregar() {
    if (!nombre.trim()) return;

    setGuardando(true);

    try {
      await crearEscuela(nombre.trim(), clave.trim() || null);
      setNombre("");
      setClave("");
      onCambio();
    } catch (e) {
      onError(e instanceof Error ? e.message : "No se pudo crear la escuela");
    }

    setGuardando(false);
  }

  async function alternar(escuela: Escuela) {
    try {
      await setEscuelaActiva(escuela.id, !escuela.activa);
      onCambio();
    } catch (e) {
      onError(e instanceof Error ? e.message : "No se pudo actualizar la escuela");
    }
  }

  return (
    <section className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
      <h2 className="font-display text-lg font-extrabold text-foreground">Escuelas</h2>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">
        Solo las escuelas activas aparecen en el registro de alumnos.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={INPUT}
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Nombre de la escuela"
        />
        <input
          className={`${INPUT} sm:w-40`}
          value={clave}
          onChange={(event) => setClave(event.target.value)}
          placeholder="Clave (opcional)"
        />
        <button
          type="button"
          onClick={agregar}
          disabled={guardando || !nombre.trim()}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground transition hover:brightness-95 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} />
          Agregar
        </button>
      </div>

      <ul className="mt-4 divide-y divide-border">
        {escuelas.map((escuela) => (
          <li key={escuela.id} className="flex items-center justify-between gap-3 py-2.5">
            <div>
              <p className="font-bold text-foreground">{escuela.nombre}</p>
              {escuela.clave && (
                <p className="text-xs font-semibold text-muted-foreground">{escuela.clave}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => alternar(escuela)}
              className="shrink-0 rounded-lg border border-border px-3 py-1 text-xs font-bold text-muted-foreground transition hover:bg-muted"
            >
              {escuela.activa ? "Desactivar" : "Activar"}
            </button>
          </li>
        ))}
      </ul>

      {escuelas.length === 0 && (
        <p className="mt-4 text-sm font-semibold text-muted-foreground">
          Todavía no hay escuelas registradas.
        </p>
      )}
    </section>
  );
}
