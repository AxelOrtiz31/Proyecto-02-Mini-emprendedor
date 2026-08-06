import { supabase } from "@/lib/supabase";

// Capa de datos de escuelas y grupos (salones). La comparten el registro del
// alumno y el panel de la maestra.
//
// El registro lee escuelas y grupos SIN sesión: las políticas RLS de
// grupos_module.sql permiten el SELECT de los activos al rol `anon`. Todo lo
// demás (alta, edición, ver los inactivos) exige es_personal().

export interface Grupo {
  id: number;
  grado: string;
  nombre: string;
  escuelaId: number;
  escuelaNombre: string;
  turno: string | null;
  cicloEscolar: string | null;
  activo: boolean;
}

export interface Escuela {
  id: number;
  nombre: string;
  clave: string | null;
  activa: boolean;
}

// "5° A"
export function etiquetaGrupo(grupo: { grado: string; nombre: string }): string {
  return `${grupo.grado} ${grupo.nombre}`.trim();
}

interface GrupoRow {
  id: number;
  grado: string;
  nombre: string;
  turno: string | null;
  ciclo_escolar: string | null;
  activo: boolean;
  escuela_id: number;
  escuelas: { nombre: string } | null;
}

const GRUPO_COLUMNS =
  "id, grado, nombre, turno, ciclo_escolar, activo, escuela_id, escuelas ( nombre )";

function fromGrupoRow(row: GrupoRow): Grupo {
  return {
    id: row.id,
    grado: row.grado,
    nombre: row.nombre,
    escuelaId: row.escuela_id,
    escuelaNombre: row.escuelas?.nombre ?? "Sin escuela",
    turno: row.turno,
    cicloEscolar: row.ciclo_escolar,
    activo: row.activo,
  };
}

// Grupos que el alumno puede elegir al registrarse. Se traen todos de una vez
// y la cascada escuela -> grado -> grupo se arma en memoria: el catálogo es de
// unas decenas de filas y así el formulario no encadena tres viajes al server.
export async function fetchGruposDisponibles(): Promise<Grupo[]> {
  const { data, error } = await supabase
    .from("grupos")
    .select(GRUPO_COLUMNS)
    .eq("activo", true)
    .order("grado")
    .order("nombre");

  if (error || !data) {
    console.error("Error cargando los grupos:", error?.message);
    return [];
  }

  return (data as unknown as GrupoRow[]).map(fromGrupoRow);
}

// Todos los grupos, incluidos los desactivados. Solo lo alcanza el personal.
export async function fetchGruposAdmin(): Promise<Grupo[]> {
  const { data, error } = await supabase
    .from("grupos")
    .select(GRUPO_COLUMNS)
    .order("grado")
    .order("nombre");

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as GrupoRow[]).map(fromGrupoRow);
}

export async function fetchEscuelasAdmin(): Promise<Escuela[]> {
  const { data, error } = await supabase
    .from("escuelas")
    .select("id, nombre, clave, activa")
    .order("nombre");

  if (error) throw new Error(error.message);

  return (data ?? []) as Escuela[];
}

// ============================================================
// Altas y edición (panel)
// ============================================================

export async function crearEscuela(nombre: string, clave: string | null): Promise<void> {
  const { error } = await supabase.from("escuelas").insert({ nombre, clave });
  if (error) throw new Error(error.message);
}

export async function setEscuelaActiva(id: number, activa: boolean): Promise<void> {
  const { error } = await supabase.from("escuelas").update({ activa }).eq("id", id);
  if (error) throw new Error(error.message);
}

export interface NuevoGrupo {
  escuelaId: number;
  grado: string;
  nombre: string;
  turno: string | null;
  cicloEscolar: string | null;
}

export async function crearGrupo(grupo: NuevoGrupo): Promise<void> {
  const { error } = await supabase.from("grupos").insert({
    escuela_id: grupo.escuelaId,
    grado: grupo.grado,
    nombre: grupo.nombre,
    turno: grupo.turno,
    ciclo_escolar: grupo.cicloEscolar,
  });

  if (error) throw new Error(error.message);
}

export async function setGrupoActivo(id: number, activo: boolean): Promise<void> {
  const { error } = await supabase.from("grupos").update({ activo }).eq("id", id);
  if (error) throw new Error(error.message);
}
