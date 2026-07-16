"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Medal, PartyPopper, Sparkles } from "lucide-react";
import type { Section } from "@/data/course";
import { getTipOfTheDay } from "@/data/tips";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { formatStreakDays } from "@/lib/streak";
import { playSfx } from "@/audio/AudioManager";

interface MascotPanelProps {
  variant: "sidebar" | "inline";
  // Sección donde va el progreso real del alumno (de progreso_lecciones).
  currentSection?: Section | null;
  // Siguiente sección del camino, si existe.
  nextSection?: Section | null;
  // true cuando todas las secciones están completadas.
  courseComplete?: boolean;
  // Racha actual del alumno (días consecutivos con actividad).
  streak?: number;
}

interface ProfileData {
  nombre: string;
  apellido: string;
  avatar_url?: string;
}

export function MascotPanel({
  variant,
  currentSection,
  nextSection,
  courseComplete = false,
  streak = 0,
}: MascotPanelProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const isSidebar = variant === "sidebar";

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setLoading(false);
          return;
        }

        const { data: perfil, error: perfilError } = await supabase
          .from("perfiles")
          .select("nombre, apellido, avatar_id")
          .eq("id", user.id)
          .maybeSingle();

        if (perfilError) throw perfilError;

        let avatarUrl = undefined;
        if (perfil?.avatar_id) {
          const { data: avatar } = await supabase
            .from("avatares")
            .select("url_imagen")
            .eq("id", perfil.avatar_id)
            .maybeSingle();
          avatarUrl = avatar?.url_imagen;
        }

        setProfile({
          nombre: perfil?.nombre || "Alumno",
          apellido: perfil?.apellido || "",
          avatar_url: avatarUrl,
        });
      } catch (error) {
        console.error("Error cargando perfil en MascotPanel:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const asideClass = isSidebar
    ? "hidden w-96 shrink-0 xl:block 2xl:w-104"
    : "mx-auto mt-12 w-full max-w-md xl:hidden";

  const innerClass = isSidebar ? "sticky top-20 space-y-6 p-5" : "space-y-4";

  const displayName = loading ? "Cargando..." : profile ? `${profile.nombre} ${profile.apellido}`.trim() || "Usuario" : "Usuario";

  return (
    <aside className={asideClass}>
      <div className={innerClass}>
        <div className="rounded-3xl border-2 border-accent/40 bg-card p-5 shadow-(--shadow-card) xl:p-6">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar_url || "/caelus.svg"}
              alt="Lupe"
              width={64}
              height={64}
              loading="lazy"
              className="h-16 w-16 animate-mascot"
              onClick={() => playSfx("urururu")}
            />
            <div>
              <div className="font-display text-base font-extrabold">
                {loading ? "Cargando..." : `¡Hola, ${displayName}!`}
              </div>
              <div className="text-xs text-muted-foreground">
                {courseComplete
                  ? "¡Completaste todo el camino! 🎉"
                  : currentSection
                    ? `Vamos por la sección ${currentSection.number} 🚀`
                    : "¡Bienvenido a tu camino! 🚀"}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-secondary p-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-accent-foreground" />
              Tip del día
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {getTipOfTheDay()}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-border bg-card p-5 xl:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Medal className="h-4 w-4 text-primary" />
            Logros recientes
          </div>
          <ul className="mt-3 space-y-2">
            <Achievement title="Primera actividad" subtitle="Completaste tu primera lección" tone="success" />
            <Achievement
              title={`Racha de ${formatStreakDays(streak)}`}
              subtitle={streak > 0 ? "¡Sigue así!" : "Completa una lección hoy"}
              tone="primary"
            />
            <Achievement title="Cazador de ideas" subtitle="3 estrellas en bonus" tone="accent" />
          </ul>
        </div>

        <NextSectionCard
          currentSection={currentSection}
          nextSection={nextSection}
          courseComplete={courseComplete}
        />
      </div>
    </aside>
  );
}

// Tarjeta azul: muestra la próxima sección real del camino.
// - Curso completo → felicitación.
// - Última sección en curso → ánimo para la recta final.
// - Caso normal → nombre de la próxima sección y qué completar para desbloquearla.
function NextSectionCard({
  currentSection,
  nextSection,
  courseComplete,
}: {
  currentSection?: Section | null;
  nextSection?: Section | null;
  courseComplete: boolean;
}) {
  if (courseComplete) {
    return (
      <div className="rounded-3xl bg-linear-to-br from-success to-[oklch(0.55_0.15_155)] p-5 text-success-foreground xl:p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
          <PartyPopper className="h-4 w-4" /> ¡Camino completado!
        </div>
        <div className="mt-1 font-display text-lg font-extrabold">
          Eres todo un mini emprendedor
        </div>
        <div className="text-sm opacity-90">
          Terminaste las 7 secciones. Puedes repasar cualquier lección cuando quieras.
        </div>
      </div>
    );
  }

  if (!nextSection) {
    return (
      <div className="rounded-3xl bg-linear-to-br from-info to-[oklch(0.5_0.14_240)] p-5 text-info-foreground xl:p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
          <Sparkles className="h-4 w-4" /> Recta final
        </div>
        <div className="mt-1 font-display text-lg font-extrabold">
          {currentSection?.title ?? "¡Ya casi!"}
        </div>
        <div className="text-sm opacity-90">
          Es la última sección del camino. ¡Tú puedes!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-linear-to-br from-info to-[oklch(0.5_0.14_240)] p-5 text-info-foreground xl:p-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
        <Sparkles className="h-4 w-4" /> Próxima sección
      </div>
      <div className="mt-1 font-display text-lg font-extrabold">{nextSection.title}</div>
      <div className="text-sm opacity-90">
        {currentSection
          ? `Desbloquéala completando ${currentSection.title}`
          : "Sigue avanzando para desbloquearla"}
      </div>
    </div>
  );
}

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