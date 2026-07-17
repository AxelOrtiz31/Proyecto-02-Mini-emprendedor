"use client";

import { todayWeekIndex } from "@/lib/streak";
import { FlameMascot } from "./FlameMascot";
import { StreakWeekStrip } from "./StreakWeekStrip";

interface StreakCelebrationProps {
  streak: number;
  weekActivity: boolean[];
  mascotSrc: string;
  onContinue: () => void;
}

// Las etapas del original (mascota, número, texto, semana, botón) se resuelven
// con animation-delay en vez de una cadena de setTimeout: mismo ritmo, sin
// estado que mantener.
export function StreakCelebration({
  streak,
  weekActivity,
  mascotSrc,
  onContinue,
}: StreakCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_32%,var(--color-accent)_0%,transparent_70%)] opacity-70" />

      <div className="relative flex h-full w-full flex-col items-center overflow-y-auto px-6">
        <div className="pt-6 sm:pt-14">
          <FlameMascot mascotSrc={mascotSrc} />
        </div>

        <div
          className="mt-2 animate-fade-in-up font-display text-[88px] font-extrabold leading-none sm:mt-4 sm:text-[130px]"
          style={{ animationDelay: "0.9s" }}
        >
          {streak}
        </div>

        <div
          className="mt-2 animate-fade-in-up font-display text-2xl font-extrabold tracking-wide"
          style={{ animationDelay: "1.5s" }}
        >
          {streak === 1 ? "día de racha" : "días de racha"}
        </div>

        <StreakWeekStrip weekActivity={weekActivity} todayIndex={todayWeekIndex()} />

        {/* El pt-8 garantiza aire sobre el botón cuando la pantalla es corta y
            el mt-auto se queda sin espacio que repartir. */}
        <div
          className="mb-8 mt-auto w-full max-w-90 shrink-0 animate-fade-in-up pt-8"
          style={{ animationDelay: "2.9s" }}
        >
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-2xl bg-card py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary shadow-(--shadow-node) transition-transform active:translate-y-[5px] active:shadow-none"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
