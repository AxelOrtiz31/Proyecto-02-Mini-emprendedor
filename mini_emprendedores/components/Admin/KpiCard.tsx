import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KpiTone = "primary" | "accent" | "success" | "info";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  hint?: string;
  tone?: KpiTone;
}

const TONES: Record<KpiTone, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/25 text-accent-foreground",
  success: "bg-success/15 text-success",
  info: "bg-info/10 text-info",
};

export function KpiCard({ label, value, icon, hint, tone = "primary" }: KpiCardProps) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full", TONES[tone])}>
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs font-semibold text-muted-foreground">{hint}</p>}
    </div>
  );
}
