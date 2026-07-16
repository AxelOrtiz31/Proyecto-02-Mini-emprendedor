"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthActivity, WEEK_LABELS } from "@/lib/streak";
import { StreakDayCell } from "./StreakDayCell";
import { StreakStatCard } from "./StreakStatCard";

interface StreakCalendarProps {
  timestamps: string[];
}

interface MonthCursor {
  year: number;
  month: number;
}

function previousMonth(cursor: MonthCursor): MonthCursor {
  if (cursor.month === 0) return { year: cursor.year - 1, month: 11 };

  return { year: cursor.year, month: cursor.month - 1 };
}

function nextMonth(cursor: MonthCursor): MonthCursor {
  if (cursor.month === 11) return { year: cursor.year + 1, month: 0 };

  return { year: cursor.year, month: cursor.month + 1 };
}

const navButtonClass =
  "grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function StreakCalendar({ timestamps }: StreakCalendarProps) {
  const [cursor, setCursor] = useState<MonthCursor>(() => {
    const now = new Date();

    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const activity = useMemo(
    () => getMonthActivity(timestamps, cursor.year, cursor.month),
    [timestamps, cursor],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-foreground">
          {activity.label}
        </h2>

        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Mes anterior"
            onClick={() => setCursor(previousMonth)}
            className={navButtonClass}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Mes siguiente"
            onClick={() => setCursor(nextMonth)}
            className={navButtonClass}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <StreakStatCard
        value={activity.practicedDays}
        label="Días practicados"
        badge={activity.perfect ? "PERFECTO" : undefined}
      />

      <div className="rounded-2xl border-2 border-border bg-card p-4">
        <div className="mb-2 grid grid-cols-7 text-center text-xs font-bold text-muted-foreground">
          {WEEK_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        {/* Sin gap horizontal: las píldoras de días seguidos deben tocarse. */}
        <div className="grid grid-cols-7 gap-y-2">
          {activity.weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <StreakDayCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
                previousActive={week[dayIndex - 1]?.active ?? false}
                nextActive={week[dayIndex + 1]?.active ?? false}
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
