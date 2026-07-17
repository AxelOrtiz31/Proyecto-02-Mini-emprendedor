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

// Etiquetas de la semana en el mismo orden que weekActivity: de lunes a domingo.
export const WEEK_LABELS: string[] = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

const MONTH_LABELS: string[] = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const CELEBRATION_KEY = "streak-celebration-day";

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

// Posición del día de hoy dentro de weekActivity (0 = lunes, 6 = domingo).
export function todayWeekIndex(now: Date = new Date()): number {
  return (now.getDay() + 6) % 7;
}

export interface MonthDay {
  dayOfMonth: number;
  active: boolean;
  today: boolean;
}

export interface MonthActivity {
  label: string;
  // Filas de lunes a domingo; null es una celda vacía antes o después del mes.
  weeks: Array<Array<MonthDay | null>>;
  practicedDays: number;
  perfect: boolean;
}

// Calendario de un mes con los días que tuvieron actividad, listo para pintar.
// Toda la aritmética de fechas vive aquí para que el componente solo recorra
// las filas.
export function getMonthActivity(
  timestamps: Array<string | null | undefined>,
  year: number,
  month: number,
  now: Date = new Date(),
): MonthActivity {
  const days = activityDays(timestamps);
  const today = localDayNumber(now);

  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<MonthDay | null> = [];

  for (let index = 0; index < leadingBlanks; index++) {
    cells.push(null);
  }

  let practicedDays = 0;
  let elapsedDays = 0;

  for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
    const dayNumber = localDayNumber(new Date(year, month, dayOfMonth));
    const active = days.has(dayNumber);

    if (active) practicedDays++;
    if (dayNumber <= today) elapsedDays++;

    cells.push({ dayOfMonth, active, today: dayNumber === today });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: Array<Array<MonthDay | null>> = [];

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return {
    label: `${MONTH_LABELS[month]} ${year}`,
    weeks,
    practicedDays,
    // Un mes es perfecto si se practicó cada día ya transcurrido. El practicedDays
    // > 0 evita que un mes futuro (sin días transcurridos) salga perfecto.
    perfect: practicedDays > 0 && practicedDays === elapsedDays,
  };
}

// La celebración de racha se muestra una sola vez al día, la primera vez que se
// completa una lección. La marca vive en localStorage y no distingue usuario
// (igual que "leccion-paso:" en lessonProgress): en un equipo compartido, el
// segundo alumno del día no verá la celebración.
export function canShowStreakCelebration(now: Date = new Date()): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(CELEBRATION_KEY) !== String(localDayNumber(now));
  } catch {
    // Sin localStorage no podemos saber si ya se mostró hoy; preferimos no
    // repetir la celebración lección tras lección.
    return false;
  }
}

export function markStreakCelebrationShown(now: Date = new Date()): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CELEBRATION_KEY, String(localDayNumber(now)));
  } catch {
    // no-op
  }
}
