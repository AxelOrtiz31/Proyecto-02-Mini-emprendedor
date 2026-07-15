// Contenido del Módulo 5 · "Decorando mi emprendimiento (Empaque)"
// Basado en el Bloque 5 (Niveles 17-20) del banco de preguntas del cliente.
// Las preguntas de cada nivel viven en Supabase (evaluaciones s5-u1-a1..a4);
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
    codigo: "s5-u1-a1",
    numero: 17,
    titulo: "¿Qué es un empaque?",
    emoji: "📦",
    emprenbot:
      "¡Tu negocio ya tiene nombre y logotipo! Ahora necesita un buen empaque para proteger el producto y llamar la atención de los clientes.",
    explicacion:
      "El empaque es el material o recipiente que protege un producto. Además de cuidarlo, ayuda a que se vea atractivo y permite que los clientes conozcan información importante sobre él.",
    insignia: "Protector de Productos",
  },
  {
    codigo: "s5-u1-a2",
    numero: 18,
    titulo: "Diseño mi empaque",
    emoji: "🎨",
    emprenbot:
      "Un buen empaque protege el producto y también invita a las personas a conocerlo. ¡Diseñemos uno increíble!",
    explicacion:
      "Un buen empaque debe ser resistente, bonito, fácil de abrir y representar la imagen del negocio. También debe brindar información clara al cliente.",
    insignia: "Diseñador de Empaques",
  },
  {
    codigo: "s5-u1-a3",
    numero: 19,
    titulo: "Empaques responsables con el planeta",
    emoji: "🌍",
    emprenbot:
      "Los emprendedores también cuidan el planeta. Un buen negocio piensa en las personas y en la naturaleza.",
    explicacion:
      "Muchos negocios utilizan empaques reciclables o reutilizables para reducir la contaminación y cuidar el medio ambiente. Esto también ayuda a construir una buena imagen del negocio.",
    insignia: "Guardián del Planeta",
  },
  {
    codigo: "s5-u1-a4",
    numero: 20,
    titulo: "Creo el empaque de mi producto",
    emoji: "🏗️",
    emprenbot:
      "¡Ya casi eres un verdadero emprendedor! Es momento de crear un empaque que proteja tu producto y haga que todos quieran conocerlo.",
    explicacion:
      "El mejor empaque combina protección, creatividad, información clara y cuidado del medio ambiente. Además, debe hacer que el cliente identifique fácilmente la marca.",
    insignia: "Arquitecto del Empaque",
  },
];

export interface MaterialEmpaque {
  id: string;
  emoji: string;
  nombre: string;
  ecologico: boolean;
}

export const MATERIALES_EMPAQUE: MaterialEmpaque[] = [
  { id: "carton_reciclado", emoji: "📦", nombre: "Cartón reciclado", ecologico: true },
  { id: "papel", emoji: "📄", nombre: "Papel", ecologico: true },
  { id: "tela", emoji: "👜", nombre: "Tela", ecologico: true },
  { id: "vidrio", emoji: "🫙", nombre: "Vidrio", ecologico: true },
  { id: "plastico", emoji: "🥤", nombre: "Plástico", ecologico: false },
];

export interface ElementoImpreso {
  id: string;
  emoji: string;
  nombre: string;
}

export const ELEMENTOS_IMPRESOS: ElementoImpreso[] = [
  { id: "nombre", emoji: "🏪", nombre: "Nombre del negocio" },
  { id: "logotipo", emoji: "🖼️", nombre: "Logotipo" },
  { id: "eslogan", emoji: "💬", nombre: "Eslogan" },
  { id: "instrucciones", emoji: "📋", nombre: "Instrucciones de uso" },
];

export const COMPETENCIAS_BLOQUE_5 = [
  "Creatividad",
  "Pensamiento crítico",
  "Comunicación visual",
  "Innovación",
  "Conciencia ambiental",
  "Resolución de problemas",
  "Diseño de productos",
];

export const XP_FIN_BLOQUE_5 = 400;
