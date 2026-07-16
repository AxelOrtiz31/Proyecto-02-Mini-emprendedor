"use client";

import { cn } from "@/lib/utils";
import type { AvatarRecord } from "@/lib/onboarding";

interface CarouselDotsProps {
  avatars: AvatarRecord[];
  selectedIndex: number;
  saving: boolean;
  onSelect: (index: number) => void;
}

export function CarouselDots({ avatars, selectedIndex, saving, onSelect }: CarouselDotsProps) {
  return (
    <div className="mt-3 flex items-center gap-2">
      {avatars.map((avatar, index) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onSelect(index)}
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
  );
}
