import { supabase } from "@/lib/supabase";
import {
  course,
  type ActivityStatus,
  type Section,
  type SectionStatus,
} from "@/data/course";

// El progreso de cada alumno se guarda en la tabla progreso_lecciones de Supabase.
// IMPORTANTE:
// codigo_leccion debe coincidir exactamente con los ids definidos en data/course.ts.
// Ejemplos:
// s1-u1-a1, s1-u1-a2, s1-u1-a3
// s2-u1-a1, s2-u1-a2, s2-u1-a3, s2-u1-a4

export const XP_PER_ACTIVITY = 23;

export const activityOrder: string[] = course.flatMap((section) =>
  section.units.flatMap((unit) => unit.activities.map((activity) => activity.id)),
);

async function getCurrentUserId(): Promise<string | null> {
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData.user) {
    return null;
  }

  return userData.user.id;
}

// Códigos de lección completados por el usuario autenticado.
export async function fetchCompletedCodes(): Promise<string[]> {
  const userId = await getCurrentUserId();

  if (!userId) return [];

  const { data, error } = await supabase
    .from("progreso_lecciones")
    .select("codigo_leccion")
    .eq("alumno_id", userId)
    .eq("estado", "completada");

  if (error || !data) {
    console.error("Error cargando progreso:", error?.message);
    return [];
  }

  return data
    .map((row) => row.codigo_leccion)
    .filter((code): code is string => typeof code === "string");
}

// Marca una lección como completada para el usuario autenticado.
// No usa upsert con onConflict porque tu tabla no mostró constraint unique
// en alumno_id + codigo_leccion.
export async function saveCompletedLesson(code: string): Promise<void> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Necesitas iniciar sesión para guardar tu avance.");
  }

  const completedAt = new Date().toISOString();

  const { data: existingRows, error: existingError } = await supabase
    .from("progreso_lecciones")
    .select("id")
    .eq("alumno_id", userId)
    .eq("codigo_leccion", code)
    .limit(1);

  if (existingError) {
    throw new Error(existingError.message);
  }

  const existingId = existingRows?.[0]?.id;

  if (existingId) {
    const { error: updateError } = await supabase
      .from("progreso_lecciones")
      .update({
        estado: "completada",
        xp_obtenido: XP_PER_ACTIVITY,
        estrellas: 3,
        completada_en: completedAt,
      })
      .eq("id", existingId)
      .eq("alumno_id", userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return;
  }

  const { error: insertError } = await supabase
    .from("progreso_lecciones")
    .insert({
      alumno_id: userId,
      codigo_leccion: code,
      estado: "completada",
      xp_obtenido: XP_PER_ACTIVITY,
      estrellas: 3,
      completada_en: completedAt,
    });

  if (insertError) {
    throw new Error(insertError.message);
  }
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
  if (activityStatuses.every((status) => status === "completed")) {
    return "completed";
  }

  if (activityStatuses.some((status) => status === "current")) {
    return "current";
  }

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

    return {
      ...section,
      status: statusForSection(activityStatuses),
      units,
    };
  });
}

export function xpForCompleted(completedIds: string[]): number {
  return completedIds.length * XP_PER_ACTIVITY;
}