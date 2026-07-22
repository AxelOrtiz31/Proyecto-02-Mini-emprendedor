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
export const ESTRELLAS_PER_ACTIVITY = 3;

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

// XP total real del usuario autenticado: suma el xp_obtenido guardado en
// cada lección (incluye los bonos de fin de módulo), en vez de estimarlo
// multiplicando el número de lecciones por el XP fijo por actividad.
export async function fetchXpTotal(): Promise<number> {
  const userId = await getCurrentUserId();

  if (!userId) return 0;

  const { data, error } = await supabase
    .from("progreso_lecciones")
    .select("xp_obtenido")
    .eq("alumno_id", userId)
    .eq("estado", "completada");

  if (error || !data) {
    console.error("Error cargando XP total:", error?.message);
    return 0;
  }

  return data.reduce((total, row) => total + (row.xp_obtenido ?? 0), 0);
}

export interface CompletarLeccionOpciones {
  tiempoSegundos?: number;
  intentos?: number;
  insignia?: string;
  moduloNumero?: number;
  xpBonus?: number;
}

// Marca una lección como completada para el usuario autenticado. Guarda XP,
// estrellas, tiempo invertido e intentos en progreso_lecciones; registra la
// insignia ganada (si la lección tiene una) en insignias_alumno; y
// actualiza la marca de última actividad del alumno.
// No usa upsert con onConflict porque tu tabla no mostró constraint unique
// en alumno_id + codigo_leccion.
export async function saveCompletedLesson(
  code: string,
  opciones: CompletarLeccionOpciones = {},
): Promise<void> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Necesitas iniciar sesión para guardar tu avance.");
  }

  const completedAt = new Date().toISOString();
  const intentos = opciones.intentos ?? 1;
  const tiempoSegundos = opciones.tiempoSegundos;

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

  const payload = {
    estado: "completada",
    xp_obtenido: XP_PER_ACTIVITY + (opciones.xpBonus ?? 0),
    estrellas: 3,
    completada_en: completedAt,
    tiempo_segundos: tiempoSegundos,
    intentos,
  };

  if (existingId) {
    const { error: updateError } = await supabase
      .from("progreso_lecciones")
      .update(payload)
      .eq("id", existingId)
      .eq("alumno_id", userId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    const { error: insertError } = await supabase
      .from("progreso_lecciones")
      .insert({ alumno_id: userId, codigo_leccion: code, ...payload });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  // La insignia (si esta lección otorga una) se guarda una sola vez por
  // alumno gracias a la restricción UNIQUE(alumno_id, codigo_leccion): si
  // el alumno repasa la lección, el insert simplemente se ignora.
  if (opciones.insignia) {
    const { error: insigniaError } = await supabase.from("insignias_alumno").insert({
      alumno_id: userId,
      codigo_leccion: code,
      nombre_insignia: opciones.insignia,
      modulo_numero: opciones.moduloNumero,
    });

    if (insigniaError && insigniaError.code !== "23505") {
      // 23505 = ya existía (violación de UNIQUE); cualquier otro error sí se reporta.
      console.error("Error guardando insignia:", insigniaError.message);
    }
  }

  const { error: sesionError } = await supabase
    .from("perfiles")
    .update({ ultima_sesion: completedAt })
    .eq("id", userId);

  if (sesionError) {
    console.error("Error actualizando última sesión:", sesionError.message);
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

export function estrellasForCompleted(completedIds: string[]): number {
  return completedIds.length * ESTRELLAS_PER_ACTIVITY;
}

// Se llama solo al aprobar la Evaluación Final (no al terminar el Módulo
// 7): es lo que realmente habilita el diploma. Si ya estaba marcado, no
// pisa la fecha original.
export async function marcarCursoCompletado(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Necesitas iniciar sesión.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("perfiles")
    .select("curso_completado_en")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existing?.curso_completado_en) {
    return existing.curso_completado_en;
  }

  const ahora = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("perfiles")
    .update({ curso_completado_en: ahora })
    .eq("id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return ahora;
}