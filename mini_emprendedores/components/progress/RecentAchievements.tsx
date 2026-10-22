"use client";

import { memo, useEffect, useState } from "react";
import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatStreakDays } from "@/lib/streak";
import { fetchInsignias, type Insignia } from "@/lib/insignias";

interface RecentAchievementsProps {
  // Racha actual del alumno (días consecutivos con actividad).
  streak: number;
}

function RecentAchievementsBase({ streak }: RecentAchievementsProps) {
  const [insignias, setInsignias] = useState<Insignia[]>([]);

  useEffect(() => {
    fetchInsignias().then(setInsignias);
  }, []);

  return (
    <div className="rounded-3xl border-2 border-border bg-card p-5 xl:p-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <Medal className="h-4 w-4 text-primary" />
        Logros recientes
      </div>
      <ul className="mt-3 space-y-2">
        <Achievement
          title={`Racha de ${formatStreakDays(streak)}`}
          subtitle={streak > 0 ? "¡Sigue así!" : "Completa una lección hoy"}
          tone="primary"
        />
        {insignias.length === 0 ? (
          <li className="text-xs font-semibold text-muted-foreground">
            Aún no tienes insignias. ¡Completa una lección para ganar tu primera!
          </li>
        ) : (
          insignias
            .slice(0, 3)
            .map((insignia) => (
              <Achievement
                key={insignia.codigoLeccion}
                title={insignia.nombre}
                subtitle={
                  insignia.moduloNumero
                    ? `Módulo ${insignia.moduloNumero}`
                    : "Insignia obtenida"
                }
                tone="accent"
              />
            ))
        )}
      </ul>
    </div>
  );
}

export const RecentAchievements = memo(RecentAchievementsBase);

const toneMap: Record<string, string> = {
  success: "bg-success/15 text-success",
  primary: "bg-primary/15 text-primary",
  accent: "bg-accent/40 text-accent-foreground",
};

function Achievement({
  title,
  subtitle,
  tone,
}: {
  title: string;
  subtitle: string;
  tone: "success" | "primary" | "accent";
}) {
  return (
    <li className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          toneMap[tone],
        )}
      >
        <Medal className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-sm font-extrabold text-foreground">
          {title}
        </div>
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </li>
  );
}
