import { LottiePlayer } from "./LottiePlayer";
import { StatCard } from "./StatCard";
import type { LessonStat } from "./types";

interface StatsPanelProps {
  heading: string;
  subtitle: string;
  stats: LessonStat[];
  claimLabel: string;
  onClaim: () => void;
  mascotSrc: string;
}

export function StatsPanel({ heading, subtitle, stats, claimLabel, onClaim, mascotSrc }: StatsPanelProps) {
  return (
    <section className="relative z-20 mx-auto flex min-h-screen w-full max-w-md animate-fade-in-up flex-col items-center justify-center gap-4 px-6 py-10">
      <div className="h-52 w-52 animate-mascot sm:h-60 sm:w-60">
        <LottiePlayer path={mascotSrc} className="h-full w-full" />
      </div>
      <h1 className="text-center font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        {heading}
      </h1>
      <p className="text-center text-sm font-semibold text-muted-foreground sm:text-base">
        {subtitle}
      </p>

      <div className="mt-2 grid w-full grid-cols-3 gap-2 sm:gap-3">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>

      <div className="mt-8 w-full animate-btn-pulse">
        <button
          type="button"
          onClick={onClaim}
          className="block w-full rounded-2xl bg-primary py-4 text-center font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-[5px] active:shadow-none"
        >
          {claimLabel}
        </button>
      </div>
    </section>
  );
}
