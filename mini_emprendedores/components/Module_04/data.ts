// Contenido del Módulo 4 · "¡Le doy color a mi negocio!"
// Basado en el Bloque 4 (Niveles 13-16) del banco de preguntas del cliente.
// Las preguntas de cada nivel viven en Supabase (evaluaciones s4-u1-a1..a4);
// aquí solo vive el contenido de enseñanza que las antecede.

export interface Nivel {
  codigo: string;
  numero: number;
  titulo: string;
  emoji: string;
  emprenbot: string;
  explicacion: string;
  insignia: string;
}

export const NIVELES: Nivel[] = [
  {
    codigo: "s4-u1-a1",
    numero: 13,
    titulo: "El nombre de mi negocio",
    emoji: "🏷️",
    emprenbot:
      "¡Ya sabes qué vas a vender y quién será tu cliente! Ahora es momento de darle un nombre a tu negocio. Un buen nombre puede hacer que las personas lo recuerden fácilmente.",
    explicacion:
      "El nombre de un negocio es su carta de presentación. Debe ser corto, fácil de pronunciar, fácil de recordar y relacionado con el producto o servicio que ofrece.",
    insignia: "Creador de Nombres",
  },
  {
    codigo: "s4-u1-a2",
    numero: 14,
    titulo: "El logotipo y los colores",
    emoji: "🎨",
    emprenbot:
      "Las personas recuerdan lo que ven. Un buen logotipo y los colores adecuados hacen que un negocio sea especial.",
    explicacion:
      "El logotipo es el dibujo o símbolo que representa un negocio. Los colores ayudan a transmitir emociones y permiten que las personas reconozcan una marca con facilidad.",
    insignia: "Diseñador Creativo",
  },
  {
    codigo: "s4-u1-a3",
    numero: 15,
    titulo: "El eslogan",
    emoji: "💬",
    emprenbot:
      "Las mejores marcas tienen una frase que las hace inolvidables. ¡Hoy crearás mensajes que inspiren a tus clientes!",
    explicacion:
      "Un eslogan es una frase corta que comunica el beneficio principal del negocio y ayuda a que las personas lo recuerden.",
    insignia: "Maestro del Eslogan",
  },
  {
    codigo: "s4-u1-a4",
    numero: 16,
    titulo: "Creo la identidad de mi negocio",
    emoji: "🧩",
    emprenbot:
      "¡Felicidades! Ahora unirás todas las piezas para crear una marca que las personas recuerden.",
    explicacion:
      "La identidad de una marca está formada por el nombre, el logotipo, los colores y el eslogan. Todos estos elementos deben comunicar la misma idea para que los clientes identifiquen fácilmente el negocio.",
    insignia: "Diseñador de Marcas",
  },
];

export const COMPETENCIAS_BLOQUE_4 = [
  "Creatividad",
  "Comunicación",
  "Pensamiento crítico",
  "Expresión visual",
  "Innovación",
  "Toma de decisiones",
  "Construcción de identidad de marca",
];

export const XP_FIN_BLOQUE_4 = 350;

export interface ColorMarca {
  id: string;
  emoji: string;
  nombre: string;
  hex: string;
  sensacion: string;
  ejemplo: string;
}

export const COLORES_MARCA: ColorMarca[] = [
  { id: "rojo", emoji: "🔴", nombre: "Rojo", hex: "#FF6B6B", sensacion: "Energía y urgencia", ejemplo: "Promociones, comida" },
  { id: "azul", emoji: "🔵", nombre: "Azul", hex: "#4FACFE", sensacion: "Confianza y calma", ejemplo: "Tecnología, finanzas" },
  { id: "verde", emoji: "🟢", nombre: "Verde", hex: "#6BCB77", sensacion: "Naturaleza y salud", ejemplo: "Ecológico, bienestar" },
  { id: "amarillo", emoji: "🟡", nombre: "Amarillo", hex: "#FFD93D", sensacion: "Alegría y creatividad", ejemplo: "Infantil, diversión" },
  { id: "morado", emoji: "🟣", nombre: "Morado", hex: "#C77DFF", sensacion: "Misterio y lujo", ejemplo: "Joyería, spa" },
  { id: "naranja", emoji: "🟠", nombre: "Naranja", hex: "#FFB347", sensacion: "Aventura y entusiasmo", ejemplo: "Deportes, juventud" },
];

export interface EstiloMarca {
  id: string;
  emoji: string;
  nombre: string;
  descripcion: string;
}

export const ESTILOS_MARCA: EstiloMarca[] = [
  { id: "divertido", emoji: "🎉", nombre: "Divertido", descripcion: "Alegre, colorido y lleno de energía" },
  { id: "elegante", emoji: "✨", nombre: "Elegante", descripcion: "Fino, cuidado y sofisticado" },
  { id: "ecologico", emoji: "🌿", nombre: "Ecológico", descripcion: "Natural, consciente y sencillo" },
  { id: "creativo", emoji: "🎨", nombre: "Creativo", descripcion: "Original, artístico y único" },
  { id: "deportivo", emoji: "⚡", nombre: "Deportivo", descripcion: "Activo, fuerte y dinámico" },
];

export const LOGO_ICONOS: string[] = ["⭐", "🌟", "🍪", "🎨", "🌱", "📚", "🐾", "🚀", "💡", "🎈", "🏆", "🍀"];

export interface LogoForma {
  id: string;
  nombre: string;
  clipPath: string;
}

export const LOGO_FORMAS: LogoForma[] = [
  { id: "circulo", nombre: "Círculo", clipPath: "circle(50% at 50% 50%)" },
  { id: "cuadrado", nombre: "Cuadrado", clipPath: "inset(0% round 18%)" },
  {
    id: "escudo",
    nombre: "Escudo",
    clipPath: "polygon(50% 0%, 100% 15%, 100% 55%, 50% 100%, 0% 55%, 0% 15%)",
  },
  {
    id: "nube",
    nombre: "Nube",
    // La nube no usa clip-path (una sola figura no da la silueta correcta);
    // se arma en LogoBadge combinando varios círculos.
    clipPath: "none",
  },
];
