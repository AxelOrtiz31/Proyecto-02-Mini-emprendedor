// Tips del día para el panel del dashboard.
// Se elige uno según el día del año, así todos los alumnos ven el mismo
// tip cada día y va rotando solo, sin necesidad de base de datos.
// Si algún día quieren administrarlos desde Supabase, basta crear una
// tabla `tips` y reemplazar getTipOfTheDay por una consulta.

export const tips: string[] = [
  "Los mejores emprendedores empiezan resolviendo un problema pequeño que ellos mismos tienen.",
  "Escucha a tus clientes: ellos te dicen qué mejorar antes que nadie.",
  "Equivocarse no es perder, es aprender más rápido.",
  "Una buena idea se explica en una sola frase. ¡Practica la tuya!",
  "Empieza pequeño: vende una cosa bien antes de vender muchas.",
  "El nombre de tu negocio debe ser fácil de recordar y de pronunciar.",
  "Pregunta a tres personas qué opinan de tu idea. Te sorprenderá lo que aprendes.",
  "Ahorrar una parte de tus ganancias también es de emprendedores.",
  "Los colores de tu marca hablan de ti antes que tus palabras.",
  "Un cliente feliz le cuenta a sus amigos. Esa es la mejor publicidad.",
  "Conocer cuánto te cuesta hacer tu producto te ayuda a ponerle un precio justo.",
  "La constancia gana: dedicarle un poquito cada día suma muchísimo.",
  "Antes de vender, ensaya tu discurso frente al espejo o con tu familia.",
  "Toda gran empresa empezó siendo una idea en la cabeza de alguien como tú.",
];

export function getTipOfTheDay(date: Date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return tips[dayOfYear % tips.length];
}