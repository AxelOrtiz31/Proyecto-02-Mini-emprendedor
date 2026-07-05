export type ActivityStatus = "completed" | "current" | "bonus" | "locked";

export type ActivityKind =
  | "lesson"
  | "practice"
  | "story"
  | "challenge"
  | "bonus"
  | "boss";

export interface Activity {
  id: string;
  title: string;
  description: string;
  kind: ActivityKind;
  status: ActivityStatus;
  stars?: number;
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  activities: Activity[];
}

export type SectionStatus = "completed" | "current" | "locked";

export interface Section {
  id: string;
  number: number;
  title: string;
  status: SectionStatus;
  robot?: string;
  robotSize?: { base: number; md: number };
  units: Unit[];
}

export const course: Section[] = [
  {
    id: "s1",
    number: 1,
    title: "¿Qué es emprender?",
    status: "current",
    robot: "/intro-robot.json",
    robotSize: { base: 90, md: 140 },
    units: [
      {
        id: "s1-u1",
        number: 1,
        title: "¿Qué es emprender?",
        subtitle: "Descubre el mundo emprendedor",
        activities: [
          {
            id: "s1-u1-a1",
            title: "¿Qué es un emprendedor?",
            description:
              "Conoce qué hace un emprendedor y descubre que tú también puedes serlo.",
            kind: "lesson",
            status: "completed",
          },
          {
            id: "s1-u1-a2",
            title: "Historias que inspiran",
            description:
              "Conoce a niños y niñas que convirtieron sus ideas en negocios reales.",
            kind: "story",
            status: "current",
          },
          {
            id: "s1-u1-a3",
            title: "Mi chispa emprendedora",
            description:
              "Descubre qué habilidades emprendedoras ya tienes dentro de ti.",
            kind: "challenge",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s2",
    number: 2,
    title: "Mi idea de negocio",
    status: "locked",
    robot: "/anima-bot.json",
    units: [
      {
        id: "s2-u1",
        number: 1,
        title: "Mi idea de negocio",
        subtitle: "De la imaginación a la acción",
        activities: [
          {
            id: "s2-u1-a1",
            title: "Lluvia de ideas",
            description:
              "Genera muchas ideas divertidas sin miedo a equivocarte. ¡Aquí todo vale!",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s2-u1-a2",
            title: "Elige tu mejor idea",
            description:
              "Aprende a escoger la idea con más potencial para tu negocio.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s2-u1-a3",
            title: "Dibuja tu idea",
            description:
              "Convierte tu idea en un dibujo que cualquiera pueda entender.",
            kind: "challenge",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s3",
    number: 3,
    title: "¿Quién es mi cliente?",
    status: "locked",
    robot: "/web-analytics.json",
    robotSize: { base: 170, md: 240 },
    units: [
      {
        id: "s3-u1",
        number: 1,
        title: "¿Quién es mi cliente?",
        subtitle: "Conoce a quién vas a ayudar",
        activities: [
          {
            id: "s3-u1-a1",
            title: "¿Qué es un cliente?",
            description:
              "Descubre quiénes son los clientes y por qué son tan importantes.",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s3-u1-a2",
            title: "Detective de clientes",
            description:
              "Investiga qué necesitan y qué les gusta a tus futuros clientes.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s3-u1-a3",
            title: "El retrato de mi cliente",
            description:
              "Crea el retrato de tu cliente ideal: su edad, sus gustos y sus necesidades.",
            kind: "challenge",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s4",
    number: 4,
    title: "¡Le doy color a mi negocio!",
    status: "locked",
    robot: "/ai-robot.json",
    units: [
      {
        id: "s4-u1",
        number: 1,
        title: "¡Le doy color a mi negocio!",
        subtitle: "Crea tu propia marca",
        activities: [
          {
            id: "s4-u1-a1",
            title: "Nombre y logo",
            description:
              "Inventa un nombre pegajoso y un logo llamativo para tu negocio.",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s4-u1-a2",
            title: "Los colores de mi marca",
            description:
              "Elige los colores que muestren la personalidad de tu negocio.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s4-u1-a3",
            title: "Mi cartel publicitario",
            description:
              "Diseña un cartel para que todos conozcan tu negocio.",
            kind: "challenge",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s5",
    number: 5,
    title: "¿Cuánto vale mi esfuerzo?",
    status: "locked",
    robot: "/robot.json",
    units: [
      {
        id: "s5-u1",
        number: 1,
        title: "¿Cuánto vale mi esfuerzo?",
        subtitle: "Precios, costos y ganancias",
        activities: [
          {
            id: "s5-u1-a1",
            title: "Costos y precios",
            description:
              "Descubre cuánto cuesta crear tu producto y cuánto deberías cobrar.",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s5-u1-a2",
            title: "Calcula tu ganancia",
            description:
              "Aprende a calcular cuánto ganas con ejemplos muy sencillos.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s5-u1-a3",
            title: "Ponle un precio justo",
            description:
              "Decide el precio de tu producto valorando tu tiempo y esfuerzo.",
            kind: "challenge",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s6",
    number: 6,
    title: "¡A vender!",
    status: "locked",
    robot: "/live-chatbot.json",
    robotSize: { base: 170, md: 240 },
    units: [
      {
        id: "s6-u1",
        number: 1,
        title: "¡A vender!",
        subtitle: "Llegó el gran momento",
        activities: [
          {
            id: "s6-u1-a1",
            title: "Mi discurso de venta",
            description:
              "Prepara qué vas a decir para convencer a tus primeros clientes.",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s6-u1-a2",
            title: "Ensaya tu venta",
            description:
              "Practica cómo presentar tu producto con confianza y alegría.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s6-u1-a3",
            title: "¡Gran día de ventas!",
            description:
              "Demuestra todo lo aprendido y realiza tu primera venta.",
            kind: "boss",
            status: "locked",
          },
        ],
      },
    ],
  },
];
