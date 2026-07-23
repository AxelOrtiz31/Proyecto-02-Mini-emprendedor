import { supabase } from "@/lib/supabase";

// Capa de datos para editar el contenido de las evaluaciones (preguntas y
// opciones de respuesta). El acceso lo habilita admin_evaluaciones.sql.

export const TIPO_LABEL: Record<string, string> = {
  inicial: "Test inicial",
  final: "Examen final",
  modulo: "Evaluación de módulo",
};

export interface EvaluacionItem {
  id: number;
  nombre: string;
  tipo: string;
  instrucciones: string | null;
  activa: boolean;
  moduloNumero: number | null;
  codigoLeccion: string | null;
  numPreguntas: number;
}

export interface OpcionEditable {
  id: number;
  etiqueta: string;
  valor: number;
  emoji: string | null;
  esCorrecta: boolean;
  orden: number;
}

export interface PreguntaEditable {
  id: number;
  texto: string;
  orden: number;
  multiple: boolean;
  activa: boolean;
  opciones: OpcionEditable[];
}

export interface EvaluacionEditable {
  id: number;
  nombre: string;
  tipo: string;
  instrucciones: string | null;
  activa: boolean;
  preguntas: PreguntaEditable[];
}

type ModuloRel = { numero: number } | { numero: number }[] | null;

function numeroModulo(modulo: ModuloRel): number | null {
  if (!modulo) return null;
  if (Array.isArray(modulo)) return modulo[0]?.numero ?? null;
  return modulo.numero;
}

function errorFk(error: { code?: string; message: string }): Error {
  if (error.code === "23503") {
    return new Error(
      "No se puede eliminar porque un alumno ya respondió esto. Desactiva la pregunta en lugar de borrarla.",
    );
  }
  return new Error(error.message);
}

// ============================================================
// Lecturas
// ============================================================

interface ListaRow {
  id: number;
  nombre: string;
  tipo: string;
  instrucciones: string | null;
  activa: boolean;
  codigo_leccion: string | null;
  modulos: ModuloRel;
  preguntas_evaluacion: { id: number }[];
}

export async function fetchEvaluacionesLista(): Promise<EvaluacionItem[]> {
  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      "id, nombre, tipo, instrucciones, activa, codigo_leccion, modulos ( numero ), preguntas_evaluacion ( id )",
    )
    .order("tipo", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return ((data ?? []) as ListaRow[]).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    tipo: row.tipo,
    instrucciones: row.instrucciones,
    activa: row.activa,
    codigoLeccion: row.codigo_leccion,
    moduloNumero: numeroModulo(row.modulos),
    numPreguntas: (row.preguntas_evaluacion ?? []).length,
  }));
}

interface OpcionRow {
  id: number;
  etiqueta: string;
  valor: number;
  emoji: string | null;
  orden: number;
  es_correcta: boolean;
}

interface PreguntaRow {
  id: number;
  texto: string;
  orden: number;
  multiple: boolean;
  activa: boolean;
  opciones_respuesta: OpcionRow[];
}

interface EvalRow {
  id: number;
  nombre: string;
  tipo: string;
  instrucciones: string | null;
  activa: boolean;
  preguntas_evaluacion: PreguntaRow[];
}

