"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfettiLayer } from "./ConfettiLayer";
import { SplashScreen } from "./SplashScreen";
import { StatsPanel } from "./StatsPanel";
import { saveCompletedLesson, XP_PER_ACTIVITY, ESTRELLAS_PER_ACTIVITY } from "@/lib/progress";
import {
  canShowStreakCelebration,
  fetchStreakData,
  markStreakCelebrationShown,
  type StreakData,
} from "@/lib/streak";
import { StreakCelebration } from "@/components/streak/StreakCelebration";
import type { LessonStat } from "./types";

/* Debe cubrir el fade-out del splash definido en globals.css (1.6 s de espera + 0.4 s). */
const SPLASH_DURATION_MS = 3460;

// Mentorix varía su mensaje para que no se sienta repetitivo lección tras lección.
const MENSAJES_MENTORIX: { heading: string; subtitle: string }[] = [
  { heading: "¡Lo lograste!", subtitle: "Mentorix dice: cada lección te acerca más a tu propio negocio." },
  { heading: "¡Excelente trabajo!", subtitle: "Mentorix está muy orgulloso de tu esfuerzo. ¡Sigue así!" },
  { heading: "¡Misión cumplida!", subtitle: "Mentorix dice: estás construyendo un gran emprendimiento." },
  { heading: "¡Increíble!", subtitle: "Mentorix vio todo tu esfuerzo. ¡Vamos por la siguiente misión!" },
];

function formatearTiempo(segundosTotales: number): string {
  const minutos = Math.floor(segundosTotales / 60);
  const segundos = segundosTotales % 60;
  return minutos > 0 ? `${minutos} min ${segundos}s` : `${segundos}s`;
}

function moduloNumeroDeCodigo(codigo: string): number | undefined {
  const match = codigo.match(/^s(\d+)/);
  return match ? Number(match[1]) : undefined;
}

export default function ModuleCompletePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"splash" | "stats" | "streak">("splash");
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [insignia, setInsignia] = useState<string | null>(null);
  const [tiempoSegundos, setTiempoSegundos] = useState<number | null>(null);
  const [xpBonus, setXpBonus] = useState(0);
  const [mensajeIndex] = useState(() => Math.floor(Math.random() * MENSAJES_MENTORIX.length));

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setInsignia(params.get("insignia"));

      const tiempoParam = params.get("tiempo");
      setTiempoSegundos(tiempoParam ? Number(tiempoParam) : null);

      const xpBonusParam = params.get("xpBonus");
      setXpBonus(xpBonusParam ? Number(xpBonusParam) : 0);

      setPhase("stats");
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  const mensaje = MENSAJES_MENTORIX[mensajeIndex];

  const stats: LessonStat[] = [
    {
      id: "xp",
      label: "XP ganada",
      value: `+${XP_PER_ACTIVITY + xpBonus}`,
      tone: "primary",
      icon: "zap",
    },
    { id: "estrellas", label: "Estrellas", value: `${ESTRELLAS_PER_ACTIVITY}`, tone: "success", icon: "star" },
    {
      id: "tiempo",
      label: "Tiempo",
      value: tiempoSegundos !== null ? formatearTiempo(tiempoSegundos) : "—",
      tone: "info",
      icon: "timer",
    },
  ];

  // Al reclamar XP se guarda la lección recibida por query (?lesson=) como
  // completada para el usuario -junto con el tiempo invertido, los intentos,
  // el bono de XP por terminar el módulo (si aplica), y la insignia ganada
  // (si aplica)-, lo que desbloquea la siguiente lección. Si es la primera
  // lección del día se celebra la racha antes de volver al camino.
  async function handleClaim() {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get("lesson");

    try {
      if (lessonId) {
        const tiempoParam = params.get("tiempo");
        const intentosParam = params.get("intentos");
        const insigniaParam = params.get("insignia");
        const xpBonusParam = params.get("xpBonus");

        await saveCompletedLesson(lessonId, {
          tiempoSegundos: tiempoParam ? Number(tiempoParam) : undefined,
          intentos: intentosParam ? Number(intentosParam) : undefined,
          insignia: insigniaParam ?? undefined,
          moduloNumero: moduloNumeroDeCodigo(lessonId),
          xpBonus: xpBonusParam ? Number(xpBonusParam) : undefined,
        });
      }
    } catch (error) {
      console.error("Error guardando la lección:", error);
      router.push("/dashboard");
      return;
    }

    if (!canShowStreakCelebration()) {
      router.push("/dashboard");
      return;
    }

    const data = await fetchStreakData();

    // Con la lección recién guardada la racha no puede ser 0: si lo es, la
    // lectura falló y es mejor callarse que enseñar un número equivocado.
    if (data.streak === 0) {
      router.push("/dashboard");
      return;
    }

    markStreakCelebrationShown();
    setStreakData(data);
    setPhase("streak");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* La celebración cubre la pantalla con un fondo opaco: el confeti solo
          gastaría animación por detrás. */}
      {phase !== "streak" && <ConfettiLayer />}
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
          extra={
            <>
              {xpBonus > 0 && (
                <div className="flex items-center gap-2 rounded-full border-2 border-primary/40 bg-primary/10 px-4 py-2 text-sm font-extrabold text-primary">
                  🎉 ¡Bono por terminar el módulo! +{xpBonus} XP
                </div>
              )}
              {insignia && (
                <div className="flex items-center gap-2 rounded-full border-2 border-info/40 bg-info/10 px-4 py-2 text-sm font-extrabold text-info">
                  🏅 Insignia ganada: {insignia}
                </div>
              )}
            </>
          }
        />
      )}
      {phase === "streak" && streakData && (
        <StreakCelebration
          streak={streakData.streak}
          weekActivity={streakData.weekActivity}
          mascotSrc="/cloud-robotics.json"
          onContinue={() => router.push("/dashboard")}
        />
      )}
    </main>
  );
}
