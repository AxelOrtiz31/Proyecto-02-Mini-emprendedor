"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import type { Activity } from "@/data/course";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@/components/ui/popover";

interface ActivityPopoverProps {
  activity: Activity;
}

export function ActivityPopover({ activity }: ActivityPopoverProps) {
  const isLocked = activity.status === "locked";

  return (
    <PopoverContent className="w-80 p-0" sideOffset={16}>
      <div
        className={cn(
          "rounded-t-xl px-5 py-4",
          activity.status === "completed" && "bg-success text-success-foreground",
          activity.status === "current" && "bg-primary text-primary-foreground",
          activity.status === "bonus" && "bg-accent text-accent-foreground",
          activity.status === "locked" && "bg-muted text-muted-foreground",
        )}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-85">
          {labelFor(activity)}
        </div>
        <div className="font-display text-lg font-extrabold">{activity.title}</div>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-base text-muted-foreground">{activity.description}</p>
        {isLocked ? (
          <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Completa la actividad anterior para desbloquear
          </div>
        ) : (
          <Link
            href={activity.route ?? `/leccion/${activity.id}`}
            className={cn(
              "flex w-full items-center justify-center rounded-xl px-4 py-3 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5",
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
  );
}

function labelFor(activity: Activity) {
  if (activity.status === "completed") return "Completada";
  if (activity.status === "current") return "Empieza aquí";
  if (activity.status === "bonus") return "Reto bonus";
  if (activity.status === "locked") return "Bloqueada";
  return activity.kind;
}
