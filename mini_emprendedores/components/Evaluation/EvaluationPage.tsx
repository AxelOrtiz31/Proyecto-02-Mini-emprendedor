"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "./OnboardingHeader";
import { ProgressSegments } from "./ProgressSegments";
import { QuestionCard } from "./QuestionCard";
import { EvaluationError } from "./EvaluationError";
import { EvaluationLocked } from "./EvaluationLocked";
import { ConfettiLayer } from "@/components/Module_Complete/ConfettiLayer";
import { SplashScreen } from "@/components/Module_Complete/SplashScreen";
import { StatsPanel } from "@/components/Module_Complete/StatsPanel";
import type { LessonStat } from "@/components/Module_Complete/types";
import {
  fetchFinalEvaluation,
  finishEvaluationSession,
  hasCorrectOptions,
  isAnswerCorrect,
  startEvaluationSession,
  type Evaluation,
} from "@/lib/evaluations";
import { activityOrder, fetchCompletedCodes } from "@/lib/progress";

/* Debe cubrir el fade-out del splash definido en globals.css (1.6 s de espera + 0.4 s). */
const SPLASH_DURATION_MS = 3460;

type Phase = "loading" | "locked" | "quiz" | "splash" | "stats";

export default function EvaluationPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    let active = true;

    async function loadEvaluation() {
      setPhase("loading");
      setStep(0);
      setAnswers({});

      const completedCodes = await fetchCompletedCodes();

      if (!active) return;

      const courseComplete = activityOrder.every((id) =>
        completedCodes.includes(id),
      );

      if (!courseComplete) {
        setPhase("locked");
        return;
      }

      const data = await fetchFinalEvaluation();

      if (!active) return;

      if (data) {
        setEvaluation(data);

        const id = await startEvaluationSession(data.id);

        if (active) {
          setSessionId(id);
          setPhase("quiz");
        }
      } else {
        setEvaluation(null);
      }
    }

    loadEvaluation();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (phase !== "splash") return;

    const timer = setTimeout(() => setPhase("stats"), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (phase === "locked") {
    return <EvaluationLocked onBack={() => router.push("/dashboard")} />;
  }

  if (!evaluation) {
    return <EvaluationError onBack={() => router.push("/dashboard")} />;
  }

  if (phase === "splash") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background">
        <ConfettiLayer />
        <SplashScreen
          title="¡Examen final completado!"
          glowSrc="/reward-light.json"
          successSrc="/success-check.json"
        />
      </main>
    );
  }

  if (phase === "stats") {
    const stats: LessonStat[] = [
      { id: "aciertos", label: "Aciertos", value: `${score.correct}/${score.total}`, tone: "success", icon: "target" },
      { id: "preguntas", label: "Preguntas", value: `${evaluation.questions.length}`, tone: "primary", icon: "zap" },
    ];

    return (
      <main className="relative min-h-screen overflow-hidden bg-background">
        <ConfettiLayer />
        <StatsPanel
          heading="¡Ya eres un mini emprendedor!"
          subtitle="Completaste el examen final. ¡Estamos muy orgullosos de ti!"
          stats={stats}
          claimLabel="Ir al inicio"
          onClaim={() => router.push("/dashboard")}
          mascotSrc="/cloud-robotics.json"
        />
      </main>
    );
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

    setScore(scoreEvaluation(questions, answers));
    setSaving(false);
    setPhase("splash");
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

function scoreEvaluation(
  questions: Evaluation["questions"],
  answers: Record<number, number[]>,
): { correct: number; total: number } {
  const scoredQuestions = questions.filter(hasCorrectOptions);

  const correct = scoredQuestions.reduce((sum, question) => {
    const optionIds = answers[question.id] ?? [];
    return sum + (isAnswerCorrect(question, optionIds) ? 1 : 0);
  }, 0);

  return { correct, total: scoredQuestions.length };
}
