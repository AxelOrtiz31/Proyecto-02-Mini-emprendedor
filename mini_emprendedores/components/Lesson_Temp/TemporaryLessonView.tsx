"use client";

import { useRouter } from "next/navigation";

interface TemporaryLessonViewProps {
  lessonId: string;
}

export function TemporaryLessonView({ lessonId }: TemporaryLessonViewProps) {
  const router = useRouter();

  function handleFinish() {
    router.push(`/modules01_06_complete/modulecomplete?lesson=${lessonId}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-secondary-foreground">
        Lección de prueba
      </span>
      <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Aquí va tu lección
      </h1>
      <p className="max-w-sm text-sm font-semibold text-muted-foreground sm:text-base">
        Esta es una pantalla temporal mientras se construye el módulo de preguntas. Cuando
        termines, concluye la lección para reclamar tu XP.
      </p>
      <button
        type="button"
        onClick={handleFinish}
        className="rounded-2xl bg-primary px-8 py-4 font-display text-base font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-[5px] active:shadow-none"
      >
        Concluir lección
      </button>
    </main>
  );
}
