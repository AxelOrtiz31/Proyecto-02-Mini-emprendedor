import { supabase } from "@/lib/supabase";

// Nombre y avatar del alumno para el saludo y la barra superior.
// Los pide una sola vez aunque varios componentes los necesiten a la vez, y los
// guarda en memoria para que volver al camino no repita las consultas ni deje
// el saludo en "Cargando...". La caché vive solo en la pestaña: nunca se
// comparte entre pestañas ni sobrevive a recargar la página.

export interface StudentProfile {
  userId: string;
  nombre: string;
  apellido: string;
  avatarUrl: string | null;
}

// Nombre y avatar casi no cambian: pasado este tiempo se vuelven a pedir en
// segundo plano, mostrando mientras tanto lo que ya se tenía.
const MAX_AGE_MS = 5 * 60 * 1000;

let cached: { profile: StudentProfile; savedAt: number } | null = null;
let pending: Promise<StudentProfile | null> | null = null;
// Sube al borrar la caché: una consulta que ya iba en camino no debe volver a
// guardar los datos de un alumno que acaba de cerrar sesión.
let generation = 0;

// Lo último que se conoce del alumno, sin consultar nada; null si aún no hay datos.
export function readCachedStudentProfile(): StudentProfile | null {
  return cached?.profile ?? null;
}

export function clearStudentProfileCache(): void {
  cached = null;
  pending = null;
  generation += 1;
}

export function isSameStudentProfile(a: StudentProfile | null, b: StudentProfile | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  return (
    a.userId === b.userId &&
    a.nombre === b.nombre &&
    a.apellido === b.apellido &&
    a.avatarUrl === b.avatarUrl
  );
}

export function fetchStudentProfile(): Promise<StudentProfile | null> {
  if (pending) return pending;

  pending = loadStudentProfile().finally(() => {
    pending = null;
  });

  return pending;
}

async function loadStudentProfile(): Promise<StudentProfile | null> {
  try {
    // getSession lee la sesión guardada en el navegador, sin pedirla al servidor.
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      cached = null;
      return null;
    }

    if (cached && cached.profile.userId === userId && Date.now() - cached.savedAt < MAX_AGE_MS) {
      return cached.profile;
    }

    const startedAt = generation;
    const profile = await queryStudentProfile(userId);
    if (startedAt === generation) cached = { profile, savedAt: Date.now() };

    return profile;
  } catch (error) {
    console.error("Error cargando el perfil del alumno:", error);
    return null;
  }
}

async function queryStudentProfile(userId: string): Promise<StudentProfile> {
  const { data: perfil, error } = await supabase
    .from("perfiles")
    .select("nombre, apellido, avatar_id")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  let avatarUrl: string | null = null;
  if (perfil?.avatar_id) {
    const { data: avatar } = await supabase
      .from("avatares")
      .select("url_imagen")
      .eq("id", perfil.avatar_id)
      .maybeSingle();
    avatarUrl = avatar?.url_imagen ?? null;
  }

  return {
    userId,
    nombre: perfil?.nombre || "Alumno",
    apellido: perfil?.apellido || "",
    avatarUrl,
  };
}

// Al cerrar sesión se borra todo, así otro alumno en el mismo equipo nunca ve
// el nombre del anterior.
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") clearStudentProfileCache();
  });
}
