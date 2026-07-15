"use client";

import { useState } from "react";
import { useEvaluacion } from "./useEvaluacion";
import { QuestionCard } from "./QuestionCard";

interface CheckCortoProps {
  lessonId: string;
  moduleNumber: number;
  onPass: () => void;
}

// Evaluación de cierre de lección: el alumno responde TODAS las preguntas,
// puede navegar libremente entre ellas y solo al final presiona "Enviar
// evaluación". No hay retroalimentación inmediata por pregunta. Si todo es
// correcto, se completa la lección; si algo falla, no se revela qué, solo
// se invita a intentarlo de nuevo desde cero.
export function CheckCorto({ lessonId, moduleNumber, onPass }: CheckCortoProps) {
  const { loading, evaluation, answers, toggleOption, submit } = useEvaluacion(
    lessonId,
    moduleNumber,
  );
  const [index, setIndex] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [fallo, setFallo] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const preguntas = evaluation?.questions ?? [];

  if (!evaluation || preguntas.length === 0) {
    // Sin preguntas configuradas: no bloqueamos la aventura del niño.
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
        <button
          type="button"
          onClick={onPass}
          className="rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
        >
          Continuar →
        </button>
      </div>
    );
  }

  if (fallo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center">
        <span className="text-6xl" aria-hidden="true">
          💪
        </span>
        <h1 className="max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
          ¡Buen intento!
        </h1>
        <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
          Hay algunas respuestas que puedes mejorar. Vuelve a intentarlo para
          completar esta misión.
        </p>
        <button
          type="button"
          onClick={() => {
            setFallo(false);
            setIndex(0);
          }}
          className="rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
        >
          Reintentar →
        </button>
      </main>
    );
  }

  const pregunta = preguntas[index];
  const seleccion = answers[pregunta.id] ?? [];
  const todasRespondidas = preguntas.every((p) => (answers[p.id]?.length ?? 0) > 0);
  const esUltima = index === preguntas.length - 1;

  async function enviar() {
    if (!todasRespondidas || enviando) return;
    setEnviando(true);

    const aprobado = await submit();

    setEnviando(false);

    if (aprobado) {
      onPass();
    } else {
      setFallo(true);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-6 pt-4">
      <p className="text-center text-xs font-black uppercase tracking-wider text-primary">
        Comprueba lo que aprendiste
      </p>

      <div className="mt-4 flex justify-center gap-2">
        {preguntas.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Pregunta ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === index
                ? "bg-primary"
                : (answers[p.id]?.length ?? 0) > 0
                  ? "bg-primary/50"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 w-full">
        <QuestionCard
          question={pregunta}
          selected={seleccion}
          showResult={false}
          answerIsCorrect={false}
          onToggle={(optionId) => toggleOption(pregunta, optionId)}
        />
      </div>

      <div className="mt-auto flex w-full gap-3 pt-8">
        {index > 0 && (
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            className="rounded-2xl border-2 border-border bg-card px-5 py-4 font-display text-sm font-extrabold text-foreground shadow-(--shadow-card) transition-transform active:translate-y-1"
          >
            ← Atrás
          </button>
        )}

        {esUltima ? (
          <button
            type="button"
            onClick={enviar}
            disabled={!todasRespondidas || enviando}
            className="flex-1 rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {enviando ? "Enviando..." : "Enviar evaluación ✓"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex(index + 1)}
            className="flex-1 rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
          >
            Siguiente →
          </button>
        )}
      </div>
    </main>
  );
}
