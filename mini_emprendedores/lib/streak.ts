import { supabase } from "@/lib/supabase";

// Lógica central de rachas.
// La racha se calcula con las fechas de completada_en de la tabla
// progreso_lecciones: días consecutivos (en horario local) con al menos
// una lección completada. Si hoy todavía no hay actividad, la racha
// sigue viva mientras haya actividad de ayer.

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface StreakData {
  streak: number;
  weekActivity: boolean[];
}

export const EMPTY_WEEK: boolean[] = [false, false, false, false, false, false, false];

// Número de día en horario local (días completos desde 1970-01-01).
function localDayNumber(date: Date): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / DAY_IN_MS);
}

// Convierte los timestamps en un conjunto de días locales con actividad.
function activityDays(timestamps: Array<string | null | undefined>): Set<number> {
  const days = new Set<number>();

  for (const value of timestamps) {
    if (!value) continue;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) continue;

    days.add(localDayNumber(date));
  }

  return days;
}

// Días consecutivos con actividad, contando hacia atrás desde hoy.
export function calculateStreak(
  timestamps: Array<string | null | undefined>,
  now: Date = new Date(),
): number {
  const days = activityDays(timestamps);
  if (days.size === 0) return 0;

  const today = localDayNumber(now);
  let current = today;

  // Sin actividad hoy: la racha sigue viva si hubo actividad ayer.
  if (!days.has(current)) {
    current = today - 1;
    if (!days.has(current)) return 0;
  }

  let streak = 0;
  while (days.has(current)) {
    streak++;
    current--;
  }

  return streak;
}

// Actividad de la semana actual, de lunes a domingo.
export function getWeekActivity(
  timestamps: Array<string | null | undefined>,
  now: Date = new Date(),
): boolean[] {
  const days = activityDays(timestamps);
  const today = localDayNumber(now);
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = today - mondayOffset;

  return EMPTY_WEEK.map((_, index) => days.has(monday + index));
}

// Timestamps de lecciones completadas del usuario autenticado.
export async function fetchCompletionTimestamps(): Promise<string[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) return [];

  const { data, error } = await supabase
    .from("progreso_lecciones")
    .select("completada_en")
    .eq("alumno_id", userData.user.id)
    .eq("estado", "completada");

  if (error || !data) {
    console.error("Error cargando fechas de progreso:", error?.message);
    return [];
  }

  return data
    .map((row) => row.completada_en)
    .filter((value): value is string => typeof value === "string");
}

// Racha y actividad semanal reales del usuario autenticado.
export async function fetchStreakData(): Promise<StreakData> {
  const timestamps = await fetchCompletionTimestamps();

  return {
    streak: calculateStreak(timestamps),
    weekActivity: getWeekActivity(timestamps),
  };
}

// Texto listo para mostrar: "1 día" o "N días".
export function formatStreakDays(streak: number): string {
  return `${streak} ${streak === 1 ? "día" : "días"}`;
}
