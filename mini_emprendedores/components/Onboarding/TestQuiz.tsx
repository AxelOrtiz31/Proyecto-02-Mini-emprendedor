"use client";

import { OnboardingHeader } from "@/components/Evaluation/OnboardingHeader";
import { ProgressSegments } from "@/components/Evaluation/ProgressSegments";
import { QuestionCard } from "@/components/Evaluation/QuestionCard";
import type { Evaluation } from "@/lib/evaluations";

interface TestQuizProps {
  evaluation: Evaluation;
  step: number;
  answers: Record<number, number[]>;
  saving: boolean;
  onToggle: (questionId: number, optionId: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function TestQuiz({
  evaluation,
  step,
  answers,
  saving,
  onToggle,
  onBack,
  onContinue,
}: TestQuizProps) {
  const questions = evaluation.questions;
  const question = questions[step];
  const selected = answers[question.id] ?? [];

  const total = questions.length;
  const isLast = step === total - 1;
  const canContinue = selected.length > 0 && !saving;

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 pb-6 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <OnboardingHeader
          eyebrow="Test inicial"
          title={evaluation.name}
          step={step}
          total={total}
          onBack={onBack}
        />

        <ProgressSegments total={total} current={step} />

        {evaluation.instructions && step === 0 && (
          <p className="mt-5 rounded-2xl border-2 border-accent/40 bg-accent/10 px-4 py-3 text-center text-sm font-bold text-foreground">
            {evaluation.instructions}
          </p>
        )}

        <div className="mt-8 w-full sm:mt-10">
          <QuestionCard
            question={question}
            selected={selected}
            onToggle={(optionId) => onToggle(question.id, optionId)}
          />
        </div>

        <div className="mt-auto w-full pt-8">
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {saving ? "Guardando..." : isLast ? "Descubrir mi superpoder" : "Continuar"}
          </button>
        </div>
      </div>
    </main>
  );
}
