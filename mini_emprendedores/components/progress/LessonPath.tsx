import type { Unit } from "@/data/course";
import { LessonNode } from "./LessonNode";

// Zig-zag offsets: -1 left, 0 center, 1 right
const pattern = [0, 0.6, 1, 0.6, 0, -0.6, -1, -0.6];

interface LessonPathProps {
  unit: Unit;
}

export function LessonPath({ unit }: LessonPathProps) {
  const currentIndex = unit.activities.findIndex((a) => a.status === "current");

  return (
    <div className="relative flex flex-col items-center gap-7 py-8">
      {unit.activities.map((activity, i) => {
        const offset = pattern[i % pattern.length];
        const showMascot = i === currentIndex;
        return (
          <div
            key={activity.id}
            className="relative flex w-full items-center justify-center"
          >
            <LessonNode activity={activity} offsetX={offset} />
            {showMascot && (
              <span
                className="pointer-events-none absolute"
                style={{
                  transform: `translateX(${offset * 110 + (offset >= 0 ? -104 : 104)}px)`,
                }}
              >
                <img
                  src="/caelus.svg"
                  alt="Lupe, tu guía"
                  width={96}
                  height={96}
                  loading="lazy"
                  className="h-24 w-24 animate-mascot"
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
