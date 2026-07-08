"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "./OnboardingHeader";
import { ProgressSegments } from "./ProgressSegments";
import { QuestionCard } from "./QuestionCard";
import { EvaluationError } from "./EvaluationError";
import {
  fetchLessonEvaluation,
  finishEvaluationSession,
  hasCorrectOptions,
  isAnswerCorrect,
  startEvaluationSession,
  type Evaluation,
} from "@/lib/evaluations";

const MODULE_NUMBER = 5;
const DEFAULT_LESSON_ID = "s5-u1-a1";

interface Module05PageProps {
  lessonId?: string;
}

export default function Module05Page({
  lessonId = DEFAULT_LESSON_ID,
}: Module05PageProps) {
  const router = useRouter();

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadEvaluation() {
      setLoading(true);
      setStep(0);
      setAnswers({});

      const data = await fetchLessonEvaluation(lessonId, MODULE_NUMBER);

      if (!active) return;

      if (data) {
        setEvaluation(data);

        const id = await startEvaluationSession(data.id);

        if (active) {
          setSessionId(id);
        }
      } else {
        setEvaluation(null);
        setSessionId(null);
      }

      setLoading(false);
    }

    loadEvaluation();

    return () => {
      active = false;
    };
  }, [lessonId]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!evaluation) {
    return <EvaluationError onBack={() => router.push("/dashboard")} />;
  }

  const questions = evaluation.questions;
  const question = questions[step];
  const selected = answers[question.id] ?? [];

  const total = questions.length;
  const isLast = step === total - 1;

  const hasSelected = selected.length > 0;
  const questionHasCorrectOptions = hasCorrectOptions(question);

  const currentAnswerIsCorrect = hasSelected
    ? isAnswerCorrect(question, selected)
    : false;

  const canContinue = hasSelected && currentAnswerIsCorrect && !saving;

  function toggle(optionId: number) {
    const current = answers[question.id] ?? [];
    const next = question.multiple ? toggleInList(current, optionId) : [optionId];

    setAnswers({
      ...answers,
      [question.id]: next,
    });
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
      return;
    }

    router.push("/dashboard");
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

    router.push(
      `/modules01_06_complete/modulecomplete?lesson=${encodeURIComponent(
        lessonId,
      )}`,
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 pb-6 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <OnboardingHeader
          title={evaluation.name}
          step={step}
          total={total}
          onBack={back}
        />

        <ProgressSegments total={total} current={step} />

        <div className="mt-8 w-full sm:mt-10">
          <QuestionCard
            question={question}
            selected={selected}
            showResult={hasSelected && questionHasCorrectOptions}
            answerIsCorrect={currentAnswerIsCorrect}
            onToggle={toggle}
          />
        </div>

        <div className="mt-auto w-full pt-8">
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {saving ? "Guardando..." : isLast ? "Terminar" : "Continuar"}
          </button>
        </div>
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