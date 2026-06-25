import { BookOpen } from "lucide-react";
import type { Unit } from "@/data/course";
import { cn } from "@/lib/utils";

interface UnitBannerProps {
  sectionNumber: number;
  unit: Unit;
}

export function UnitBanner({ sectionNumber, unit }: UnitBannerProps) {
  const isPrimary = unit.number % 2 === 1;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-3xl px-6 py-5 shadow-[var(--shadow-card)]",
        isPrimary
          ? "bg-gradient-to-r from-primary to-[oklch(0.74_0.16_60)] text-primary-foreground"
          : "bg-gradient-to-r from-accent to-[oklch(0.87_0.14_92)] text-accent-foreground",
      )}
    >
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-widest opacity-85">
          Sección {sectionNumber} · Unidad {unit.number}
        </div>
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          {unit.title}
        </h2>
        <p className="text-sm font-semibold opacity-90">{unit.subtitle}</p>
      </div>

      <button
        type="button"
        aria-label="Material de la unidad"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/25 transition-colors hover:bg-white/35"
      >
        <BookOpen className="h-6 w-6" strokeWidth={2.4} />
      </button>
    </div>
  );
}
