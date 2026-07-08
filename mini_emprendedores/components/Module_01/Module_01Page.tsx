"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "./OnboardingHeader";
import { ProgressSegments } from "./ProgressSegments";
import { QuestionCard } from "./QuestionCard";
import { EvaluationError } from "./EvaluationError";
import {
  fetchModuleEvaluation,
  startEvaluationSession,
  finishEvaluationSession,
  type Evaluation,
} from "@/lib/evaluations";

// Este es el primer nodo de la sección 1. Para replicar en otro módulo, copia esta carpeta
// y cambia únicamente estas dos constantes.
const MODULE_NUMBER = 1;
const LESSON_ID = "s1-u1-a1";

export default function Module01Page() {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchModuleEvaluation(MODULE_NUMBER).then((data) => {
      if (!active) return;
      if (data) {
        setEvaluation(data);
        startEvaluationSession(data.id).then((id) => {
          if (active) setSessionId(id);
        });
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  // Si la evaluación no cargó (sin datos o error de red) mostramos un aviso en vez de
  // dejar la pantalla girando para siempre.
  if (!evaluation) {
    return <EvaluationError onBack={() => router.push("/dashboard")} />;
  }

  const questions = evaluation.questions;
  const question = questions[step];
  const selected = answers[question.id] ?? [];
  const total = questions.length;
  const isLast = step === total - 1;
  const canContinue = selected.length > 0 && !saving;

  function toggle(optionId: number) {
    const current = answers[question.id] ?? [];
    const next = question.multiple ? toggleInList(current, optionId) : [optionId];
    setAnswers({ ...answers, [question.id]: next });
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else router.push("/dashboard");
  }

  async function next() {
    if (!canContinue) return;
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    const payload = questions.map((item) => ({
      questionId: item.id,
      optionIds: answers[item.id] ?? [],
    }));
    if (sessionId) {
      await finishEvaluationSession(sessionId, payload, questions);
    }
    router.push(`/modules01_06_complete/modulecomplete?lesson=${LESSON_ID}`);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-5 pb-6 pt-4">
      <OnboardingHeader title={evaluation.name} step={step} total={total} onBack={back} />
      <ProgressSegments total={total} current={step} />

      <div className="mt-8 w-full">
        <QuestionCard question={question} selected={selected} onToggle={toggle} />
      </div>

      <div className="mx-auto mt-auto w-full max-w-md pt-8">
        <button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          {saving ? "Guardando..." : isLast ? "Terminar" : "Continuar"}
        </button>
      </div>
    </main>
  );
}

function toggleInList(list: number[], value: number): number[] {
  if (list.includes(value)) return list.filter((item) => item !== value);
  return [...list, value];
}
