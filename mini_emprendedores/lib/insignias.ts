import { supabase } from "@/lib/supabase";

export interface Insignia {
  codigoLeccion: string;
  nombre: string;
  moduloNumero: number | null;
  obtenidaEn: string;
}

async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

interface InsigniaRow {
  codigo_leccion: string;
  nombre_insignia: string;
  modulo_numero: number | null;
  obtenida_en: string;
}

function fromRow(row: InsigniaRow): Insignia {
  return {
    codigoLeccion: row.codigo_leccion,
    nombre: row.nombre_insignia,
    moduloNumero: row.modulo_numero,
    obtenidaEn: row.obtenida_en,
  };
}

// Todas las insignias ganadas por el alumno autenticado, más recientes primero.
export async function fetchInsignias(): Promise<Insignia[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("insignias_alumno")
    .select("codigo_leccion, nombre_insignia, modulo_numero, obtenida_en")
    .eq("alumno_id", userId)
    .order("obtenida_en", { ascending: false });

  if (error || !data) {
    console.error("Error cargando insignias:", error?.message);
    return [];
  }

  return data.map(fromRow);
}
