"use client";

import { useEffect, useState } from "react";
import {
  fetchLessonEvaluation,
  finishEvaluationSession,
  hasCorrectOptions,
  isAnswerCorrect,
  startEvaluationSession,
  type Evaluation,
  type EvaluationQuestion,
} from "@/lib/evaluations";

// Encapsula el flujo "responde todo -> envía -> califica" que usan las
// evaluaciones de cierre de lección. El alumno puede cambiar sus respuestas
// libremente hasta que llama a submit(). Si falla, se abre una sesión nueva
// para el reintento y las respuestas se reinician.
export function useEvaluacion(lessonId: string, moduleNumber: number) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setAnswers({});

      const data = await fetchLessonEvaluation(lessonId, moduleNumber);
      if (!active) return;

      if (data) {
        setEvaluation(data);
        const id = await startEvaluationSession(data.id);
        if (active) setSessionId(id);
      }

      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [lessonId, moduleNumber]);

  function toggleOption(question: EvaluationQuestion, optionId: number) {
    setAnswers((prev) => {
      const current = prev[question.id] ?? [];
      const next = question.multiple
        ? toggleInList(current, optionId)
        : [optionId];
      return { ...prev, [question.id]: next };
    });
  }

  // Devuelve true si todas las preguntas calificables se respondieron bien.
  async function submit(): Promise<boolean> {
    if (!evaluation) return false;

    const preguntas = evaluation.questions;
    const payload = preguntas.map((p) => ({
      questionId: p.id,
      optionIds: answers[p.id] ?? [],
    }));

    if (sessionId) {
      await finishEvaluationSession(sessionId, payload, preguntas);
    }

    const aprobado = preguntas
      .filter(hasCorrectOptions)
      .every((p) => isAnswerCorrect(p, answers[p.id] ?? []));

    if (!aprobado) {
      setAnswers({});
      const nuevaSesion = await startEvaluationSession(evaluation.id);
      setSessionId(nuevaSesion);
    }

    return aprobado;
  }

  return { loading, evaluation, answers, toggleOption, submit };
}

function toggleInList(list: number[], value: number): number[] {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }

  return [...list, value];
}
