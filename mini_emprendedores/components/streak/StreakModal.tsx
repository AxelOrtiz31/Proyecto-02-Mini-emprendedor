"use client";

import { X } from "lucide-react";
import { StreakTabs } from "./StreakTabs";
import { StreakHero } from "./StreakHero";
import { StreakPerfectCard } from "./StreakPerfectCard";
import { StreakCalendar } from "./StreakCalendar";

// La mascota de la pantalla de fin de lección, reutilizada aquí.
const MASCOT_SRC = "/cloud-robotics.json";

interface StreakModalProps {
  streak: number;
  timestamps: string[];
  onClose: () => void;
}

// El padre monta este modal solo cuando está abierto, para no descargar el
// Lottie ni mantener su animación viva mientras nadie lo ve.
export function StreakModal({ streak, timestamps, onClose }: StreakModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar racha"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/20"
      />

      <section className="absolute left-1/2 top-1/2 flex max-h-[90dvh] w-[calc(100vw-2rem)] max-w-110 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-(--shadow-card)">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <p className="font-display text-base font-extrabold text-foreground">Racha</p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar racha"
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <StreakTabs />
          <StreakHero streak={streak} mascotSrc={MASCOT_SRC} />
          <StreakPerfectCard />
          <StreakCalendar timestamps={timestamps} />
        </div>
      </section>
    </div>
  );
}
