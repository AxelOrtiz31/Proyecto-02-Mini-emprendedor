"use client";

import { useEffect, useRef, useState } from "react";
import type { AvatarRecord } from "@/lib/onboarding";
import { CarouselDots } from "./CarouselDots";
import { CarouselStage } from "./CarouselStage";

const SWIPE_THRESHOLD_PX = 45;

interface AvatarCarouselProps {
  avatars: AvatarRecord[];
  saving: boolean;
  onConfirm: (avatarId: number) => void;
}

export function AvatarCarousel({ avatars, saving, onConfirm }: AvatarCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = avatars.length;
  const selected = avatars[selectedIndex];

  function goPrevious() {
    if (saving) return;
    setSelectedIndex((current) => (current - 1 + total) % total);
  }

  function goNext() {
    if (saving) return;
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

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const end = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = end - touchStartX.current;

    if (distance > SWIPE_THRESHOLD_PX) goPrevious();
    if (distance < -SWIPE_THRESHOLD_PX) goNext();
    touchStartX.current = null;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <CarouselStage
        previous={avatars[(selectedIndex - 1 + total) % total]}
        selected={selected}
        next={avatars[(selectedIndex + 1) % total]}
        saving={saving}
        onPrevious={goPrevious}
        onNext={goNext}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <p aria-live="polite" className="mt-4 font-display text-2xl font-extrabold text-foreground">
        {selected.name}
      </p>

      <CarouselDots
        avatars={avatars}
        selectedIndex={selectedIndex}
        saving={saving}
        onSelect={setSelectedIndex}
      />

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
