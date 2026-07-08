import { Target, Timer, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonStat, StatIcon, StatTone } from "./types";

const TONE_STYLES: Record<StatTone, { border: string; header: string; icon: string }> = {
  primary: { border: "border-primary", header: "bg-primary text-primary-foreground", icon: "text-primary" },
  success: { border: "border-success", header: "bg-success text-success-foreground", icon: "text-success" },
  info: { border: "border-info", header: "bg-info text-info-foreground", icon: "text-info" },
};

const STAT_ICONS: Record<StatIcon, typeof Zap> = {
  zap: Zap,
  target: Target,
  timer: Timer,
};

interface StatCardProps {
  stat: LessonStat;
  index: number;
}

export function StatCard({ stat, index }: StatCardProps) {
  const tone = TONE_STYLES[stat.tone];
  const Icon = STAT_ICONS[stat.icon];

  return (
    <div
      className={cn("animate-count-up overflow-hidden rounded-2xl border-2 bg-card", tone.border)}
      style={{ animationDelay: `${0.15 * index}s` }}
    >
      <div
        className={cn(
          "px-2 py-1 text-center text-[10px] font-extrabold uppercase tracking-widest",
          tone.header,
        )}
      >
        {stat.label}
      </div>
      <div className="flex items-center justify-center gap-1 px-2 py-3">
        <Icon className={cn("h-4 w-4", tone.icon)} strokeWidth={3} />
        <span className="font-display text-lg font-extrabold tabular-nums sm:text-xl">
          {stat.value}
        </span>
      </div>
    </div>
  );
}
