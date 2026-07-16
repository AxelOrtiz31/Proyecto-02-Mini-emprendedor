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
  // Ruta que abre el nodo. Si se omite, se usa la lección genérica /leccion/{id}.
  route?: string;
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
            title: "Descubro qué es emprender",
            description:
              "Reconoce qué significa emprender y quién es un emprendedor.",
            kind: "lesson",
            status: "completed",
            route: "/modules01_06_complete/module01",
          },
          {
            id: "s1-u1-a2",
            title: "Comprendo por qué emprender",
            description:
              "Descubre por qué las personas emprenden y cómo ayudan a los demás.",
            kind: "story",
            status: "current",
          },
          {
            id: "s1-u1-a3",
            title: "Aplico mis ideas",
            description:
              "Aplica el concepto de emprendimiento a situaciones cotidianas.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s1-u1-a4",
            title: "Pienso como emprendedor",
            description:
              "Toma decisiones como un pequeño emprendedor.",
            kind: "boss",
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
            title: "Descubro mi idea de negocio",
            description:
              "Comprende qué es una idea de negocio y cómo nace.",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s2-u1-a2",
            title: "Comprendo mi idea",
            description:
              "Identifica si tu idea puede convertirse en un producto o en un servicio.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s2-u1-a3",
            title: "Aplico mi idea",
            description:
              "Selecciona la mejor idea de negocio analizando diferentes opciones.",
            kind: "challenge",
            status: "locked",
          },
          {
            id: "s2-u1-a4",
            title: "Creo mi idea de negocio",
            description:
              "Elige tu propia idea de negocio y justifica por qué puede funcionar.",
            kind: "boss",
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
            title: "Descubro a mi cliente",
            description:
              "Comprende qué es un cliente y por qué es importante para un negocio.",
            kind: "lesson",
            status: "locked",
            route: "/modules01_06_complete/module03",
          },
          {
            id: "s3-u1-a2",
            title: "Comprendo mi mercado meta",
            description:
              "Comprende qué es el mercado meta y diferéncialo del público en general.",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s3-u1-a3",
            title: "Aplico lo que sé de mi cliente",
            description:
              "Relaciona diferentes productos con el mercado meta adecuado.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s3-u1-a4",
            title: "Pienso como mi cliente",
            description:
              "Toma decisiones considerando las necesidades de tu cliente.",
            kind: "challenge",
            status: "locked",
          },
          {
            id: "s3-u1-a5",
            title: "Conoce a tu cliente ideal",
            description:
              "El reto final: define quién, dónde y por qué es tu cliente ideal.",
            kind: "boss",
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
            title: "El nombre de mi negocio",
            description:
              "Comprende la importancia de elegir un nombre atractivo y fácil de recordar.",
            kind: "lesson",
            status: "locked",
            route: "/modules01_06_complete/module04",
          },
          {
            id: "s4-u1-a2",
            title: "El logotipo y los colores",
            description:
              "Reconoce la importancia del logotipo y los colores para identificar un negocio.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s4-u1-a3",
            title: "El eslogan",
            description:
              "Comprende qué es un eslogan y cómo ayuda a comunicar una idea.",
            kind: "lesson",
            status: "locked",
          },
          {
            id: "s4-u1-a4",
            title: "Creo la identidad de mi negocio",
            description:
              "Integra el nombre, logotipo, colores y eslogan para construir tu marca.",
            kind: "challenge",
            status: "locked",
          },
          {
            id: "s4-u1-a5",
            title: "Crea la identidad de tu negocio",
            description:
              "El reto final: arma tu logo y descubre cómo se ve tu marca completa.",
            kind: "boss",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s5",
    number: 5,
    title: "Decorando mi emprendimiento",
    status: "locked",
    robot: "/robot.json",
    units: [
      {
        id: "s5-u1",
        number: 1,
        title: "Decorando mi emprendimiento",
        subtitle: "El empaque de tu producto",
        activities: [
          {
            id: "s5-u1-a1",
            title: "¿Qué es un empaque?",
            description:
              "Comprende qué es un empaque y por qué es importante para un producto.",
            kind: "lesson",
            status: "locked",
            route: "/modules01_06_complete/module05",
          },
          {
            id: "s5-u1-a2",
            title: "Diseño mi empaque",
            description:
              "Reconoce las características de un empaque atractivo y funcional.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s5-u1-a3",
            title: "Empaques responsables con el planeta",
            description:
              "Comprende la importancia de utilizar materiales amigables con el medio ambiente.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s5-u1-a4",
            title: "Creo el empaque de mi producto",
            description:
              "Diseña un empaque que represente el negocio y satisfaga las necesidades del cliente.",
            kind: "challenge",
            status: "locked",
          },
          {
            id: "s5-u1-a5",
            title: "Diseña el empaque de tu producto",
            description:
              "El reto final: elige color, material y elementos para el empaque de tu propio negocio.",
            kind: "boss",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s6",
    number: 6,
    title: "¿Cuánto vale mi esfuerzo?",
    status: "locked",
    robot: "/robot.json",
    units: [
      {
        id: "s6-u1",
        number: 1,
        title: "¿Cuánto vale mi esfuerzo?",
        subtitle: "Precios, costos y ganancias",
        activities: [
          {
            id: "s6-u1-a1",
            title: "¿Qué es el costo?",
            description:
              "Comprende qué es un costo y reconoce los materiales necesarios para elaborar un producto.",
            kind: "lesson",
            status: "locked",
            route: "/modules01_06_complete/module06",
          },
          {
            id: "s6-u1-a2",
            title: "¿Qué es el precio?",
            description:
              "Comprende qué es el precio y cómo se establece.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s6-u1-a3",
            title: "¿Qué es la ganancia?",
            description:
              "Comprende que la ganancia es el dinero que queda después de recuperar el costo.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s6-u1-a4",
            title: "Tomo decisiones como emprendedor",
            description:
              "Aplica los conceptos de costo, precio y ganancia para tomar decisiones sencillas.",
            kind: "challenge",
            status: "locked",
          },
          {
            id: "s6-u1-a5",
            title: "Calculo el precio de mi producto",
            description:
              "Calcula cuánto cuesta, cuánto venderás y cuánto ganarás con tu propio negocio.",
            kind: "boss",
            status: "locked",
          },
        ],
      },
    ],
  },
  {
    id: "s7",
    number: 7,
    title: "¡A vender!",
    status: "locked",
    robot: "/live-chatbot.json",
    robotSize: { base: 170, md: 240 },
    units: [
      {
        id: "s7-u1",
        number: 1,
        title: "¡A vender!",
        subtitle: "Llegó el gran momento",
        activities: [
          {
            id: "s7-u1-a1",
            title: "¿Qué es un pitch de ventas?",
            description:
              "Comprende qué es un pitch y por qué es importante al presentar un negocio.",
            kind: "lesson",
            status: "locked",
            route: "/modules01_06_complete/module07",
            
          },
          {
            id: "s7-u1-a2",
            title: "Comunico mi emprendimiento",
            description:
              "Reconoce las características de una buena presentación de ventas.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s7-u1-a3",
            title: "Tu turno de vender",
            description:
              "Aplica lo aprendido para identificar la mejor manera de vender un producto.",
            kind: "practice",
            status: "locked",
          },
          {
            id: "s7-u1-a4",
            title: "Soy un emprendedor",
            description:
              "Integra todo lo aprendido para tomar decisiones como un verdadero emprendedor.",
            kind: "challenge",
            status: "locked",
          },
          {
            id: "s7-u1-a5",
            title: "Presenta tu emprendimiento",
            description:
              "El gran reto final: arma el resumen de tu negocio y tu pitch de ventas.",
            kind: "boss",
            status: "locked",
          },
        ],
      },
    ],
  },
];
