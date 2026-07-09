import { BookOpen } from "lucide-react";
import type { Unit } from "@/data/course";
import { cn } from "@/lib/utils";

interface UnitBannerProps {
  sectionNumber: number;
  unit: Unit;
}

export function UnitBanner({ sectionNumber, unit }: UnitBannerProps) {
  const isPrimary = sectionNumber % 2 === 1;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-3xl px-4 py-4 shadow-[var(--shadow-card)] sm:px-6 sm:py-5 xl:px-8 xl:py-6",
        isPrimary
          ? "bg-gradient-to-r from-primary to-[oklch(0.74_0.16_60)] text-primary-foreground"
          : "bg-gradient-to-r from-accent to-[oklch(0.87_0.14_92)] text-accent-foreground",
      )}
    >
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-widest opacity-85">
          Sección {sectionNumber} · Unidad {unit.number}
        </div>
        <h2 className="font-display text-xl font-extrabold leading-tight sm:text-2xl xl:text-3xl">
          {unit.title}
        </h2>
        <p className="text-sm font-semibold opacity-90 xl:text-base">{unit.subtitle}</p>
      </div>

      <button
        type="button"
        aria-label="Material de la unidad"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25 transition-colors hover:bg-white/35 sm:h-12 sm:w-12"
      >
        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
      </button>
    </div>
  );
}
