"use client";

import { useEffect, useState } from "react";
import { ConfettiLayer } from "./ConfettiLayer";
import { SplashScreen } from "./SplashScreen";
import { StatsPanel } from "./StatsPanel";
import type { LessonStat } from "./types";

/* Debe cubrir el fade-out del splash definido en globals.css (1.6 s de espera + 0.4 s). */
const SPLASH_DURATION_MS = 2000;

const LESSON_STATS: LessonStat[] = [
  { id: "xp", label: "XP total", value: "23", tone: "primary", icon: "zap" },
  { id: "accuracy", label: "Genial", value: "93%", tone: "success", icon: "target" },
  { id: "time", label: "Rápido", value: "2:49", tone: "info", icon: "timer" },
];

export default function ModuleCompletePage() {
  const [phase, setPhase] = useState<"splash" | "stats">("splash");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("stats"), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <ConfettiLayer />
      {phase === "splash" && (
        <SplashScreen title="¡Lección completada!" mascotSrc="/caelus.svg" />
      )}
      {phase === "stats" && (
        <StatsPanel
          heading="¡Legendario!"
          subtitle="Completaste la unidad 1 sin fallos y en tiempo récord."
          stats={LESSON_STATS}
          claimLabel="Reclamar XP"
          claimHref="/dashboard"
          mascotSrc="/caelus.svg"
        />
      )}
    </main>
  );
}
