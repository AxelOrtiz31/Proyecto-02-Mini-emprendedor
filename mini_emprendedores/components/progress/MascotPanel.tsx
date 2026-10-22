"use client";

import { memo } from "react";
import { PartyPopper, Sparkles } from "lucide-react";
import type { Section } from "@/data/course";
import { GreetingCard } from "./GreetingCard";
import { RecentAchievements } from "./RecentAchievements";

interface MascotPanelProps {
  variant: "sidebar" | "inline";
  // Sección donde va el progreso real del alumno (de progreso_lecciones).
  currentSection?: Section | null;
  // Siguiente sección del camino, si existe.
  nextSection?: Section | null;
  // true cuando todas las secciones están completadas.
  courseComplete?: boolean;
  // Racha actual del alumno (días consecutivos con actividad).
  streak?: number;
}

function sectionSubtitle(courseComplete: boolean, currentSection?: Section | null): string {
  if (courseComplete) return "¡Completaste todo el camino! 🎉";
  if (currentSection) return `Vamos por la sección ${currentSection.number} 🚀`;

  return "¡Bienvenido a tu camino! 🚀";
}

// Se envuelve en memo porque el camino cambia de sección activa con cada scroll
// y este panel no depende de eso: solo se vuelve a renderizar si cambian sus props.
function MascotPanelBase({
  variant,
  currentSection,
  nextSection,
  courseComplete = false,
  streak = 0,
}: MascotPanelProps) {
  const isSidebar = variant === "sidebar";

  const asideClass = isSidebar
    ? "hidden w-96 shrink-0 xl:block 2xl:w-104"
    : "mx-auto mt-12 w-full max-w-md xl:hidden";

  const innerClass = isSidebar
    ? "sticky top-[calc(var(--topbar-h)+1rem)] space-y-6 p-5"
    : "space-y-4";

  return (
    <aside className={asideClass}>
      <div className={innerClass}>
        <GreetingCard subtitle={sectionSubtitle(courseComplete, currentSection)} />

        <RecentAchievements streak={streak} />

        <NextSectionCard
          currentSection={currentSection}
          nextSection={nextSection}
          courseComplete={courseComplete}
        />
      </div>
    </aside>
  );
}

export const MascotPanel = memo(MascotPanelBase);

// Tarjeta azul: muestra la próxima sección real del camino.
// - Curso completo → felicitación.
// - Última sección en curso → ánimo para la recta final.
// - Caso normal → nombre de la próxima sección y qué completar para desbloquearla.
function NextSectionCard({
  currentSection,
  nextSection,
  courseComplete,
}: {
  currentSection?: Section | null;
  nextSection?: Section | null;
  courseComplete: boolean;
}) {
  if (courseComplete) {
    return (
      <div className="rounded-3xl bg-linear-to-br from-success to-[oklch(0.55_0.15_155)] p-5 text-success-foreground xl:p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
          <PartyPopper className="h-4 w-4" /> ¡Camino completado!
        </div>
        <div className="mt-1 font-display text-lg font-extrabold">
          Eres todo un mini emprendedor
        </div>
        <div className="text-sm opacity-90">
          Terminaste las 7 secciones. Puedes repasar cualquier lección cuando quieras.
        </div>
      </div>
    );
  }

  if (!nextSection) {
    return (
      <div className="rounded-3xl bg-linear-to-br from-info to-[oklch(0.5_0.14_240)] p-5 text-info-foreground xl:p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
          <Sparkles className="h-4 w-4" /> Recta final
        </div>
        <div className="mt-1 font-display text-lg font-extrabold">
          {currentSection?.title ?? "¡Ya casi!"}
        </div>
        <div className="text-sm opacity-90">
          Es la última sección del camino. ¡Tú puedes!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-linear-to-br from-info to-[oklch(0.5_0.14_240)] p-5 text-info-foreground xl:p-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
        <Sparkles className="h-4 w-4" /> Próxima sección
      </div>
      <div className="mt-1 font-display text-lg font-extrabold">{nextSection.title}</div>
      <div className="text-sm opacity-90">
        {currentSection
          ? `Desbloquéala completando ${currentSection.title}`
          : "Sigue avanzando para desbloquearla"}
      </div>
    </div>
  );
}
