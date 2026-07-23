"use client";

import { useRef, useState } from "react";
import { Trash2, Plus, Save, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  actualizarPregunta,
  eliminarPregunta,
  actualizarOpcion,
  crearOpcion,
  eliminarOpcion,
  type PreguntaEditable,
} from "@/lib/evaluationsAdmin";
import { OptionRow, type OpcionLocal } from "./OptionRow";

interface QuestionEditorProps {
  pregunta: PreguntaEditable;
  numero: number;
  onChanged: () => void;
}

function aLocal(pregunta: PreguntaEditable): OpcionLocal[] {
  return pregunta.opciones.map((opcion) => ({
    key: `op-${opcion.id}`,
    id: opcion.id,
    etiqueta: opcion.etiqueta,
    valor: opcion.valor,
    emoji: opcion.emoji,
    esCorrecta: opcion.esCorrecta,
    orden: opcion.orden,
  }));
}

export function QuestionEditor({ pregunta, numero, onChanged }: QuestionEditorProps) {
  const [texto, setTexto] = useState(pregunta.texto);
  const [multiple, setMultiple] = useState(pregunta.multiple);
  const [opciones, setOpciones] = useState<OpcionLocal[]>(aLocal(pregunta));
  const [eliminadas, setEliminadas] = useState<number[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contador = useRef(0);

  function cambiarOpcion(key: string, patch: Partial<OpcionLocal>) {
    setOpciones((prev) => prev.map((opcion) => (opcion.key === key ? { ...opcion, ...patch } : opcion)));
  }

  function agregarOpcion() {
    contador.current += 1;
    setOpciones((prev) => [
      ...prev,
      {
        key: `new-${contador.current}`,
        etiqueta: "",
        valor: prev.length + 1,
        emoji: null,
        esCorrecta: false,
        orden: prev.length + 1,
      },
    ]);
  }

  function quitarOpcion(opcion: OpcionLocal) {
    setOpciones((prev) => prev.filter((item) => item.key !== opcion.key));
    const id = opcion.id;
    if (id) setEliminadas((prev) => [...prev, id]);
  }

  async function guardar() {
    setGuardando(true);
    setError(null);

    try {
      await actualizarPregunta(pregunta.id, { texto, multiple });

      for (const id of eliminadas) {
        await eliminarOpcion(id);
      }

      let orden = 1;
      for (const opcion of opciones) {
        const datos = {
          etiqueta: opcion.etiqueta,
          valor: opcion.valor,
          emoji: opcion.emoji,
          esCorrecta: opcion.esCorrecta,
          orden,
        };

        if (opcion.id) await actualizarOpcion(opcion.id, datos);
        else await crearOpcion(pregunta.id, datos);

        orden += 1;
      }

      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
      setGuardando(false);
    }
  }

  async function alternarActiva() {
    setGuardando(true);
    setError(null);

    try {
      await actualizarPregunta(pregunta.id, { activa: !pregunta.activa });
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar");
      setGuardando(false);
    }
  }

  async function borrar() {
    if (!window.confirm("¿Eliminar esta pregunta y sus respuestas?")) return;

    setGuardando(true);
    setError(null);

    try {
      await eliminarPregunta(pregunta.id);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar");
      setGuardando(false);
    }
  }

  return (
    <div className={cn("rounded-2xl bg-card p-4 shadow-(--shadow-card)", !pregunta.activa && "opacity-60")}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-sm font-extrabold text-muted-foreground">
          Pregunta {numero}
          {!pregunta.activa && " · inactiva"}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={alternarActiva}
            disabled={guardando}
            title={pregunta.activa ? "Desactivar pregunta" : "Activar pregunta"}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {pregunta.activa ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={borrar}
            disabled={guardando}
            title="Eliminar pregunta"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea
        className="mt-2 w-full rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary"
        rows={2}
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
        placeholder="Escribe la pregunta"
      />

      <label className="mt-2 flex items-center gap-2 text-xs font-bold text-foreground">
        <input
          type="checkbox"
          checked={multiple}
          onChange={(event) => setMultiple(event.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        Permitir varias respuestas correctas
      </label>

      <div className="mt-3 space-y-2">
        {opciones.map((opcion) => (
          <OptionRow
            key={opcion.key}
            opcion={opcion}
            onChange={(patch) => cambiarOpcion(opcion.key, patch)}
            onDelete={() => quitarOpcion(opcion)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={agregarOpcion}
        className="mt-2 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-primary transition-opacity hover:opacity-70"
      >
        <Plus className="h-4 w-4" />
        Agregar opción
      </button>

      {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={guardar}
          disabled={guardando}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground transition hover:brightness-95 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
