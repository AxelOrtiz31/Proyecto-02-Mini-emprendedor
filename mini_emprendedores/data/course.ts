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
  units: Unit[];
}

export const course: Section[] = [
  {
    id: "s1",
    number: 1,
    title: "Descubre tu chispa",
    status: "current",
    units: [
      {
        id: "s1-u1",
        number: 1,
        title: "¿Qué es emprender?",
        subtitle: "Tus primeras ideas",
        activities: [
          {
            id: "s1-u1-a1",
            title: "¿Qué es una idea?",
            description:
              "Descubre cómo nacen las grandes ideas a partir de cosas de todos los días.",
            kind: "lesson",
            status: "completed",
            stars: 3,
          },
          {
            id: "s1-u1-a2",
            title: "Problemas por todos lados",
            description:
              "Aprende a detectar pequeños problemas que tú mismo podrías resolver.",
            kind: "practice",
            status: "completed",
            stars: 2,
          },
          {
            id: "s1-u1-a3",
            title: "Tu chispa emprendedora",
            description:
              "Reconoce qué te hace único y cómo usar eso para crear algo genial.",
            kind: "story",
            status: "completed",
            stars: 3,
          },
        ],
      },
      {
        id: "s1-u2",
        number: 2,
        title: "Descubre tu idea",
        subtitle: "Encuentra lo que te apasiona",
        activities: [
          {
            id: "s1-u2-a1",
            title: "Lluvia de ideas",
            description:
              "Genera muchísimas ideas sin miedo a equivocarte. ¡Aquí todo vale!",
            kind: "lesson",
            status: "completed",
            stars: 3,
          },
          {
            id: "s1-u2-a2",
            title: "Elige tu favorita",
            description:
              "Aprende a escoger la idea con más potencial para empezar.",
            kind: "lesson",
            status: "current",
          },
          {
            id: "s1-u2-a3",
            title: "Reto: idea original",
            description:
              "Atrévete a inventar la idea más loca y divertida que se te ocurra.",
            kind: "challenge",
            status: "locked",
          },
          {
            id: "s1-u2-a4",
            title: "Pon tu idea a prueba",
            description:
              "Cuenta tu idea a un amigo y descubre si le emociona tanto como a ti.",
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
    title: "Arma tu equipo",
    status: "locked",
    units: [],
  },
  {
    id: "s3",
    number: 3,
    title: "Lanza tu producto",
    status: "locked",
    units: [],
  },
  {
    id: "s4",
    number: 4,
    title: "Crece y aprende",
    status: "locked",
    units: [],
  },
];
