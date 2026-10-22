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

let pending: Promise<Insignia[]> | null = null;

// Todas las insignias ganadas por el alumno autenticado, más recientes primero.
// Si ya hay una consulta en curso se comparte, así el camino no la repite por
// cada panel que la pide; una vez terminada, la siguiente llamada consulta de nuevo.
export function fetchInsignias(): Promise<Insignia[]> {
  if (pending) return pending;

  pending = loadInsignias().finally(() => {
    pending = null;
  });

  return pending;
}

async function loadInsignias(): Promise<Insignia[]> {
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
