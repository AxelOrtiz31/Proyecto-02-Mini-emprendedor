import { supabase } from "@/lib/supabase";

// "Mi negocio" guarda las decisiones de emprendimiento que el niño toma a lo
// largo de los módulos (cliente elegido en el Módulo 3, nombre/colores/estilo/
// logo elegidos en el Módulo 4, etc.). Una fila por alumno.

export interface MiNegocio {
  clienteId: string | null;
  clienteNombre: string | null;
  clienteEmoji: string | null;
  nombreNegocio: string | null;
  estiloMarca: string | null;
  colorPrimario: string | null;
  colorSecundario: string | null;
  logoIcono: string | null;
  logoForma: string | null;
}

interface NegocioRow {
  cliente_id: string | null;
  cliente_nombre: string | null;
  cliente_emoji: string | null;
  nombre_negocio: string | null;
  estilo_marca: string | null;
  color_primario: string | null;
  color_secundario: string | null;
  logo_icono: string | null;
  logo_forma: string | null;
}

function fromRow(row: NegocioRow): MiNegocio {
  return {
    clienteId: row.cliente_id,
    clienteNombre: row.cliente_nombre,
    clienteEmoji: row.cliente_emoji,
    nombreNegocio: row.nombre_negocio,
    estiloMarca: row.estilo_marca,
    colorPrimario: row.color_primario,
    colorSecundario: row.color_secundario,
    logoIcono: row.logo_icono,
    logoForma: row.logo_forma,
  };
}

async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

// Trae el negocio del alumno autenticado, o null si aún no ha tomado
// ninguna decisión.
export async function fetchMiNegocio(): Promise<MiNegocio | null> {
  const userId = await getCurrentUserId();

  if (!userId) return null;

  const { data, error } = await supabase
    .from("mi_negocio")
    .select(
      "cliente_id, cliente_nombre, cliente_emoji, nombre_negocio, estilo_marca, color_primario, color_secundario, logo_icono, logo_forma",
    )
    .eq("alumno_id", userId)
    .maybeSingle<NegocioRow>();

  if (error || !data) {
    if (error) console.error("Error cargando mi_negocio:", error.message);
    return null;
  }

  return fromRow(data);
}

// Guarda (crea o actualiza) solo los campos recibidos, sin borrar los que ya
// existían. Se puede llamar varias veces a lo largo de los módulos.
export async function saveMiNegocio(cambios: Partial<MiNegocio>): Promise<void> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Necesitas iniciar sesión para guardar tu negocio.");
  }

  const payload: Record<string, unknown> = { alumno_id: userId };

  if (cambios.clienteId !== undefined) payload.cliente_id = cambios.clienteId;
  if (cambios.clienteNombre !== undefined) payload.cliente_nombre = cambios.clienteNombre;
  if (cambios.clienteEmoji !== undefined) payload.cliente_emoji = cambios.clienteEmoji;
  if (cambios.nombreNegocio !== undefined) payload.nombre_negocio = cambios.nombreNegocio;
  if (cambios.estiloMarca !== undefined) payload.estilo_marca = cambios.estiloMarca;
  if (cambios.colorPrimario !== undefined) payload.color_primario = cambios.colorPrimario;
  if (cambios.colorSecundario !== undefined) payload.color_secundario = cambios.colorSecundario;
  if (cambios.logoIcono !== undefined) payload.logo_icono = cambios.logoIcono;
  if (cambios.logoForma !== undefined) payload.logo_forma = cambios.logoForma;

  payload.actualizado_en = new Date().toISOString();

  const { error } = await supabase
    .from("mi_negocio")
    .upsert(payload, { onConflict: "alumno_id" });

  if (error) {
    throw new Error(error.message);
  }
}
