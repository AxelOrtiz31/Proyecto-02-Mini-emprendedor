import { LottiePlayer } from "@/components/Module_Complete/LottiePlayer";

interface StreakHeroProps {
  streak: number;
  mascotSrc: string;
}

function streakLabel(streak: number): string {
  if (streak === 0) return "¡Empieza hoy tu racha!";
  if (streak === 1) return "¡día de racha!";
  return "¡días de racha!";
}

export function StreakHero({ streak, mascotSrc }: StreakHeroProps) {
  return (
    <section className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-display text-[76px] font-extrabold leading-none text-primary">
          {streak}
        </div>

        <div className="mt-2 font-display text-lg font-extrabold text-primary/80">
          {streakLabel(streak)}
        </div>
      </div>

      <div className="relative h-28 w-28 shrink-0 sm:h-35 sm:w-35">
        <div className="absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_65%)] opacity-60 blur-xl" />

        <div className="relative h-full w-full animate-mascot">
          <LottiePlayer path={mascotSrc} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
