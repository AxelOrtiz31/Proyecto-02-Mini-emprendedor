"use client";

import { useRef } from "react";
import { Lock } from "lucide-react";
import type { Section } from "@/data/course";
import { cn } from "@/lib/utils";
import { LessonNode } from "./LessonNode";
import { PathRobot } from "./PathRobot";
import { PathFootprints } from "./PathFootprints";

// Zig-zag offsets: -1 izquierda, 0 centro, 1 derecha.
// Se recorre con un índice GLOBAL de actividad para que el camino
// nunca se reinicie al centro al cambiar de sección.
const pattern = [0, 0.6, 1, 0.6, 0, -0.6, -1, -0.6];

const ROBOT_SCALE = 0.75;
const defaultRobotSize = { base: 128, md: 176 };

interface CoursePathProps {
  sections: Section[];
  // Actividad "actual" de todo el curso. Ahí se dibuja el único robot.
  robotActivityId: string | null;
  // Para registrar cada sección como ancla del scroll-spy / navegación.
  registerSection: (id: string, element: HTMLElement | null) => void;
}

export function CoursePath({
  sections,
  robotActivityId,
  registerSection,
}: CoursePathProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lista plana de actividades de TODO el curso, en orden. Con ella se
  // calcula el índice global de cada nodo (zig-zag continuo) y hasta qué
  // segmento van pintadas las huellas.
  const allActivities = sections.flatMap((section) =>
    section.units.flatMap((unit) => unit.activities),
  );

  const robotGlobalIndex = robotActivityId
    ? allActivities.findIndex((activity) => activity.id === robotActivityId)
    : -1;

  // Sección donde va el progreso (la que contiene la actividad actual).
  const currentSectionIndex = sections.findIndex((section) =>
    section.units.some((unit) =>
      unit.activities.some((activity) => activity.id === robotActivityId),
    ),
  );

  // Cada sección tiene su propio robot y cada robot tiene un modo:
  // - "waiting": sección futura → robot en gris, esperando en su primer nivel.
  // - "active": sección en curso → robot a color, parado en la actividad actual.
  // - "resting": sección ya superada → su robot se queda a color en el último
  //   nivel de esa sección (ahí terminó su recorrido).
  type RobotMode = "waiting" | "active" | "resting";

  function robotPlanFor(sectionIndex: number): {
    activityId: string | null;
    mode: RobotMode;
  } {
    const acts = sections[sectionIndex].units.flatMap((unit) => unit.activities);

    if (!acts.length || currentSectionIndex === -1) {
      return { activityId: null, mode: "waiting" };
    }

    if (sectionIndex < currentSectionIndex) {
      return { activityId: acts[acts.length - 1].id, mode: "resting" };
    }

    if (sectionIndex === currentSectionIndex) {
      return { activityId: robotActivityId, mode: "active" };
    }

    return { activityId: acts[0].id, mode: "waiting" };
  }

  let globalIndex = 0;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center pb-8 [--path-offset:70px] md:[--path-offset:110px] xl:[--path-offset:140px] 2xl:[--path-offset:180px]"
    >
      <PathFootprints containerRef={containerRef} walkedUntil={robotGlobalIndex} />

      {sections.map((section, sectionIndex) => {
        const robotSize = section.robotSize ?? defaultRobotSize;
        const robotPlan = robotPlanFor(sectionIndex);

        return (
          <section
            key={section.id}
            data-section-id={section.id}
            ref={(element) => registerSection(section.id, element)}
            className="flex w-full scroll-mt-40 flex-col items-center gap-10 lg:scroll-mt-44 xl:gap-12"
          >
            <SectionDivider section={section} />

            {section.units.flatMap((unit) =>
              unit.activities.map((activity) => {
                const index = globalIndex++;
                const offset = pattern[index % pattern.length];
                const showRobot =
                  Boolean(section.robot) && activity.id === robotPlan.activityId;
                const robotSide = offset >= 0 ? -1 : 1;

                return (
                  <div
                    key={activity.id}
                    className="relative flex w-full items-center justify-center"
                  >
                    <LessonNode activity={activity} offsetX={offset} />
                    {showRobot && section.robot && (
                      <div
                        className={cn(
                          "pointer-events-none absolute left-1/2 top-1/2 z-10 [--robot-shift:88px] md:[--robot-shift:118px]",
                          // Robot de sección futura: en gris, esperando su turno.
                          robotPlan.mode === "waiting" && "grayscale opacity-50",
                          // Robot de sección superada: a color pero más tenue,
                          // descansando en el último nivel que recorrió.
                          robotPlan.mode === "resting" && "opacity-80",
                        )}
                        style={
                          {
                            transform: `translate(-50%, -55%) translateX(calc(${offset} * var(--path-offset) + ${robotSide} * var(--robot-shift)))`,
                            "--robot-size": `${Math.round(robotSize.base * ROBOT_SCALE)}px`,
                            "--robot-size-md": `${Math.round(robotSize.md * ROBOT_SCALE)}px`,
                          } as React.CSSProperties
                        }
                      >
                        <PathRobot
                          path={section.robot}
                          className="h-(--robot-size) w-(--robot-size) md:h-(--robot-size-md) md:w-(--robot-size-md)"
                        />
                      </div>
                    )}
                  </div>
                );
              }),
            )}
          </section>
        );
      })}
    </div>
  );
}

// Divisor delgado que anuncia la sección dentro del camino sin cortarlo.
function SectionDivider({ section }: { section: Section }) {
  const locked = section.status === "locked";
  const completed = section.status === "completed";

  return (
    <div className="relative z-10 flex w-full items-center gap-3 py-10 xl:py-12">
      <span className="h-0.5 flex-1 rounded-full bg-border" />

      <span
        className={cn(
          "flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest shadow-(--shadow-card)",
          locked && "text-muted-foreground",
          completed && "text-success",
          !locked && !completed && "text-primary",
        )}
      >
        {locked && <Lock className="h-3 w-3" strokeWidth={2.6} />}
        Sección {section.number} · {section.title}
      </span>

      <span className="h-0.5 flex-1 rounded-full bg-border" />
    </div>
  );
}
