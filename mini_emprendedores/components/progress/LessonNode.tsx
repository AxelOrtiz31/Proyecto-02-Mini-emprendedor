"use client";

import { useEffect, useState } from "react";
import {
  Book,
  Check,
  Dumbbell,
  Gift,
  Lock,
  Megaphone,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Activity } from "@/data/course";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { ActivityPopover } from "./ActivityPopover";
import { playSfx } from "@/audio/AudioManager";

const kindIcon: Record<Activity["kind"], LucideIcon> = {
  lesson: Star,
  practice: Dumbbell,
  story: Book,
  challenge: Megaphone,
  bonus: Gift,
  boss: Trophy,
};

interface LessonNodeProps {
  activity: Activity;
  offsetX: number; // -1..1
}

export function LessonNode({ activity, offsetX }: LessonNodeProps) {
  const isLocked = activity.status === "locked";
  const isCurrent = activity.status === "current";
  const [open, setOpen] = useState(false);

  // El popover queda anclado al nodo: al desplazar el camino lo seguiría hasta
  // taparse con otras secciones. Se cierra cuando el usuario hace scroll para que
  // no se quede flotando, sobre todo en móvil.
  //
  // Se escuchan los gestos reales (rueda y arrastre táctil) en vez del evento
  // "scroll": al abrir, el navegador desplaza unos píxeles el nodo enfocado y ese
  // scroll programático cerraría el popover al instante; un gesto del usuario no.
  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const baseCircle =
    "relative flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-200 ease-out enabled:hover:translate-y-0.5 active:translate-y-1 active:[box-shadow:0_2px_0_0_currentColor] xl:h-24 xl:w-24";

  const stateClass = cn(
    activity.status === "completed" &&
      "bg-gradient-to-b from-success to-[oklch(0.66_0.16_155)] text-success-foreground [box-shadow:var(--shadow-node-success)]",
    activity.status === "current" &&
      "bg-gradient-to-b from-primary to-[oklch(0.64_0.18_45)] text-primary-foreground [box-shadow:var(--shadow-node)] scale-110",
    activity.status === "bonus" &&
      "bg-gradient-to-b from-accent to-[oklch(0.76_0.16_85)] text-accent-foreground [box-shadow:var(--shadow-node-accent)]",
    activity.status === "locked" &&
      "bg-gradient-to-b from-muted to-[oklch(0.86_0.01_80)] text-muted-foreground [box-shadow:var(--shadow-node-locked)] cursor-not-allowed",
  );

  return (
    <div
      className="relative flex flex-col items-center"
      data-lesson-node
      style={{ transform: `translateX(calc(${offsetX} * var(--path-offset, 110px)))` }}
    >
      {isCurrent && <StartLabel />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isLocked}
            className={cn(baseCircle, stateClass, isCurrent && "animate-node-bounce")}
            aria-label={activity.title}
            onClick={() => playSfx("nodos")}
          >
            <ActivityIcon
              activity={activity}
              className={cn("h-9 w-9 xl:h-11 xl:w-11", isCurrent && "h-10 w-10 xl:h-12 xl:w-12")}
            />
            {activity.status === "completed" && activity.stars ? (
              <span className="absolute -bottom-2 right-0 flex items-center gap-0.5 rounded-full bg-card px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm">
                <Star className="h-2.5 w-2.5 fill-current" />
                {activity.stars}
              </span>
            ) : null}
          </button>
        </PopoverTrigger>
        <ActivityPopover activity={activity} />
      </Popover>
    </div>
  );
}

function StartLabel() {
  return (
    <span className="pointer-events-none absolute -top-13 left-1/2 z-10 -translate-x-1/2">
      <span className="relative block animate-mascot rounded-2xl border-2 border-border bg-card px-4 py-2 font-display text-sm font-extrabold uppercase tracking-widest text-primary shadow-(--shadow-card)">
        Empezar
        <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-border bg-card" />
      </span>
    </span>
  );
}

function ActivityIcon({
  activity,
  className,
}: {
  activity: Activity;
  className: string;
}) {
  if (activity.status === "locked") {
    return <Lock className={className} strokeWidth={2.6} />;
  }
  if (activity.status === "completed") {
    return <Check className={className} strokeWidth={2.6} />;
  }
  const Icon = kindIcon[activity.kind];
  return <Icon className={className} strokeWidth={2.6} />;
}
