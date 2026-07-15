// Contenido del Módulo 6 · "¿Cuánto vale mi esfuerzo?"
// Basado en el Bloque 6 (Niveles 21-24) del banco de preguntas del cliente.
// Las preguntas de cada nivel viven en Supabase (evaluaciones s6-u1-a1..a4);
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
    codigo: "s6-u1-a1",
    numero: 21,
    titulo: "¿Qué es el costo?",
    emoji: "🧾",
    emprenbot:
      "¡Tu negocio ya tiene una gran imagen! Ahora aprenderás algo muy importante: antes de vender, debes saber cuánto cuesta hacer tu producto.",
    explicacion:
      "El costo es el dinero que se necesita para elaborar un producto o prestar un servicio. Incluye los materiales, herramientas o ingredientes que utilizamos.",
    insignia: "Detective de Costos",
  },
  {
    codigo: "s6-u1-a2",
    numero: 22,
    titulo: "¿Qué es el precio?",
    emoji: "🏷️",
    emprenbot:
      "¡Ya sabes cuánto cuesta hacer tu producto! Ahora descubrirás cuánto debes cobrar por él.",
    explicacion:
      "El precio es la cantidad de dinero que el cliente paga por un producto o servicio. El precio debe ser justo tanto para el cliente como para el emprendedor.",
    insignia: "Experto en Precios",
  },
  {
    codigo: "s6-u1-a3",
    numero: 23,
    titulo: "¿Qué es la ganancia?",
    emoji: "📈",
    emprenbot:
      "¡Excelente! Ya conoces el costo y el precio. Ahora aprenderás cómo saber si tu negocio está ganando dinero.",
    explicacion:
      "La ganancia es el dinero que obtiene un negocio después de recuperar el costo de elaborar el producto o servicio. Ganancia = Precio de venta − Costo.",
    insignia: "Calculador de Ganancias",
  },
  {
    codigo: "s6-u1-a4",
    numero: 24,
    titulo: "Tomo decisiones como emprendedor",
    emoji: "🧮",
    emprenbot:
      "¡Ya piensas como un emprendedor! Ahora usarás todo lo aprendido para tomar buenas decisiones financieras.",
    explicacion:
      "Un buen emprendedor revisa sus costos, establece un precio adecuado y calcula su ganancia para que su negocio sea sostenible.",
    insignia: "Pequeño Administrador",
  },
];

export const COMPETENCIAS_BLOQUE_6 = [
  "Educación financiera",
  "Pensamiento matemático",
  "Resolución de problemas",
  "Toma de decisiones",
  "Responsabilidad",
  "Planeación",
  "Administración básica",
];

export const XP_FIN_BLOQUE_6 = 450;
