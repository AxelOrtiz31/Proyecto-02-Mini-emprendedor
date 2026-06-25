"use client";

import Link from "next/link";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const Icon = getIcon(activity);
  const isLocked = activity.status === "locked";
  const isCurrent = activity.status === "current";

  const baseCircle =
    "relative flex h-20 w-20 items-center justify-center rounded-full transition-transform active:translate-y-1 active:[box-shadow:0_2px_0_0_currentColor]";

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
      style={{ transform: `translateX(${offsetX * 110}px)` }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isLocked}
            className={cn(baseCircle, stateClass, isCurrent && "animate-node-bounce")}
            aria-label={activity.title}
          >
            <Icon
              className={cn("h-9 w-9", isCurrent && "h-10 w-10")}
              strokeWidth={2.6}
            />
            {activity.status === "completed" && activity.stars ? (
              <span className="absolute -bottom-2 right-0 flex items-center gap-0.5 rounded-full bg-card px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm">
                <Star className="h-2.5 w-2.5 fill-current" />
                {activity.stars}
              </span>
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0" sideOffset={12}>
          <div
            className={cn(
              "rounded-t-xl px-4 py-3",
              activity.status === "completed" && "bg-success text-success-foreground",
              activity.status === "current" && "bg-primary text-primary-foreground",
              activity.status === "bonus" && "bg-accent text-accent-foreground",
              activity.status === "locked" && "bg-muted text-muted-foreground",
            )}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-85">
              {labelFor(activity)}
            </div>
            <div className="font-display text-base font-extrabold">{activity.title}</div>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            {isLocked ? (
              <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Completa la actividad anterior para desbloquear
              </div>
            ) : (
              <Link
                href={`/leccion/${activity.id}`}
                className={cn(
                  "flex w-full items-center justify-center rounded-xl px-4 py-2.5 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5",
                  activity.status === "completed" && "bg-success",
                  activity.status === "current" && "bg-primary",
                  activity.status === "bonus" && "bg-accent text-accent-foreground",
                )}
              >
                {activity.status === "completed" ? "Repasar" : "Empezar"}
              </Link>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function getIcon(activity: Activity): LucideIcon {
  if (activity.status === "locked") return Lock;
  if (activity.status === "completed") return Check;
  return kindIcon[activity.kind];
}

function labelFor(activity: Activity) {
  if (activity.status === "completed") return "Completada";
  if (activity.status === "current") return "Empieza aquí";
  if (activity.status === "bonus") return "Reto bonus";
  if (activity.status === "locked") return "Bloqueada";
  return activity.kind;
}
