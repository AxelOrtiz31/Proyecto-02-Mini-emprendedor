// Nomenclatura de lecciones: "Módulo X - Lección Y".
// El módulo y el número de lección salen del código de la actividad
// (s{módulo}-u1-a{lección}), el mismo id que usan data/course.ts y cada
// Module_0X/data.ts; así el título nunca se desfasa del módulo real y la
// numeración de lecciones arranca de nuevo en 1 en cada módulo.

export function formatLessonLabel(moduleNumber: number, lessonNumber: number): string {
  return `Módulo ${moduleNumber} - Lección ${lessonNumber}`;
}

export function lessonLabelFromCode(code: string): string {
  const match = code.match(/^s(\d+)-u\d+-a(\d+)$/);
  if (!match) return "";

  return formatLessonLabel(Number(match[1]), Number(match[2]));
}
