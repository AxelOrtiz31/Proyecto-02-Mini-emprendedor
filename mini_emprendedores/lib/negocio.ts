import { supabase } from "@/lib/supabase";

// "Mi negocio" guarda las decisiones de emprendimiento que el niño toma a lo
// largo de los módulos: idea (Módulo 2), cliente (Módulo 3), marca (Módulo
// 4), empaque (Módulo 5), costo/precio/ganancia (Módulo 6) y el pitch final
// (Módulo 7). Una fila por alumno.

export interface MiNegocio {
  ideaNombre: string | null;
  ideaTipo: string | null; // 'producto' | 'servicio'
  ideaAyuda: string | null;
  clienteId: string | null;
  clienteNombre: string | null;
  clienteEmoji: string | null;
  clienteNecesita: string | null;
  clienteDondeEncontrar: string | null;
  nombreNegocio: string | null;
  estiloMarca: string | null;
  colorPrimario: string | null;
  colorSecundario: string | null;
  logoIcono: string | null;
  logoForma: string | null;
  marcaPercepcion: string | null;
  empaqueColor: string | null;
  empaqueMaterial: string | null;
  empaqueElementos: string | null;
  empaqueAmbiental: string | null;
  ideaCosto: number | null;
  ideaPrecio: number | null;
  ideaGanancia: number | null;
  ideaEstrategia: string | null;
  eslogan: string | null;
  pitchDiseno: string | null;
  pitchRazon: string | null;
}

interface NegocioRow {
  idea_nombre: string | null;
  idea_tipo: string | null;
  idea_ayuda: string | null;
  cliente_id: string | null;
  cliente_nombre: string | null;
  cliente_emoji: string | null;
  cliente_necesita: string | null;
  cliente_donde_encontrar: string | null;
  nombre_negocio: string | null;
  estilo_marca: string | null;
  color_primario: string | null;
  color_secundario: string | null;
  logo_icono: string | null;
  logo_forma: string | null;
  marca_percepcion: string | null;
  empaque_color: string | null;
  empaque_material: string | null;
  empaque_elementos: string | null;
  empaque_ambiental: string | null;
  idea_costo: number | null;
  idea_precio: number | null;
  idea_ganancia: number | null;
  idea_estrategia: string | null;
  eslogan: string | null;
  pitch_diseno: string | null;
  pitch_razon: string | null;
}

function fromRow(row: NegocioRow): MiNegocio {
  return {
    ideaNombre: row.idea_nombre,
    ideaTipo: row.idea_tipo,
    ideaAyuda: row.idea_ayuda,
    clienteId: row.cliente_id,
    clienteNombre: row.cliente_nombre,
    clienteEmoji: row.cliente_emoji,
    clienteNecesita: row.cliente_necesita,
    clienteDondeEncontrar: row.cliente_donde_encontrar,
    nombreNegocio: row.nombre_negocio,
    estiloMarca: row.estilo_marca,
    colorPrimario: row.color_primario,
    colorSecundario: row.color_secundario,
    logoIcono: row.logo_icono,
    logoForma: row.logo_forma,
    marcaPercepcion: row.marca_percepcion,
    empaqueColor: row.empaque_color,
    empaqueMaterial: row.empaque_material,
    empaqueElementos: row.empaque_elementos,
    empaqueAmbiental: row.empaque_ambiental,
    ideaCosto: row.idea_costo,
    ideaPrecio: row.idea_precio,
    ideaGanancia: row.idea_ganancia,
    ideaEstrategia: row.idea_estrategia,
    eslogan: row.eslogan,
    pitchDiseno: row.pitch_diseno,
    pitchRazon: row.pitch_razon,
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
      "idea_nombre, idea_tipo, idea_ayuda, cliente_id, cliente_nombre, cliente_emoji, cliente_necesita, cliente_donde_encontrar, nombre_negocio, estilo_marca, color_primario, color_secundario, logo_icono, logo_forma, marca_percepcion, empaque_color, empaque_material, empaque_elementos, empaque_ambiental, idea_costo, idea_precio, idea_ganancia, idea_estrategia, eslogan, pitch_diseno, pitch_razon",
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

  if (cambios.ideaNombre !== undefined) payload.idea_nombre = cambios.ideaNombre;
  if (cambios.ideaTipo !== undefined) payload.idea_tipo = cambios.ideaTipo;
  if (cambios.ideaAyuda !== undefined) payload.idea_ayuda = cambios.ideaAyuda;
  if (cambios.clienteId !== undefined) payload.cliente_id = cambios.clienteId;
  if (cambios.clienteNombre !== undefined) payload.cliente_nombre = cambios.clienteNombre;
  if (cambios.clienteEmoji !== undefined) payload.cliente_emoji = cambios.clienteEmoji;
  if (cambios.clienteNecesita !== undefined) payload.cliente_necesita = cambios.clienteNecesita;
  if (cambios.clienteDondeEncontrar !== undefined) payload.cliente_donde_encontrar = cambios.clienteDondeEncontrar;
  if (cambios.nombreNegocio !== undefined) payload.nombre_negocio = cambios.nombreNegocio;
  if (cambios.estiloMarca !== undefined) payload.estilo_marca = cambios.estiloMarca;
  if (cambios.colorPrimario !== undefined) payload.color_primario = cambios.colorPrimario;
  if (cambios.colorSecundario !== undefined) payload.color_secundario = cambios.colorSecundario;
  if (cambios.logoIcono !== undefined) payload.logo_icono = cambios.logoIcono;
  if (cambios.logoForma !== undefined) payload.logo_forma = cambios.logoForma;
  if (cambios.marcaPercepcion !== undefined) payload.marca_percepcion = cambios.marcaPercepcion;
  if (cambios.empaqueColor !== undefined) payload.empaque_color = cambios.empaqueColor;
  if (cambios.empaqueMaterial !== undefined) payload.empaque_material = cambios.empaqueMaterial;
  if (cambios.empaqueElementos !== undefined) payload.empaque_elementos = cambios.empaqueElementos;
  if (cambios.empaqueAmbiental !== undefined) payload.empaque_ambiental = cambios.empaqueAmbiental;
  if (cambios.ideaCosto !== undefined) payload.idea_costo = cambios.ideaCosto;
  if (cambios.ideaPrecio !== undefined) payload.idea_precio = cambios.ideaPrecio;
  if (cambios.ideaGanancia !== undefined) payload.idea_ganancia = cambios.ideaGanancia;
  if (cambios.ideaEstrategia !== undefined) payload.idea_estrategia = cambios.ideaEstrategia;
  if (cambios.eslogan !== undefined) payload.eslogan = cambios.eslogan;
  if (cambios.pitchDiseno !== undefined) payload.pitch_diseno = cambios.pitchDiseno;
  if (cambios.pitchRazon !== undefined) payload.pitch_razon = cambios.pitchRazon;

  payload.actualizado_en = new Date().toISOString();

  const { error } = await supabase
    .from("mi_negocio")
    .upsert(payload, { onConflict: "alumno_id" });

  if (error) {
    throw new Error(error.message);
  }
}
