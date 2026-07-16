// Recuerda en qué paso de una lección (no de la evaluación) se quedó el
// alumno, para poder reanudar exactamente ahí si sale y vuelve a entrar.
//
// Vive en localStorage a propósito: es progreso de navegación efímero,
// distinto de las decisiones de negocio (mi_negocio) o del avance real
// (progreso_lecciones), que sí se guardan en Supabase. Si el alumno cambia
// de dispositivo, simplemente retoma la lección desde el inicio — no pierde
// nada importante.
//
// La evaluación de cierre (CheckCorto) nunca guarda respuestas aquí: cada
// vez que un componente CheckCorto se monta, arranca con respuestas vacías,
// así que "reanudar" en la fase de evaluación ya equivale a reiniciarla.

const PREFIJO = "leccion-paso:";

export function guardarPasoLeccion(lessonId: string, fase: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PREFIJO + lessonId, fase);
  } catch {
    // localStorage puede fallar (modo privado, cuota llena, etc.); no es
    // crítico para continuar la lección, así que lo ignoramos.
  }
}

export function leerPasoLeccion(lessonId: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(PREFIJO + lessonId);
  } catch {
    return null;
  }
}

export function borrarPasoLeccion(lessonId: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(PREFIJO + lessonId);
  } catch {
    // no-op
  }
}
