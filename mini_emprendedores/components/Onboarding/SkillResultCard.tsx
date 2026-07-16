"use client";

import { ConfettiLayer } from "@/components/Module_Complete/ConfettiLayer";
import { SKILL_INFO, type Skill } from "@/lib/onboarding";

interface SkillResultCardProps {
  skill: Skill;
  onContinue: () => void;
}

export function SkillResultCard({ skill, onContinue }: SkillResultCardProps) {
  const info = SKILL_INFO[skill];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <ConfettiLayer />

      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <span aria-hidden className="animate-mascot text-8xl">
          {info.emoji}
        </span>

        <p className="mt-8 text-xs font-black uppercase tracking-wider text-primary">
          Tu superpoder emprendedor
        </p>

        <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-foreground">
          {info.label}
        </h1>

        <p className="mt-3 font-semibold text-muted-foreground">
          {info.description}
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-10 w-full rounded-full bg-primary py-3.5 font-display text-lg font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          ¡Elegir mi avatar! 🎉
        </button>
      </div>
    </main>
  );
}
