import { Check } from "lucide-react";
import { WEEK_LABELS } from "@/lib/streak";
import { cn } from "@/lib/utils";

interface StreakWeekStripProps {
  weekActivity: boolean[];
  todayIndex: number;
}

function dayClass(active: boolean, isToday: boolean): string {
  if (isToday) return "bg-card text-primary ring-4 ring-card/25";
  if (active) return "bg-accent text-accent-foreground";

  return "bg-primary-foreground/20 text-primary-foreground/40";
}

export function StreakWeekStrip({ weekActivity, todayIndex }: StreakWeekStripProps) {
  return (
    <div className="mt-10 grid w-full max-w-90 grid-cols-7 gap-2 text-center">
      {WEEK_LABELS.map((label, index) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="text-xs font-extrabold tracking-wider opacity-90">{label}</div>

          <div
            className={cn(
              "grid h-9 w-9 animate-count-up place-items-center rounded-full",
              dayClass(weekActivity[index], index === todayIndex),
            )}
            style={{ animationDelay: `${2 + index * 0.09}s` }}
          >
            {weekActivity[index] && <Check className="h-5 w-5 stroke-[3]" />}
          </div>
        </div>
      ))}
    </div>
  );
}
