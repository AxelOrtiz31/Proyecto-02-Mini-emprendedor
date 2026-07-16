"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AvatarRecord } from "@/lib/onboarding";

interface AvatarCarouselProps {
  avatars: AvatarRecord[];
  saving: boolean;
  onConfirm: (avatarId: number) => void;
}

export function AvatarCarousel({ avatars, saving, onConfirm }: AvatarCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const total = avatars.length;
  const selected = avatars[selectedIndex];
  const previous = avatars[(selectedIndex - 1 + total) % total];
  const next = avatars[(selectedIndex + 1) % total];

  function goPrevious() {
    setSelectedIndex((current) => (current - 1 + total) % total);
  }

  function goNext() {
    setSelectedIndex((current) => (current + 1) % total);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (saving) return;

      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "Enter") onConfirm(selected.id);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const arrowClass =
    "z-20 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-border bg-card text-primary shadow-(--shadow-card) transition-transform active:translate-y-0.5 disabled:opacity-50";

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="mt-6 flex w-full items-center justify-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={goPrevious}
          disabled={saving}
          aria-label="Avatar anterior"
          className={arrowClass}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.6} />
        </button>

        <button
          type="button"
          onClick={goPrevious}
          disabled={saving}
          aria-label={`Ver a ${previous.name}`}
          className="hidden w-24 opacity-50 grayscale-25 transition-opacity hover:opacity-80 sm:block"
        >
          <img src={previous.imageUrl} alt="" className="w-full" />
        </button>

        <div className="relative flex w-52 flex-col items-center sm:w-64">
          <div aria-hidden className="absolute top-10 h-44 w-44 rounded-full bg-accent/40 blur-2xl" />
          <img
            src={selected.imageUrl}
            alt={`Avatar ${selected.name}`}
            className="animate-mascot relative z-10 w-full"
          />
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={saving}
          aria-label={`Ver a ${next.name}`}
          className="hidden w-24 opacity-50 grayscale-25 transition-opacity hover:opacity-80 sm:block"
        >
          <img src={next.imageUrl} alt="" className="w-full" />
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={saving}
          aria-label="Avatar siguiente"
          className={arrowClass}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.6} />
        </button>
      </div>

      <p aria-live="polite" className="mt-4 font-display text-2xl font-extrabold text-foreground">
        {selected.name}
      </p>

      <div className="mt-3 flex items-center gap-2">
        {avatars.map((avatar, index) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            disabled={saving}
            aria-label={`Ver a ${avatar.name}`}
            aria-current={index === selectedIndex ? "true" : undefined}
            className={cn(
              "h-2.5 rounded-full transition-all",
              index === selectedIndex ? "w-6 bg-primary" : "w-2.5 bg-border",
            )}
          />
        ))}
      </div>

      <div className="mt-auto w-full max-w-md pt-8">
        <button
          type="button"
          onClick={() => onConfirm(selected.id)}
          disabled={saving}
          className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          {saving ? "Guardando..." : `¡Continuar con ${selected.name}!`}
        </button>
      </div>
    </div>
  );
}
