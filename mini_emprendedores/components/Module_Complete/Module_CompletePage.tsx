"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfettiLayer } from "./ConfettiLayer";
import { SplashScreen } from "./SplashScreen";
import { StatsPanel } from "./StatsPanel";
import { saveCompletedLesson, XP_PER_ACTIVITY } from "@/lib/progress";
import type { LessonStat } from "./types";

/* Debe cubrir el fade-out del splash definido en globals.css (1.6 s de espera + 0.4 s). */
const SPLASH_DURATION_MS = 3460;

const ESTRELLAS_POR_LECCION = 3;

// Mentorix varía su mensaje para que no se sienta repetitivo lección tras lección.
const MENSAJES_MENTORIX: { heading: string; subtitle: string }[] = [
  { heading: "¡Lo lograste!", subtitle: "Mentorix dice: cada lección te acerca más a tu propio negocio." },
  { heading: "¡Excelente trabajo!", subtitle: "Mentorix está muy orgulloso de tu esfuerzo. ¡Sigue así!" },
  { heading: "¡Misión cumplida!", subtitle: "Mentorix dice: estás construyendo un gran emprendimiento." },
  { heading: "¡Increíble!", subtitle: "Mentorix vio todo tu esfuerzo. ¡Vamos por la siguiente misión!" },
];

export default function ModuleCompletePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"splash" | "stats">("splash");
  const [insignia, setInsignia] = useState<string | null>(null);
  const [mensajeIndex] = useState(() => Math.floor(Math.random() * MENSAJES_MENTORIX.length));

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setInsignia(params.get("insignia"));
      setPhase("stats");
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  const mensaje = MENSAJES_MENTORIX[mensajeIndex];

  const stats: LessonStat[] = [
    { id: "xp", label: "XP ganada", value: `+${XP_PER_ACTIVITY}`, tone: "primary", icon: "zap" },
    { id: "estrellas", label: "Estrellas", value: `${ESTRELLAS_POR_LECCION}`, tone: "success", icon: "star" },
    insignia
      ? { id: "insignia", label: "Insignia", value: insignia, tone: "info", icon: "trophy" }
      : { id: "animo", label: "Mentorix dice", value: "¡Sigue así!", tone: "info", icon: "target" },
  ];

  // Al reclamar XP se guarda la lección recibida por query (?lesson=) como
  // completada para el usuario, lo que desbloquea la siguiente, y se vuelve al camino.
  async function handleClaim() {
    const lessonId = new URLSearchParams(window.location.search).get("lesson");
    if (lessonId) {
      await saveCompletedLesson(lessonId);
    }
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <ConfettiLayer />
      {phase === "splash" && (
        <SplashScreen
          title="¡Lección completada!"
          glowSrc="/reward-light.json"
          successSrc="/success-check.json"
        />
      )}
      {phase === "stats" && (
        <StatsPanel
          heading={mensaje.heading}
          subtitle={mensaje.subtitle}
          stats={stats}
          claimLabel="Reclamar XP"
          onClaim={handleClaim}
          mascotSrc="/cloud-robotics.json"
        />
      )}
    </main>
  );
}
