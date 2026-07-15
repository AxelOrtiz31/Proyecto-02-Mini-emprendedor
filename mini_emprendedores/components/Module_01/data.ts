// Contenido del Módulo 1 · "¿Qué es emprender?"
// Basado en el Bloque 1 (Niveles 1-4) del banco de preguntas del cliente.
// Las preguntas de cada nivel viven en Supabase (evaluaciones s1-u1-a1..a4);
// aquí solo vive el contenido de enseñanza que las antecede.

export interface Nivel {
  codigo: string; // coincide con el id de actividad en data/course.ts
  numero: number;
  titulo: string;
  emoji: string;
  emprenbot: string;
  explicacion: string;
  insignia: string;
}

export const NIVELES: Nivel[] = [
  {
    codigo: "s1-u1-a1",
    numero: 1,
    titulo: "Descubro qué es emprender",
    emoji: "💡",
    emprenbot:
      "¡Bienvenido! Hoy descubrirás que cualquier gran negocio comenzó con una idea. ¿Listo para convertirte en un pequeño emprendedor?",
    explicacion:
      "Emprender es crear una idea para resolver un problema o ayudar a alguien. Un emprendedor es una persona que tiene ideas y trabaja para hacerlas realidad — como Ana, que crea pulseras para vender en su escuela.",
    insignia: "Explorador de Ideas",
  },
  {
    codigo: "s1-u1-a2",
    numero: 2,
    titulo: "Comprendo por qué emprender",
    emoji: "🤝",
    emprenbot: "Los mejores negocios ayudan a alguien. Descubramos cómo.",
    explicacion:
      "Las personas emprenden para ayudar a otros y resolver problemas de su comunidad. Cuando alguien nota que falta algo — como frutas cortadas en su colonia — puede convertir esa idea en un negocio que beneficia a todos.",
    insignia: "Buscador de Oportunidades",
  },
  {
    codigo: "s1-u1-a3",
    numero: 3,
    titulo: "Aplico mis ideas",
    emoji: "🧩",
    emprenbot:
      "Ahora usarás tu imaginación para resolver pequeños retos como un verdadero emprendedor.",
    explicacion:
      "Un buen emprendedor usa su imaginación para resolver retos cotidianos: piensa primero cómo puede ayudar a los demás, y luego crea algo creativo y diferente para lograrlo.",
    insignia: "Creador de Soluciones",
  },
  {
    codigo: "s1-u1-a4",
    numero: 4,
    titulo: "Pienso como emprendedor",
    emoji: "🧠",
    emprenbot:
      "¡Ya piensas como un emprendedor! Ahora demuestra qué harías en diferentes situaciones.",
    explicacion:
      "Emprender también significa saber trabajar con otras personas: escuchar cuando algo puede mejorar, tener empatía, resolver problemas de tus clientes y motivar a tu equipo.",
    insignia: "Pequeño Emprendedor",
  },
];

export const COMPETENCIAS_BLOQUE_1 = [
  "Creatividad",
  "Pensamiento crítico",
  "Empatía",
  "Liderazgo",
  "Resolución de problemas",
  "Trabajo colaborativo",
  "Comunicación",
];

export const XP_FIN_BLOQUE_1 = 200;
