// Contenido del Módulo 3 · "¿Quién es mi cliente?"
// Basado en el Bloque 3 (Niveles 9-12) del banco de preguntas del cliente.
// Las preguntas de cada nivel viven en Supabase (evaluaciones s3-u1-a1..a4);
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
    codigo: "s3-u1-a1",
    numero: 9,
    titulo: "Descubro a mi cliente",
    emoji: "🔎",
    emprenbot:
      "¡Excelente trabajo! Ya tienes una idea de negocio. Ahora descubrirás quién la necesita. Recuerda: un negocio no es para todos, sino para quienes realmente pueden beneficiarse de él.",
    explicacion:
      "Un cliente es la persona que compra o utiliza un producto o un servicio porque le ayuda a resolver una necesidad o satisfacer un deseo. Conocer a tu cliente permite crear mejores productos y ofrecer soluciones más útiles.",
    insignia: "Conocedor de Clientes",
  },
  {
    codigo: "s3-u1-a2",
    numero: 10,
    titulo: "Comprendo mi mercado meta",
    emoji: "🎯",
    emprenbot:
      "No todas las personas necesitan lo mismo. Los emprendedores descubren quién necesita más su idea.",
    explicacion:
      "El mercado meta es el grupo de personas que tiene mayor interés en comprar un producto o un servicio. No es lo mismo que \"cliente\" en general: elegir correctamente a este grupo ayuda a que el negocio tenga más posibilidades de éxito.",
    insignia: "Detective del Mercado",
  },
  {
    codigo: "s3-u1-a3",
    numero: 11,
    titulo: "Aplico lo que sé de mi cliente",
    emoji: "🧭",
    emprenbot:
      "Ahora demostrarás que sabes elegir a las personas que más necesitan un producto.",
    explicacion:
      "Cada producto tiene un cliente diferente. Un buen emprendedor observa la edad, los gustos, las actividades y las necesidades de las personas para saber a quién ofrecer su negocio.",
    insignia: "Amigo del Cliente",
  },
  {
    codigo: "s3-u1-a4",
    numero: 12,
    titulo: "Pienso como mi cliente",
    emoji: "🤝",
    emprenbot:
      "¡Excelente! Los mejores emprendedores siempre piensan primero en las personas a las que desean ayudar.",
    explicacion:
      "Cuando conoces a tu cliente puedes mejorar tu producto, ofrecer mejores soluciones y hacer que las personas quieran volver a comprar.",
    insignia: "Experto en Clientes",
  },
];

export interface ParClienteNegocio {
  emojiNegocio: string;
  negocio: string;
  emojiCliente: string;
  cliente: string;
}

// Práctica del Nivel 11: relacionar productos con el mercado meta adecuado.
export const DETECTIVE_PARES: ParClienteNegocio[] = [
  { emojiNegocio: "🍪", negocio: "Venta de galletas caseras", emojiCliente: "👦", cliente: "Niños y papás en recreo escolar" },
  { emojiNegocio: "🎨", negocio: "Pintura de camisetas", emojiCliente: "👗", cliente: "Jóvenes que quieren ropa única" },
  { emojiNegocio: "🌱", negocio: "Plantas en macetitas", emojiCliente: "🏠", cliente: "Personas que decoran su hogar" },
  { emojiNegocio: "📚", negocio: "Separadores artesanales", emojiCliente: "📖", cliente: "Estudiantes que aman leer" },
];

// Reto final: mismas 4 opciones que usa el documento del cliente.
export interface ClientePersona {
  id: string;
  emoji: string;
  nombre: string;
}

export const CLIENTE_PERSONAS: ClientePersona[] = [
  { id: "ninos", emoji: "🧒", nombre: "Niños" },
  { id: "jovenes", emoji: "🧑", nombre: "Jóvenes" },
  { id: "adultos", emoji: "🧑‍💼", nombre: "Adultos" },
  { id: "familias", emoji: "👨‍👩‍👧", nombre: "Familias" },
];

export interface LugarCliente {
  id: string;
  emoji: string;
  nombre: string;
}

export const LUGARES_CLIENTE: LugarCliente[] = [
  { id: "escuela", emoji: "🏫", nombre: "Escuela" },
  { id: "parque", emoji: "🌳", nombre: "Parque" },
  { id: "colonia", emoji: "🏘️", nombre: "Colonia" },
  { id: "redes_sociales", emoji: "📱", nombre: "Redes sociales (con ayuda de un adulto)" },
];

export const COMPETENCIAS_BLOQUE_3 = [
  "Empatía",
  "Pensamiento crítico",
  "Observación",
  "Comunicación",
  "Resolución de problemas",
  "Toma de decisiones",
  "Orientación al cliente",
];

export const XP_FIN_BLOQUE_3 = 300;
