"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AvatarRecord } from "@/lib/onboarding";

interface CarouselStageProps {
  previous: AvatarRecord;
  selected: AvatarRecord;
  next: AvatarRecord;
  saving: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
}

const arrowClass =
  "absolute top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-border bg-card text-primary shadow-(--shadow-card) transition-transform active:scale-90 disabled:opacity-50";

const peekClass =
  "absolute top-1/2 z-0 w-28 -translate-y-1/2 opacity-55 grayscale-25 transition-opacity hover:opacity-80 sm:w-36";

export function CarouselStage({
  previous,
  selected,
  next,
  saving,
  onPrevious,
  onNext,
  onTouchStart,
  onTouchEnd,
}: CarouselStageProps) {
  return (
    <div
      // overflow-clip (no hidden): al enfocar los laterales recortados, el
      // navegador haría scroll interno del contenedor y descuadraría la escena.
      className="relative mt-6 w-full overflow-clip py-2"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Laterales asomados en los bordes, recortados por el contenedor */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={saving}
        aria-label={`Ver a ${previous.name}`}
        className={`${peekClass} left-0 -translate-x-1/3`}
      >
        <img src={previous.imageUrl} alt="" className="w-full" />
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={saving}
        aria-label={`Ver a ${next.name}`}
        className={`${peekClass} right-0 translate-x-1/3`}
      >
        <img src={next.imageUrl} alt="" className="w-full" />
      </button>

      {/* Avatar central con glow; el pop al cambiar lo da la key + fade-in-up */}
      <div className="relative z-10 mx-auto w-52 sm:w-64">
        <div aria-hidden className="absolute inset-x-4 top-10 bottom-10 rounded-full bg-accent/40 blur-2xl" />
        <div className="animate-mascot relative">
          <img
            key={selected.id}
            src={selected.imageUrl}
            alt={`Avatar ${selected.name}`}
            className="animate-fade-in-up w-full"
          />
        </div>
      </div>

      {/* Flechas circulares sobrepuestas a media altura */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={saving}
        aria-label="Avatar anterior"
        className={`${arrowClass} left-2 sm:left-10`}
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.6} />
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={saving}
        aria-label="Avatar siguiente"
        className={`${arrowClass} right-2 sm:right-10`}
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2.6} />
      </button>
    </div>
  );
}
