import type { MonthDay } from "@/lib/streak";
import { cn } from "@/lib/utils";

interface StreakDayCellProps {
  day: MonthDay | null;
  previousActive: boolean;
  nextActive: boolean;
}

export function StreakDayCell({ day, previousActive, nextActive }: StreakDayCellProps) {
  if (!day) return <div className="h-10" />;

  // Los días activos seguidos se unen en una sola píldora: cada tramo solo se
  // redondea en sus extremos.
  const roundLeft = day.active && !previousActive;
  const roundRight = day.active && !nextActive;

  return (
    <div className="relative flex h-10 items-center justify-center">
      {day.active && (
        <div
          className={cn(
            // El -inset-x-px solapa un píxel con la celda vecina y borra la costura.
            "absolute inset-y-1 -inset-x-px bg-linear-to-b from-accent to-primary",
            roundLeft && "rounded-l-full",
            roundRight && "rounded-r-full",
          )}
        />
      )}

      <span
        className={cn(
          "relative font-display text-sm font-extrabold",
          day.active ? "text-primary-foreground" : "text-muted-foreground",
          day.today && !day.active && "text-primary",
        )}
      >
        {day.dayOfMonth}
      </span>

      {day.today && !day.active && (
        <span className="absolute -top-1 right-0 h-2 w-2 rounded-full bg-primary" />
      )}
    </div>
  );
}
