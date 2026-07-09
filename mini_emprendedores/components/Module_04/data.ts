// Contenido del Módulo 4 · "¡Le doy color a mi negocio!"

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
  radius: string;
}

export const LOGO_FORMAS: LogoForma[] = [
  { id: "circulo", nombre: "Círculo", radius: "9999px" },
  { id: "cuadrado", nombre: "Cuadrado", radius: "1rem" },
  { id: "escudo", nombre: "Escudo", radius: "2.5rem 2.5rem 2.5rem 0.5rem" },
  { id: "nube", nombre: "Nube", radius: "2.5rem 2.5rem 0.5rem 2.5rem" },
];
