import { supabase } from "@/lib/supabase";
import type { EvaluationQuestion } from "@/lib/evaluations";

export type Skill =
  | "liderazgo"
  | "creatividad"
  | "trabajo_equipo"
  | "resolucion_problemas";

export interface SkillInfo {
  label: string;
  emoji: string;
  description: string;
}

const SKILLS: Skill[] = [
  "liderazgo",
  "creatividad",
  "trabajo_equipo",
  "resolucion_problemas",
];

// Mapeo de opciones_respuesta.valor (1..4) a habilidad.
// Debe coincidir con la convención del seed_test_inicial.sql.
export const SKILL_BY_VALUE: Record<number, Skill> = {
  1: "liderazgo",
  2: "creatividad",
  3: "trabajo_equipo",
  4: "resolucion_problemas",
};

export const SKILL_INFO: Record<Skill, SkillInfo> = {
  liderazgo: {
    label: "Liderazgo",
    emoji: "🚀",
    description: "Sabes guiar a tu equipo y organizar las ideas para llegar a la meta.",
  },
  creatividad: {
    label: "Creatividad",
    emoji: "🎨",
    description: "Tu imaginación no tiene límites: siempre se te ocurre algo nuevo.",
  },
  trabajo_equipo: {
    label: "Trabajo en equipo",
    emoji: "🤝",
    description: "Escuchas, apoyas y logras que todos den lo mejor juntos.",
  },
  resolucion_problemas: {
    label: "Resolución de problemas",
    emoji: "🧩",
    description: "Ningún reto te asusta: lo piensas paso a paso y lo resuelves.",
  },
};

export type OnboardingStatus = "none" | "test" | "avatar" | "done";

export interface AvatarRecord {
  id: number;
  name: string;
  imageUrl: string;
}

interface ProfileStatusRow {
  habilidad_dominante: string | null;
  avatar_id: number | null;
}

interface AvatarRow {
  id: number;
  nombre: string;
  url_imagen: string;
}

function isSkill(value: string | null): value is Skill {
  return SKILLS.includes(value as Skill);
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return "none";

  const { data, error } = await supabase
    .from("perfiles")
    .select("habilidad_dominante, avatar_id")
    .eq("id", user.id)
    .maybeSingle<ProfileStatusRow>();

  if (error) {
    console.error("Error consultando el estado de onboarding:", error.message);
    // Ante un fallo de consulta no se bloquea el acceso al camino.
    return "done";
  }

  if (!data || !isSkill(data.habilidad_dominante)) return "test";
  if (!data.avatar_id) return "avatar";

  return "done";
}

export function routeForStatus(status: OnboardingStatus): string {
  if (status === "none") return "/login";
  if (status === "test") return "/onboarding/test";
  if (status === "avatar") return "/onboarding/avatar";

  return "/dashboard";
}

export function classifyDominantSkill(
  questions: EvaluationQuestion[],
  answers: Record<number, number[]>,
): Skill {
  const counts: Record<Skill, number> = {
    liderazgo: 0,
    creatividad: 0,
    trabajo_equipo: 0,
    resolucion_problemas: 0,
  };
  const lastPicked: Record<Skill, number> = {
    liderazgo: -1,
    creatividad: -1,
    trabajo_equipo: -1,
    resolucion_problemas: -1,
  };

  questions.forEach((question, index) => {
    const optionIds = answers[question.id] ?? [];

    for (const optionId of optionIds) {
      const option = question.options.find((item) => item.id === optionId);
      const skill = option ? SKILL_BY_VALUE[option.value] : undefined;

      if (!skill) continue;

      counts[skill] += 1;
      lastPicked[skill] = index;
    }
  });

  // Gana la habilidad más elegida; en empate, la elegida más recientemente.
  let winner: Skill = "liderazgo";
  let bestCount = -1;
  let bestLast = -2;

  for (const skill of SKILLS) {
    const isBetter =
      counts[skill] > bestCount ||
      (counts[skill] === bestCount && lastPicked[skill] > bestLast);

    if (isBetter) {
      winner = skill;
      bestCount = counts[skill];
      bestLast = lastPicked[skill];
    }
  }

  return winner;
}

async function updateProfileFields(
  fields: Record<string, unknown>,
): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return false;

  const { data, error } = await supabase
    .from("perfiles")
    .update(fields)
    .eq("id", user.id)
    .select("id");

  if (error) {
    console.error("Error actualizando el perfil:", error.message);
    return false;
  }

  if (data && data.length > 0) return true;

  // La fila de perfiles no existe todavía: se crea con los datos del registro.
  const metadata = user.user_metadata ?? {};
  const { error: insertError } = await supabase.from("perfiles").insert({
    id: user.id,
    nombre: metadata.nombre ?? "Alumno",
    apellido: metadata.apellido ?? "",
    ...fields,
  });

  // 23505 = clave duplicada. La fila sí existe, así que el update de arriba
  // debió alcanzarla: si devolvió 0 filas, falta la política RLS de UPDATE.
  if (insertError?.code === "23505") {
    console.error(
      "El perfil ya existe pero el update no lo alcanzó. Revisa la política RLS de UPDATE en la tabla perfiles.",
    );
    return false;
  }

  if (insertError) {
    console.error("Error creando el perfil:", insertError.message);
    return false;
  }

  return true;
}

export async function saveDominantSkill(skill: Skill): Promise<boolean> {
  return updateProfileFields({ habilidad_dominante: skill });
}

export async function saveAvatarChoice(avatarId: number): Promise<boolean> {
  return updateProfileFields({ avatar_id: avatarId });
}

export async function fetchDominantSkill(): Promise<Skill | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return null;

  const { data, error } = await supabase
    .from("perfiles")
    .select("habilidad_dominante")
    .eq("id", user.id)
    .maybeSingle<{ habilidad_dominante: string | null }>();

  if (error || !data || !isSkill(data.habilidad_dominante)) return null;

  return data.habilidad_dominante;
}

export async function fetchAvatarsBySkill(skill: Skill): Promise<AvatarRecord[]> {
  const { data, error } = await supabase
    .from("avatares")
    .select("id, nombre, url_imagen")
    .eq("habilidad", skill)
    .eq("activo", true)
    .order("id")
    .returns<AvatarRow[]>();

  if (error || !data) {
    console.error("Error cargando avatares:", error?.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.nombre,
    imageUrl: row.url_imagen,
  }));
}
