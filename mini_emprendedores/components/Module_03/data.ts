// Contenido del Módulo 3 · "¿Quién será mi cliente?"
// Todo el texto vive aquí para que los pasos (steps) solo se encarguen de
// la interacción, y para facilitar ajustes de contenido sin tocar la UI.

export interface ParClienteNegocio {
  emojiNegocio: string;
  negocio: string;
  emojiCliente: string;
  cliente: string;
}

export const DETECTIVE_PARES: ParClienteNegocio[] = [
  { emojiNegocio: "🍪", negocio: "Venta de galletas caseras", emojiCliente: "👦", cliente: "Niños y papás en recreo escolar" },
  { emojiNegocio: "🎨", negocio: "Pintura de camisetas", emojiCliente: "👗", cliente: "Jóvenes que quieren ropa única" },
  { emojiNegocio: "🌱", negocio: "Plantas en macetitas", emojiCliente: "🏠", cliente: "Personas que decoran su hogar" },
  { emojiNegocio: "📚", negocio: "Separadores artesanales", emojiCliente: "📖", cliente: "Estudiantes que aman leer" },
];

export interface ClientePersona {
  id: string;
  emoji: string;
  nombre: string;
  descripcion: string;
  ejemplos: string;
}

export const CLIENTE_PERSONAS: ClientePersona[] = [
  {
    id: "ninos",
    emoji: "🧒",
    nombre: "Niños",
    descripcion: "Les encanta jugar, coleccionar y divertirse.",
    ejemplos: "Juguetes, dulces, stickers, juegos",
  },
  {
    id: "jovenes",
    emoji: "🧑",
    nombre: "Jóvenes",
    descripcion: "Buscan mostrar su estilo y seguir tendencias.",
    ejemplos: "Ropa, accesorios, tecnología",
  },
  {
    id: "familias",
    emoji: "👨‍👩‍👧",
    nombre: "Familias",
    descripcion: "Buscan cosas útiles y prácticas para el hogar.",
    ejemplos: "Decoración, comida, organización",
  },
  {
    id: "mascotas",
    emoji: "🐶",
    nombre: "Dueños de mascotas",
    descripcion: "Quieren consentir y cuidar a sus mascotas.",
    ejemplos: "Accesorios, premios, juguetes para mascotas",
  },
  {
    id: "adultos_mayores",
    emoji: "🧓",
    nombre: "Adultos mayores",
    descripcion: "Valoran la comodidad, la salud y la tranquilidad.",
    ejemplos: "Productos cómodos, plantas, manualidades",
  },
];
