import { supabase } from "@/lib/supabase";
import {
  course,
  type ActivityStatus,
  type Section,
  type SectionStatus,
} from "@/data/course";

// El progreso de cada alumno se guarda en la tabla progreso_lecciones de Supabase,
// ligado a su usuario (alumno_id = auth.uid). Cada lección completada desbloquea
// la siguiente de forma secuencial en todo el camino.

export const XP_PER_ACTIVITY = 23;

// Orden lineal de todas las lecciones (nodos) a lo largo del camino.
export const activityOrder: string[] = course.flatMap((section) =>
  section.units.flatMap((unit) => unit.activities.map((activity) => activity.id)),
);

// Códigos de lección completados por el usuario autenticado.
export async function fetchCompletedCodes(): Promise<string[]> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from("progreso_lecciones")
    .select("codigo_leccion")
    .eq("alumno_id", user.id);

  if (error || !data) return [];

  return data
    .map((row) => row.codigo_leccion)
    .filter((code): code is string => typeof code === "string");
}

// Marca una lección como completada para el usuario autenticado.
export async function saveCompletedLesson(code: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  await supabase.from("progreso_lecciones").upsert(
    {
      alumno_id: user.id,
      codigo_leccion: code,
      estado: "completada",
      xp_obtenido: XP_PER_ACTIVITY,
      completada_en: new Date().toISOString(),
    },
    { onConflict: "alumno_id,codigo_leccion" },
  );
}

function statusForActivity(
  activityId: string,
  completedIds: string[],
  firstPendingId: string | undefined,
): ActivityStatus {
  if (completedIds.includes(activityId)) return "completed";
  if (activityId === firstPendingId) return "current";
  return "locked";
}

function statusForSection(activityStatuses: ActivityStatus[]): SectionStatus {
  if (activityStatuses.every((status) => status === "completed")) return "completed";
  if (activityStatuses.some((status) => status === "current")) return "current";
  return "locked";
}

// Devuelve una copia del catálogo con el estado de cada nodo y sección
// recalculado a partir de las lecciones completadas.
export function deriveCourse(completedIds: string[]): Section[] {
  const firstPendingId = activityOrder.find((id) => !completedIds.includes(id));

  return course.map((section) => {
    const units = section.units.map((unit) => ({
      ...unit,
      activities: unit.activities.map((activity) => ({
        ...activity,
        status: statusForActivity(activity.id, completedIds, firstPendingId),
      })),
    }));

    const activityStatuses = units.flatMap((unit) =>
      unit.activities.map((activity) => activity.status),
    );

    return { ...section, status: statusForSection(activityStatuses), units };
  });
}

export function xpForCompleted(completedIds: string[]): number {
  return completedIds.length * XP_PER_ACTIVITY;
}
