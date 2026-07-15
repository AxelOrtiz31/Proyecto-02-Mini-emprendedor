// Contenido del Módulo 7 · "¡A vender!"
// Basado en el Bloque 7 (Niveles 25-28) del banco de preguntas del cliente.
// Las preguntas de cada nivel viven en Supabase (evaluaciones s7-u1-a1..a4);
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
    codigo: "s7-u1-a1",
    numero: 25,
    titulo: "¿Qué es un pitch de ventas?",
    emoji: "🎤",
    emprenbot:
      "¡Felicidades! Ya creaste tu emprendimiento. Ahora aprenderás a contarle al mundo por qué tu idea es especial.",
    explicacion:
      "Un pitch de ventas es una presentación corta y clara donde explicas qué vendes, a quién ayudas y por qué las personas deberían elegir tu producto o servicio.",
    insignia: "Pequeño Presentador",
  },
  {
    codigo: "s7-u1-a2",
    numero: 26,
    titulo: "Comunico mi emprendimiento",
    emoji: "😊",
    emprenbot:
      "¡Las palabras también venden! Hoy aprenderás cómo hablar con confianza para convencer a tus clientes.",
    explicacion:
      "Una buena presentación debe ser clara, respetuosa y transmitir confianza. También es importante sonreír, mirar al público y explicar por qué el producto es útil.",
    insignia: "Gran Comunicador",
  },
  {
    codigo: "s7-u1-a3",
    numero: 27,
    titulo: "Tu turno de vender",
    emoji: "🤝",
    emprenbot:
      "¡Llegó el gran momento! Ahora demostrarás que sabes cómo presentar y vender tu emprendimiento.",
    explicacion:
      "Vender significa explicar cómo un producto ayuda a las personas. Escuchar a los clientes y responder sus dudas ayuda a generar confianza.",
    insignia: "Vendedor Estrella",
  },
  {
    codigo: "s7-u1-a4",
    numero: 28,
    titulo: "Soy un emprendedor",
    emoji: "🌟",
    emprenbot:
      "¡Has llegado al último nivel! Ahora demostrarás todo lo que aprendiste durante esta aventura emprendedora.",
    explicacion:
      "Un emprendedor observa problemas, crea soluciones, conoce a sus clientes, diseña su marca, calcula costos y presenta su negocio con entusiasmo y responsabilidad.",
    insignia: "Maestro Emprendedor",
  },
];

export const COMPETENCIAS_CURSO_COMPLETO = [
  "Identificación de oportunidades",
  "Innovación",
  "Creatividad",
  "Planeación de negocios",
  "Educación financiera",
  "Comunicación oral",
  "Trabajo colaborativo",
  "Liderazgo",
  "Empatía",
  "Resolución de problemas",
  "Toma de decisiones",
  "Pensamiento crítico",
  "Confianza en sí mismo",
];

export const XP_GRAN_FINAL = 1000;
