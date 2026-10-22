"use client";

import { memo, useState } from "react";
import { Lightbulb } from "lucide-react";
import { getTipOfTheDay } from "@/data/tips";
import { playSfx } from "@/audio/AudioManager";
import { useStudentProfile } from "./useStudentProfile";

interface GreetingCardProps {
  // Texto bajo el saludo: en qué parte del camino va el alumno.
  subtitle: string;
}

function GreetingCardBase({ subtitle }: GreetingCardProps) {
  const { profile, loading } = useStudentProfile();
  // El tip cambia una vez al día: se elige al montar, no en cada render.
  const [tip] = useState(getTipOfTheDay);

  const fullName = profile ? `${profile.nombre} ${profile.apellido}`.trim() : "";

  return (
    <div className="rounded-3xl border-2 border-accent/40 bg-card p-5 shadow-(--shadow-card) xl:p-6">
      <div className="flex items-center gap-3">
        {loading ? (
          <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-muted" />
        ) : (
          <img
            src={profile?.avatarUrl || "/caelus.svg"}
            alt="Lupe"
            width={64}
            height={64}
            loading="lazy"
            className="h-16 w-16 animate-mascot"
            onClick={() => playSfx("urururu")}
          />
        )}
        <div>
          <div className="font-display text-base font-extrabold">
            {loading ? "Cargando..." : `¡Hola, ${fullName || "Usuario"}!`}
          </div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-secondary p-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-accent-foreground" />
          Tip del día
        </div>
        <p className="mt-1 text-sm font-semibold text-foreground">{tip}</p>
      </div>
    </div>
  );
}

export const GreetingCard = memo(GreetingCardBase);
