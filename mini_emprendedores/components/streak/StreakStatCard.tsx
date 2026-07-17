import { Flame } from "lucide-react";

interface StreakStatCardProps {
  value: number;
  label: string;
  badge?: string;
}

export function StreakStatCard({ value, label, badge }: StreakStatCardProps) {
  return (
    <div className="relative rounded-2xl border-2 border-border bg-card px-4 py-3">
      {badge && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-accent-foreground shadow-[0_2px_0_0_oklch(0.7_0.15_85)]">
          {badge}
        </span>
      )}

      <div className="flex items-center gap-3">
        <Flame className="h-7 w-7 shrink-0 fill-current text-primary" strokeWidth={2.4} />

        <div>
          <div className="font-display text-xl font-extrabold leading-none text-foreground">
            {value}
          </div>

          <div className="mt-1 text-xs font-semibold text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}
