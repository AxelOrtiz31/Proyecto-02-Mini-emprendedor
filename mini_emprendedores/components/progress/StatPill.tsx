import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneText: Record<string, string> = {
  primary: "text-primary",
  accent: "text-accent",
  info: "text-info",
};

interface StatPillProps {
  icon: LucideIcon;
  value: number;
  label: string;
  tone: "primary" | "accent" | "info";
}

export function StatPill({ icon: Icon, value, label, tone }: StatPillProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 shadow-sm sm:px-3 sm:py-1.5">
      <Icon
        className={cn("h-4 w-4 fill-current", toneText[tone])}
        strokeWidth={2.4}
      />

      <span className="font-display text-xs font-extrabold text-foreground sm:text-sm">
        {value}
      </span>

      <span className="hidden text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline">
        {label}
      </span>
    </div>
  );
}
