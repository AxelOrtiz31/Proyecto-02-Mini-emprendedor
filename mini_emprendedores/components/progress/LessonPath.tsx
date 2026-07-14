"use client";

import { useRef } from "react";
import type { Unit } from "@/data/course";
import { LessonNode } from "./LessonNode";
import { PathRobot } from "./PathRobot";
import { PathFootprints } from "./PathFootprints";

// Zig-zag offsets: -1 left, 0 center, 1 right
const pattern = [0, 0.6, 1, 0.6, 0, -0.6, -1, -0.6];

// El robot se dibuja un poco más chico que su tamaño decorativo original
// para que se vea proporcionado parado junto a un nodo.
const ROBOT_SCALE = 0.75;

interface LessonPathProps {
  unit: Unit;
  robotSrc?: string;
  robotSize?: { base: number; md: number };
  // Id de la actividad "actual" de TODO el curso. El robot solo se dibuja
  // en esa actividad, así hay un único robot en todo el camino y va
  // avanzando (y cambiando de robot por sección) según el progreso.
  robotActivityId?: string | null;
}

const defaultRobotSize = { base: 128, md: 176 };

export function LessonPath({ unit, robotSrc, robotSize, robotActivityId }: LessonPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { base, md } = robotSize ?? defaultRobotSize;

  // El robot solo vive en esta unidad si contiene la actividad actual global.
  const robotIndex = robotActivityId
    ? unit.activities.findIndex((a) => a.id === robotActivityId)
    : -1;

  // Huellas: hasta la actividad actual de la unidad, o hasta la última
  // completada si la unidad ya quedó atrás.
  const currentIndex = unit.activities.findIndex((a) => a.status === "current");
  const walkedUntil = currentIndex !== -1 ? currentIndex : lastCompletedIndex(unit);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-10 pb-8 pt-14 [--path-offset:70px] md:[--path-offset:110px] xl:gap-12 xl:[--path-offset:140px] 2xl:[--path-offset:180px]"
    >
      <PathFootprints containerRef={containerRef} walkedUntil={walkedUntil} />
      {unit.activities.map((activity, i) => {
        const offset = pattern[i % pattern.length];
        const showRobot = Boolean(robotSrc) && i === robotIndex;
        const robotSide = offset >= 0 ? -1 : 1;
        return (
          <div
            key={activity.id}
            className="relative flex w-full items-center justify-center"
          >
            <LessonNode activity={activity} offsetX={offset} />
            {showRobot && robotSrc && (
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 [--robot-shift:88px] md:[--robot-shift:118px]"
                style={
                  {
                    transform: `translate(-50%, -55%) translateX(calc(${offset} * var(--path-offset) + ${robotSide} * var(--robot-shift)))`,
                    "--robot-size": `${Math.round(base * ROBOT_SCALE)}px`,
                    "--robot-size-md": `${Math.round(md * ROBOT_SCALE)}px`,
                  } as React.CSSProperties
                }
              >
                <PathRobot
                  path={robotSrc}
                  className="h-(--robot-size) w-(--robot-size) md:h-(--robot-size-md) md:w-(--robot-size-md)"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function lastCompletedIndex(unit: Unit): number {
  for (let i = unit.activities.length - 1; i >= 0; i--) {
    if (unit.activities[i].status === "completed") return i;
  }
  return -1;
}
