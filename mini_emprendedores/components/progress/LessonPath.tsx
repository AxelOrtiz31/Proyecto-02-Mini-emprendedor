import type { Unit } from "@/data/course";
import { LessonNode } from "./LessonNode";
import { PathRobot } from "./PathRobot";

// Zig-zag offsets: -1 left, 0 center, 1 right
const pattern = [0, 0.6, 1, 0.6, 0, -0.6, -1, -0.6];

interface LessonPathProps {
  unit: Unit;
  robotSrc?: string;
  robotSize?: { base: number; md: number };
}

const defaultRobotSize = { base: 128, md: 176 };

export function LessonPath({ unit, robotSrc, robotSize }: LessonPathProps) {
  const { base, md } = robotSize ?? defaultRobotSize;

  return (
    <div className="relative flex flex-col items-center gap-7 py-8 [--path-offset:70px] md:[--path-offset:110px]">
      {robotSrc && (
        <div
          className="pointer-events-none absolute right-1/2 top-10 -translate-x-14 md:-translate-x-20"
          style={{ "--robot-size": `${base}px`, "--robot-size-md": `${md}px` } as React.CSSProperties}
        >
          <PathRobot
            path={robotSrc}
            className="h-[var(--robot-size)] w-[var(--robot-size)] md:h-[var(--robot-size-md)] md:w-[var(--robot-size-md)]"
          />
        </div>
      )}
      {unit.activities.map((activity, i) => {
        const offset = pattern[i % pattern.length];
        return (
          <div
            key={activity.id}
            className="relative flex w-full items-center justify-center"
          >
            <LessonNode activity={activity} offsetX={offset} />
          </div>
        );
      })}
    </div>
  );
}
