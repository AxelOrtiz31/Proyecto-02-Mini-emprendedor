"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EvaluationError } from "@/components/Evaluation/EvaluationError";
import { AvatarCarousel } from "./AvatarCarousel";
import {
  SKILL_INFO,
  fetchAvatarsBySkill,
  fetchDominantSkill,
  getOnboardingStatus,
  routeForStatus,
  saveAvatarChoice,
  type AvatarRecord,
  type Skill,
} from "@/lib/onboarding";

type Phase = "loading" | "choosing" | "error";

export default function AvatarPickerPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [skill, setSkill] = useState<Skill | null>(null);
  const [avatars, setAvatars] = useState<AvatarRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const status = await getOnboardingStatus();

      if (!active) return;

      if (status !== "avatar") {
        router.replace(routeForStatus(status));
        return;
      }

      const dominant = await fetchDominantSkill();

      if (!active) return;

      if (!dominant) {
        setPhase("error");
        return;
      }

      const options = await fetchAvatarsBySkill(dominant);

      if (!active) return;

      if (options.length === 0) {
        setPhase("error");
        return;
      }

      setSkill(dominant);
      setAvatars(options);
      setPhase("choosing");
    }

    load();

    return () => {
      active = false;
    };
  }, [router]);

  async function confirmAvatar(avatarId: number) {
    if (saving) return;

    setSaving(true);
    setSaveError(false);

    const saved = await saveAvatarChoice(avatarId);
    setSaving(false);

    if (saved) {
      router.push("/dashboard");
      return;
    }

    setSaveError(true);
  }

  if (phase === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (phase === "error" || !skill) {
    return (
      <EvaluationError
        title="No pudimos cargar los avatares"
        onBack={() => router.push("/dashboard")}
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 pb-8 pt-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center">
        <p className="text-xs font-black uppercase tracking-wider text-primary">
          Tu equipo: {SKILL_INFO[skill].label}
        </p>

        <h1 className="mt-2 text-center font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Elige tu avatar
        </h1>

        <p className="mt-2 text-center text-sm font-semibold text-muted-foreground">
          Selecciona a tu primer compañero. Estos tres comparten tu superpoder.
        </p>

        {saveError && (
          <p role="alert" className="mt-4 text-sm font-bold text-red-600">
            No pudimos guardar tu avatar. Inténtalo de nuevo.
          </p>
        )}

        <AvatarCarousel avatars={avatars} saving={saving} onConfirm={confirmAvatar} />
      </div>
    </main>
  );
}
