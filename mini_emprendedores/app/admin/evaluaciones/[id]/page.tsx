"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Eye, EyeOff } from "lucide-react";
import {
  fetchEvaluacionEditable,
  crearPregunta,
  actualizarEvaluacion,
  TIPO_LABEL,
  type EvaluacionEditable,
} from "@/lib/evaluationsAdmin";
import { AdminLoading, AdminError } from "@/components/Admin/AdminStates";
import { QuestionEditor } from "@/components/Admin/QuestionEditor";

export default function AdminEvaluacionEditorPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [evaluacion, setEvaluacion] = useState<EvaluacionEditable | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [procesando, setProcesando] = useState(false);

  function recargar() {
    setError(null);
    setEvaluacion(null);
    setNonce((n) => n + 1);
  }

  useEffect(() => {
    let activo = true;

    fetchEvaluacionEditable(id)
      .then((data) => {
        if (!activo) return;
        if (!data) {
          setError("No se encontró la evaluación");
          return;
        }
        setEvaluacion(data);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudo cargar la evaluación");
      });

    return () => {
      activo = false;
    };
  }, [id, nonce]);

  async function agregarPregunta() {
    if (!evaluacion) return;

    setProcesando(true);
    try {
      await crearPregunta(evaluacion.id, "", evaluacion.preguntas.length + 1);
      recargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo agregar la pregunta");
      setProcesando(false);
    }
  }

  async function alternarActiva() {
    if (!evaluacion) return;

    setProcesando(true);
    try {
      await actualizarEvaluacion(evaluacion.id, { activa: !evaluacion.activa });
      recargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar");
      setProcesando(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Volver />
        <AdminError message={error} onRetry={recargar} />
      </div>
    );
  }

  if (!evaluacion) {
    return (
      <div className="space-y-4">
        <Volver />
        <AdminLoading />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Volver />

      <div className="rounded-3xl bg-card p-6 shadow-(--shadow-card)">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
              {TIPO_LABEL[evaluacion.tipo] ?? evaluacion.tipo}
            </span>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {evaluacion.nombre}
            </h1>
            {evaluacion.instrucciones && (
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {evaluacion.instrucciones}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={alternarActiva}
            disabled={procesando}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-foreground transition hover:bg-muted disabled:opacity-60"
          >
            {evaluacion.activa ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {evaluacion.activa ? "Activa" : "Inactiva"}
          </button>
        </div>
      </div>

      {evaluacion.preguntas.length === 0 && (
        <p className="rounded-2xl bg-card p-8 text-center text-sm font-semibold text-muted-foreground shadow-(--shadow-card)">
          Esta evaluación aún no tiene preguntas.
        </p>
      )}

      <div className="space-y-4">
        {evaluacion.preguntas.map((pregunta, index) => (
          <QuestionEditor
            key={`${pregunta.id}-${nonce}`}
            pregunta={pregunta}
            numero={index + 1}
            onChanged={recargar}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={agregarPregunta}
        disabled={procesando}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-extrabold text-primary transition-colors hover:bg-card disabled:opacity-60"
      >
        <Plus className="h-5 w-5" />
        Agregar pregunta
      </button>
    </div>
  );
}

function Volver() {
  return (
    <Link
      href="/admin/evaluaciones"
      className="inline-flex items-center gap-1 text-sm font-extrabold text-primary transition-opacity hover:opacity-70"
    >
      <ChevronLeft className="h-4 w-4" />
      Evaluaciones
    </Link>
  );
}
