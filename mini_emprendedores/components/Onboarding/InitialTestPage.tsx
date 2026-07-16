"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EvaluationError } from "@/components/Evaluation/EvaluationError";
import { TestQuiz } from "./TestQuiz";
import { SkillResultCard } from "./SkillResultCard";
import {
  fetchInitialEvaluation,
  finishEvaluationSession,
  startEvaluationSession,
  type Evaluation,
} from "@/lib/evaluations";
import {
  classifyDominantSkill,
  getOnboardingStatus,
  routeForStatus,
  saveDominantSkill,
  type Skill,
} from "@/lib/onboarding";

type Phase = "loading" | "quiz" | "saveError" | "result" | "error";

export default function InitialTestPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [saving, setSaving] = useState(false);
  const [skill, setSkill] = useState<Skill | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const status = await getOnboardingStatus();

      if (!active) return;

      if (status !== "test") {
        router.replace(routeForStatus(status));
        return;
      }

      const data = await fetchInitialEvaluation();

      if (!active) return;

      if (!data) {
        setPhase("error");
        return;
      }

      setEvaluation(data);

      const id = await startEvaluationSession(data.id);

      if (!active) return;

      setSessionId(id);
      setPhase("quiz");
    }

    load();

    return () => {
      active = false;
    };
  }, [router]);

  function toggleOption(questionId: number, optionId: number) {
    setAnswers({ ...answers, [questionId]: [optionId] });
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  async function continueOrFinish() {
    if (!evaluation || saving) return;

    const isLast = step === evaluation.questions.length - 1;

    if (!isLast) {
      setStep(step + 1);
      return;
    }

    setSaving(true);

    const payload = evaluation.questions.map((item) => ({
      questionId: item.id,
      optionIds: answers[item.id] ?? [],
    }));

    if (sessionId) {
      await finishEvaluationSession(sessionId, payload, evaluation.questions);
    }

    const dominant = classifyDominantSkill(evaluation.questions, answers);
    setSkill(dominant);

    const saved = await saveDominantSkill(dominant);
    setSaving(false);
    setPhase(saved ? "result" : "saveError");
  }

  async function retrySave() {
    if (!skill || saving) return;

    setSaving(true);
    const saved = await saveDominantSkill(skill);
    setSaving(false);

    if (saved) setPhase("result");
  }

  if (phase === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (phase === "error" || !evaluation) {
    return (
      <EvaluationError
        title="No pudimos cargar tu test inicial"
        onBack={() => router.push("/dashboard")}
      />
    );
  }

  if (phase === "saveError") {
    return (
      <EvaluationError
        title="No pudimos guardar tu resultado"
        actionLabel="Reintentar"
        onBack={retrySave}
      />
    );
  }

  if (phase === "result" && skill) {
    return (
      <SkillResultCard
        skill={skill}
        onContinue={() => router.push("/onboarding/avatar")}
      />
    );
  }

  return (
    <TestQuiz
      evaluation={evaluation}
      step={step}
      answers={answers}
      saving={saving}
      onToggle={toggleOption}
      onBack={goBack}
      onContinue={continueOrFinish}
    />
  );
}