export async function fetchEvaluacionEditable(id: number): Promise<EvaluacionEditable | null> {
  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      `id, nombre, tipo, instrucciones, activa,
       preguntas_evaluacion (
         id, texto, orden, multiple, activa,
         opciones_respuesta ( id, etiqueta, valor, emoji, orden, es_correcta )
       )`,
    )
    .eq("id", id)
    .maybeSingle<EvalRow>();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const preguntas = [...(data.preguntas_evaluacion ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map((pregunta) => ({
      id: pregunta.id,
      texto: pregunta.texto,
      orden: pregunta.orden,
      multiple: pregunta.multiple,
      activa: pregunta.activa,
      opciones: [...(pregunta.opciones_respuesta ?? [])]
        .sort((a, b) => a.orden - b.orden)
        .map((opcion) => ({
          id: opcion.id,
          etiqueta: opcion.etiqueta,
          valor: opcion.valor,
          emoji: opcion.emoji,
          esCorrecta: opcion.es_correcta,
          orden: opcion.orden,
        })),
    }));

  return {
    id: data.id,
    nombre: data.nombre,
    tipo: data.tipo,
    instrucciones: data.instrucciones,
    activa: data.activa,
    preguntas,
  };
}

// ============================================================
// Mutaciones
// ============================================================

export async function actualizarEvaluacion(
  id: number,
  cambios: { nombre?: string; instrucciones?: string | null; activa?: boolean },
): Promise<void> {
  const payload: Record<string, unknown> = { actualizada_en: new Date().toISOString() };

  if (cambios.nombre !== undefined) payload.nombre = cambios.nombre;
  if (cambios.instrucciones !== undefined) payload.instrucciones = cambios.instrucciones;
  if (cambios.activa !== undefined) payload.activa = cambios.activa;

  const { error } = await supabase.from("evaluaciones").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function crearPregunta(
  evaluacionId: number,
  texto: string,
  orden: number,
  multiple = false,
): Promise<number> {
  const { data, error } = await supabase
    .from("preguntas_evaluacion")
    .insert({ evaluacion_id: evaluacionId, texto, orden, multiple, activa: true })
    .select("id")
    .single<{ id: number }>();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear la pregunta");
  return data.id;
}

export async function actualizarPregunta(
  id: number,
  cambios: { texto?: string; multiple?: boolean; activa?: boolean; orden?: number },
): Promise<void> {
  const payload: Record<string, unknown> = {};

  if (cambios.texto !== undefined) payload.texto = cambios.texto;
  if (cambios.multiple !== undefined) payload.multiple = cambios.multiple;
  if (cambios.activa !== undefined) payload.activa = cambios.activa;
  if (cambios.orden !== undefined) payload.orden = cambios.orden;

  if (Object.keys(payload).length === 0) return;

  const { error } = await supabase.from("preguntas_evaluacion").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarPregunta(id: number): Promise<void> {
  const opciones = await supabase.from("opciones_respuesta").delete().eq("pregunta_id", id);
  if (opciones.error) throw errorFk(opciones.error);

  const pregunta = await supabase.from("preguntas_evaluacion").delete().eq("id", id);
  if (pregunta.error) throw errorFk(pregunta.error);
}

export interface DatosOpcion {
  etiqueta: string;
  valor: number;
  emoji: string | null;
  esCorrecta: boolean;
  orden: number;
}

export async function crearOpcion(preguntaId: number, opcion: DatosOpcion): Promise<number> {
  const { data, error } = await supabase
    .from("opciones_respuesta")
    .insert({
      pregunta_id: preguntaId,
      etiqueta: opcion.etiqueta,
      valor: opcion.valor,
      emoji: opcion.emoji,
      es_correcta: opcion.esCorrecta,
      orden: opcion.orden,
    })
    .select("id")
    .single<{ id: number }>();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear la opción");
  return data.id;
}

export async function actualizarOpcion(
  id: number,
  cambios: Partial<DatosOpcion>,
): Promise<void> {
  const payload: Record<string, unknown> = {};

  if (cambios.etiqueta !== undefined) payload.etiqueta = cambios.etiqueta;
  if (cambios.valor !== undefined) payload.valor = cambios.valor;
  if (cambios.emoji !== undefined) payload.emoji = cambios.emoji;
  if (cambios.esCorrecta !== undefined) payload.es_correcta = cambios.esCorrecta;
  if (cambios.orden !== undefined) payload.orden = cambios.orden;

  if (Object.keys(payload).length === 0) return;

  const { error } = await supabase.from("opciones_respuesta").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function eliminarOpcion(id: number): Promise<void> {
  const { error } = await supabase.from("opciones_respuesta").delete().eq("id", id);
  if (error) throw errorFk(error);
}
