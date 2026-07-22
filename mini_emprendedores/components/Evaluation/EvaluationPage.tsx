"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "./OnboardingHeader";
import { ProgressSegments } from "./ProgressSegments";
import { QuestionCard } from "./QuestionCard";
import { EvaluationError } from "./EvaluationError";
import { EvaluationLocked } from "./EvaluationLocked";
import { Diploma } from "./Diploma";
import { ConfettiLayer } from "@/components/Module_Complete/ConfettiLayer";
import { SplashScreen } from "@/components/Module_Complete/SplashScreen";
import {
  fetchFinalEvaluation,
  finishEvaluationSession,
  isEvaluationPassed,
  startEvaluationSession,
  type Evaluation,
} from "@/lib/evaluations";
import { activityOrder, fetchCompletedCodes, marcarCursoCompletado } from "@/lib/progress";
import { fetchMiNegocio } from "@/lib/negocio";
import { supabase } from "@/lib/supabase";

/* Debe cubrir el fade-out del splash definido en globals.css (1.6 s de espera + 0.4 s). */
const SPLASH_DURATION_MS = 3460;

type Phase = "loading" | "locked" | "quiz" | "fallo" | "splash" | "diploma";

interface DatosDiploma {
  nombreCompleto: string;
  nombreNegocio: string | null;
  fecha: string;
}

export default function EvaluationPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [enviando, setEnviando] = useState(false);
  const [datosDiploma, setDatosDiploma] = useState<DatosDiploma | null>(null);
  const evaluationIdRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    async function cargar() {
      setPhase("loading");
      setIndex(0);
      setAnswers({});

      const completedCodes = await fetchCompletedCodes();
      if (!active) return;

      const courseComplete = activityOrder.every((id) => completedCodes.includes(id));

      if (!courseComplete) {
        setPhase("locked");
        return;
      }

      const data = await fetchFinalEvaluation();
      if (!active) return;

      if (!data) {
        setEvaluation(null);
        setPhase("quiz");
        return;
      }

      evaluationIdRef.current = data.id;
      setEvaluation(data);

      const id = await startEvaluationSession(data.id);
      if (active) setSessionId(id);

      setPhase("quiz");
    }

    cargar();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (phase !== "splash") return;

    const timer = setTimeout(() => setPhase("diploma"), SPLASH_DURATION_MS);
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

  if (phase === "quiz" && !evaluation) {
    return <EvaluationError onBack={() => router.push("/dashboard")} />;
  }

  if (phase === "fallo") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center">
        <span className="text-6xl" aria-hidden="true">
          💪
        </span>
        <h1 className="max-w-sm font-display text-xl font-extrabold text-foreground sm:text-2xl">
          ¡Buen intento!
        </h1>
        <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
          Hay algunas respuestas que puedes mejorar. Repasa tus módulos si
          quieres, y vuelve a intentarlo cuando estés listo.
        </p>
        <button
          type="button"
          onClick={async () => {
            setAnswers({});
            setIndex(0);
            if (evaluationIdRef.current) {
              const id = await startEvaluationSession(evaluationIdRef.current);
              setSessionId(id);
            }
            setPhase("quiz");
          }}
          className="rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
        >
          Reintentar →
        </button>
      </main>
    );
  }

  if (phase === "splash") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background">
        <ConfettiLayer />
        <SplashScreen
          title="¡Evaluación Final aprobada!"
          glowSrc="/reward-light.json"
          successSrc="/success-check.json"
        />
      </main>
    );
  }

  if (phase === "diploma" && datosDiploma) {
    return (
      <Diploma
        nombreCompleto={datosDiploma.nombreCompleto}
        nombreNegocio={datosDiploma.nombreNegocio}
        fecha={datosDiploma.fecha}
        onVolver={() => router.push("/dashboard")}
      />
    );
  }

  if (phase === "diploma") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  // phase === "quiz" con evaluación cargada
  const preguntas = evaluation!.questions;
  const pregunta = preguntas[index];
  const seleccion = answers[pregunta.id] ?? [];
  const todasRespondidas = preguntas.every((p) => (answers[p.id]?.length ?? 0) > 0);
  const esUltima = index === preguntas.length - 1;

  function toggle(optionId: number) {
    setAnswers((prev) => {
      const current = prev[pregunta.id] ?? [];
      const next = pregunta.multiple ? toggleInList(current, optionId) : [optionId];
      return { ...prev, [pregunta.id]: next };
    });
  }

  async function enviar() {
    if (!todasRespondidas || enviando) return;
    setEnviando(true);

    const payload = preguntas.map((p) => ({
      questionId: p.id,
      optionIds: answers[p.id] ?? [],
    }));

    if (sessionId) {
      await finishEvaluationSession(sessionId, payload, preguntas);
    }

    const aprobado = isEvaluationPassed(preguntas, answers);

    if (!aprobado) {
      setEnviando(false);
      setPhase("fallo");
      return;
    }

    const [fecha, negocio, perfil] = await Promise.all([
      marcarCursoCompletado(),
      fetchMiNegocio(),
      obtenerNombrePerfil(),
    ]);

    setDatosDiploma({
      nombreCompleto: perfil,
      nombreNegocio: negocio?.nombreNegocio ?? null,
      fecha,
    });

    setEnviando(false);
    setPhase("splash");
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 pb-6 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <OnboardingHeader
          title={evaluation!.name}
          step={index}
          total={preguntas.length}
          onBack={() => (index > 0 ? setIndex(index - 1) : router.push("/dashboard"))}
        />

        <ProgressSegments total={preguntas.length} current={index} />

        <div className="mt-8 w-full sm:mt-10">
          <QuestionCard
            question={pregunta}
            selected={seleccion}
            onToggle={toggle}
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
              disabled={seleccion.length === 0}
              className="flex-1 rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              Siguiente →
            </button>
          )}
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

async function obtenerNombrePerfil(): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return "Alumno EmprendeKids";

  const { data } = await supabase
    .from("perfiles")
    .select("nombre, apellido")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!data) return "Alumno EmprendeKids";

  return `${data.nombre ?? ""} ${data.apellido ?? ""}`.trim() || "Alumno EmprendeKids";
}
