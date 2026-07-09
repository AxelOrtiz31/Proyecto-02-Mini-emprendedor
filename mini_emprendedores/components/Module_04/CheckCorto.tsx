"use client";

import { useEffect, useState } from "react";
import { QuestionCard } from "./QuestionCard";
import {
  fetchLessonEvaluation,
  finishEvaluationSession,
  hasCorrectOptions,
  isAnswerCorrect,
  startEvaluationSession,
  type Evaluation,
} from "@/lib/evaluations";

interface CheckCortoProps {
  lessonId: string;
  moduleNumber: number;
  onPass: () => void;
}

// Verificación corta de una sola pregunta al cierre de una lección. Si no hay
// pregunta configurada en Supabase, deja avanzar igual para no trabar al niño
// por un problema de contenido.
export function CheckCorto({ lessonId, moduleNumber, onPass }: CheckCortoProps) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
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

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const question = evaluation?.questions[0];

  if (!evaluation || !question) {
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

  const hasSelected = selected.length > 0;
  const questionHasCorrectOptions = hasCorrectOptions(question);
  const answerIsCorrect = hasSelected ? isAnswerCorrect(question, selected) : false;
  const canContinue = hasSelected && answerIsCorrect && !saving;

  function toggle(optionId: number) {
    setSelected(question!.multiple ? toggleInList(selected, optionId) : [optionId]);
  }

  async function handleContinue() {
    if (!canContinue) return;

    setSaving(true);

    if (sessionId && evaluation) {
      await finishEvaluationSession(
        sessionId,
        [{ questionId: question!.id, optionIds: selected }],
        evaluation.questions,
      );
    }

    onPass();
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-6 pt-4">
      <p className="text-center text-xs font-black uppercase tracking-wider text-primary">
        Comprueba lo que aprendiste
      </p>

      <div className="mt-6 w-full">
        <QuestionCard
          question={question}
          selected={selected}
          showResult={hasSelected && questionHasCorrectOptions}
          answerIsCorrect={answerIsCorrect}
          onToggle={toggle}
        />
      </div>

      <div className="mt-auto w-full pt-8">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          {saving ? "Guardando..." : "Continuar →"}
        </button>
      </div>
    </main>
  );
}

function toggleInList(list: number[], value: number): number[] {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }

  return [...list, value];
}
