"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { crearGrupo, setGrupoActivo, etiquetaGrupo, type Escuela, type Grupo } from "@/lib/grupos";
import { cn } from "@/lib/utils";

const INPUT =
  "w-full rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary";

const GRADOS = ["1°", "2°", "3°", "4°", "5°", "6°"];

interface GroupsPanelProps {
  grupos: Grupo[];
  escuelas: Escuela[];
  onCambio: () => void;
  onError: (mensaje: string) => void;
}

export function GroupsPanel({ grupos, escuelas, onCambio, onError }: GroupsPanelProps) {
  const escuelasActivas = escuelas.filter((escuela) => escuela.activa);

  const [escuelaId, setEscuelaId] = useState("");
  const [grado, setGrado] = useState(GRADOS[0]);
  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("");
  const [ciclo, setCiclo] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function agregar() {
    if (!escuelaId || !nombre.trim()) return;

    setGuardando(true);

    try {
      await crearGrupo({
        escuelaId: Number(escuelaId),
        grado,
        nombre: nombre.trim().toUpperCase(),
        turno: turno.trim() || null,
        cicloEscolar: ciclo.trim() || null,
      });
      setNombre("");
      onCambio();
    } catch (e) {
      onError(e instanceof Error ? e.message : "No se pudo crear el grupo");
    }

    setGuardando(false);
  }

  async function alternar(grupo: Grupo) {
    try {
      await setGrupoActivo(grupo.id, !grupo.activo);
      onCambio();
    } catch (e) {
      onError(e instanceof Error ? e.message : "No se pudo actualizar el grupo");
    }
  }

  return (
    <section className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
      <h2 className="font-display text-lg font-extrabold text-foreground">Grupos</h2>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">
        Al desactivar un grupo deja de aparecer en el registro, pero sus alumnos y su historial se
        conservan.
      </p>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <select
          className={`${INPUT} lg:col-span-2`}
          value={escuelaId}
          onChange={(event) => setEscuelaId(event.target.value)}
          aria-label="Escuela del grupo"
        >
          <option value="">Escuela</option>
          {escuelasActivas.map((escuela) => (
            <option key={escuela.id} value={escuela.id}>
              {escuela.nombre}
            </option>
          ))}
        </select>

        <select
          className={INPUT}
          value={grado}
          onChange={(event) => setGrado(event.target.value)}
          aria-label="Grado"
        >
          {GRADOS.map((valor) => (
            <option key={valor} value={valor}>
              {valor}
            </option>
          ))}
        </select>

        <input
          className={INPUT}
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Grupo (A)"
          maxLength={20}
        />
        <input
          className={INPUT}
          value={turno}
          onChange={(event) => setTurno(event.target.value)}
          placeholder="Turno"
        />
        <input
          className={INPUT}
          value={ciclo}
          onChange={(event) => setCiclo(event.target.value)}
          placeholder="Ciclo"
        />
      </div>

      <button
        type="button"
        onClick={agregar}
        disabled={guardando || !escuelaId || !nombre.trim()}
        className="mt-3 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground transition hover:brightness-95 disabled:opacity-60"
      >
        <Plus className="h-4 w-4" strokeWidth={2.6} />
        Agregar grupo
      </button>

      <ul className="mt-4 divide-y divide-border">
        {grupos.map((grupo) => (
          <li key={grupo.id} className="flex items-center justify-between gap-3 py-2.5">
            <div>
              <p className={cn("font-bold", grupo.activo ? "text-foreground" : "text-muted-foreground")}>
                {etiquetaGrupo(grupo)}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                {grupo.escuelaNombre}
                {grupo.turno ? ` · ${grupo.turno}` : ""}
                {grupo.cicloEscolar ? ` · ${grupo.cicloEscolar}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => alternar(grupo)}
              className="shrink-0 rounded-lg border border-border px-3 py-1 text-xs font-bold text-muted-foreground transition hover:bg-muted"
            >
              {grupo.activo ? "Desactivar" : "Activar"}
            </button>
          </li>
        ))}
      </ul>

      {grupos.length === 0 && (
        <p className="mt-4 text-sm font-semibold text-muted-foreground">
          Todavía no hay grupos registrados.
        </p>
      )}
    </section>
  );
}
