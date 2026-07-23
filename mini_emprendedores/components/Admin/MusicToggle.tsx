"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toggleMusic, isMusicMuted } from "@/audio/AudioManager";
import { cn } from "@/lib/utils";

// Mismo control de música que la barra del alumno (components/progress/TopBar).
// En el panel deja silenciar la pista que venga sonando desde el login.
export function MusicToggle({ className }: { className?: string }) {
  const [muted, setMuted] = useState(isMusicMuted());

  function handleToggle() {
    toggleMusic();
    setMuted(isMusicMuted());
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={muted ? "Activar música" : "Silenciar música"}
      aria-label={muted ? "Activar música" : "Silenciar música"}
      className={cn(
        "flex items-center justify-center rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
