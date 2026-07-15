// Contenido del Módulo 2 · "Mi idea de negocio"
// Basado en el Bloque 2 (Niveles 5-8) del banco de preguntas del cliente.
// Las preguntas de cada nivel viven en Supabase (evaluaciones s2-u1-a1..a4);
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
    codigo: "s2-u1-a1",
    numero: 1,
    titulo: "Descubro mi idea de negocio",
    emoji: "💭",
    emprenbot:
      "¡Toda gran empresa comenzó con una idea! Hoy descubrirás cómo encontrar la tuya.",
    explicacion:
      "Una idea de negocio es una propuesta para crear un producto o un servicio que ayude a resolver un problema o satisfacer una necesidad de las personas. Las mejores ideas suelen surgir al observar lo que hace falta en la escuela, en casa o en la comunidad.",
    insignia: "Cazador de Ideas",
  },
  {
    codigo: "s2-u1-a2",
    numero: 2,
    titulo: "Comprendo mi idea",
    emoji: "📦",
    emprenbot:
      "No todos los negocios venden objetos. Algunos ofrecen ayuda o realizan actividades para otras personas.",
    explicacion:
      "Existen dos tipos de negocios: los productos, que son cosas que las personas pueden comprar y llevar consigo, y los servicios, que son actividades que ayudan o benefician a otras personas.",
    insignia: "Explorador de Productos y Servicios",
  },
  {
    codigo: "s2-u1-a3",
    numero: 3,
    titulo: "Aplico mi idea",
    emoji: "🔍",
    emprenbot: "¡Es momento de pensar como un verdadero emprendedor!",
    explicacion:
      "No todas las ideas son igual de buenas. Un emprendedor compara varias opciones y elige aquella que sea útil, interesante y posible de realizar.",
    insignia: "Analista de Ideas",
  },
  {
    codigo: "s2-u1-a4",
    numero: 4,
    titulo: "Creo mi idea de negocio",
    emoji: "🛠️",
    emprenbot: "¡Llegó el momento de convertirte en creador de negocios!",
    explicacion:
      "Cada emprendedor tiene una idea diferente. Lo importante es elegir una que sea útil, creativa y que puedas explicar fácilmente.",
    insignia: "Constructor de Negocios",
  },
];

export const COMPETENCIAS_BLOQUE_2 = [
  "Creatividad",
  "Pensamiento crítico",
  "Observación del entorno",
  "Resolución de problemas",
  "Toma de decisiones",
  "Innovación",
  "Comunicación de ideas",
];

export const XP_FIN_BLOQUE_2 = 250;
