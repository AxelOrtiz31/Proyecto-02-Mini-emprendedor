import { supabase } from "@/lib/supabase";
import { course } from "@/data/course";
import { activityOrder } from "@/lib/progress";

// Capa de datos del panel de la maestra. El personal (maestro/admin) lee el
// progreso de todo el grupo y administra a los alumnos. El acceso lo habilitan
// las políticas RLS de admin_module.sql (función es_personal()).

const TOTAL_ACTIVIDADES = activityOrder.length;

export const HABILIDAD_LABEL: Record<string, string> = {
  liderazgo: "Liderazgo",
  creatividad: "Creatividad",
  trabajo_equipo: "Trabajo en equipo",
  resolucion_problemas: "Resolución de problemas",
};

const HABILIDADES = [
  "liderazgo",
  "creatividad",
  "trabajo_equipo",
  "resolucion_problemas",
] as const;

// ============================================================
// Formato para la interfaz
// ============================================================

export function nombreCompleto(alumno: { nombre: string; apellido: string }): string {
  return `${alumno.nombre} ${alumno.apellido}`.trim();
}

export function formatearFecha(fecha: string | null): string {
  if (!fecha) return "Sin registrar";
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatearFechaHora(fecha: string | null): string {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatearTiempo(segundos: number): string {
  if (!segundos || segundos <= 0) return "0 min";
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  if (horas > 0) return `${horas} h ${minutos} min`;
  return `${minutos} min`;
}

// ============================================================
// Rol del usuario autenticado
// ============================================================

export async function fetchCurrentProfileRole(): Promise<string | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return null;

  const { data, error } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle<{ rol: string }>();

  if (error || !data) return null;

  return data.rol;
}

export function isStaffRole(rol: string | null): boolean {
  return rol === "maestro" || rol === "admin";
}

// ============================================================
// Tipos
// ============================================================

export interface AlumnoResumen {
  id: string;
  nombre: string;
  apellido: string;
  edad: number | null;
  gradoEscolar: string | null;
  alias: string | null;
  rol: string;
  activo: boolean;
  ultimaSesion: string | null;
  habilidadDominante: string | null;
  fechaRegistro: string | null;
  cursoCompletadoEn: string | null;
  leccionesCompletadas: number;
  xpTotal: number;
  estrellas: number;
  insignias: number;
  tiempoTotalSegundos: number;
  moduloNumero: number | null;
  modulosCompletados: number;
  porcentajeAvance: number;
}

export interface KpisGlobales {
  totalAlumnos: number;
  alumnosActivos: number;
  alumnosConActividad: number;
  promedioAvance: number;
  xpTotalGrupo: number;
  cursosCompletados: number;
  embudoModulos: { modulo: number; titulo: string; completados: number }[];
  distribucionHabilidad: { habilidad: string; label: string; total: number }[];
}

interface PerfilRow {
  id: string;
  nombre: string;
  apellido: string;
  edad: number | null;
  grado_escolar: string | null;
  alias: string | null;
  rol: string;
  activo: boolean;
  ultima_sesion: string | null;
  habilidad_dominante: string | null;
  fecha_registro: string | null;
  curso_completado_en: string | null;
}

interface ProgresoRow {
  alumno_id: string;
  codigo_leccion: string | null;
  xp_obtenido: number | null;
  estrellas: number | null;
  tiempo_segundos: number | null;
  completada_en: string | null;
}

interface ProgresoAgg {
  count: number;
  xp: number;
  estrellas: number;
  tiempo: number;
  codigos: Set<string>;
  ultimaCodigo: string | null;
  ultimaFecha: string | null;
}

const PERFIL_COLUMNS =
  "id, nombre, apellido, edad, grado_escolar, alias, rol, activo, ultima_sesion, habilidad_dominante, fecha_registro, curso_completado_en";

// ============================================================
// Derivaciones (misma lógica que components/Profile/ProfilePage.tsx)
// ============================================================

function moduloNumeroDeCodigo(codigo: string | null): number | null {
  if (!codigo) return null;
  const match = codigo.match(/^s(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function contarModulosCompletados(codigos: Set<string>): number {
  return course.filter((section) =>
    section.units
      .flatMap((unit) => unit.activities)
      .every((activity) => codigos.has(activity.id)),
  ).length;
}

function porcentaje(count: number): number {
  if (TOTAL_ACTIVIDADES === 0) return 0;
  return Math.round((count / TOTAL_ACTIVIDADES) * 100);
}

function aggVacio(): ProgresoAgg {
  return {
    count: 0,
    xp: 0,
    estrellas: 0,
    tiempo: 0,
    codigos: new Set(),
    ultimaCodigo: null,
    ultimaFecha: null,
  };
}

function agregarProgreso(rows: ProgresoRow[]): Map<string, ProgresoAgg> {
  const map = new Map<string, ProgresoAgg>();

  for (const row of rows) {
    let agg = map.get(row.alumno_id);
    if (!agg) {
      agg = aggVacio();
      map.set(row.alumno_id, agg);
    }

    agg.count += 1;
    agg.xp += row.xp_obtenido ?? 0;
    agg.estrellas += row.estrellas ?? 0;
    agg.tiempo += row.tiempo_segundos ?? 0;
    if (row.codigo_leccion) agg.codigos.add(row.codigo_leccion);

    if (row.completada_en && (!agg.ultimaFecha || row.completada_en > agg.ultimaFecha)) {
      agg.ultimaFecha = row.completada_en;
      agg.ultimaCodigo = row.codigo_leccion;
    }
  }

  return map;
}

function construirResumen(perfil: PerfilRow, agg: ProgresoAgg, insignias: number): AlumnoResumen {
  return {
    id: perfil.id,
    nombre: perfil.nombre,
    apellido: perfil.apellido,
    edad: perfil.edad,
    gradoEscolar: perfil.grado_escolar,
    alias: perfil.alias,
    rol: perfil.rol,
    activo: perfil.activo,
    ultimaSesion: perfil.ultima_sesion,
    habilidadDominante: perfil.habilidad_dominante,
    fechaRegistro: perfil.fecha_registro,
    cursoCompletadoEn: perfil.curso_completado_en,
    leccionesCompletadas: agg.count,
    xpTotal: agg.xp,
    estrellas: agg.estrellas,
    insignias,
    tiempoTotalSegundos: agg.tiempo,
    moduloNumero: moduloNumeroDeCodigo(agg.ultimaCodigo),
    modulosCompletados: contarModulosCompletados(agg.codigos),
    porcentajeAvance: porcentaje(agg.count),
  };
}

// ============================================================
// Carga del grupo (una sola ronda de consultas)
// ============================================================

interface DatosGrupo {
  perfiles: PerfilRow[];
  progresoPorAlumno: Map<string, ProgresoAgg>;
  insigniasPorAlumno: Map<string, number>;
}

async function cargarDatosGrupo(): Promise<DatosGrupo> {
  const [perfilesRes, progresoRes, insigniasRes] = await Promise.all([
    supabase.from("perfiles").select(PERFIL_COLUMNS).eq("rol", "alumno").order("nombre"),
    supabase
      .from("progreso_lecciones")
      .select("alumno_id, codigo_leccion, xp_obtenido, estrellas, tiempo_segundos, completada_en")
      .eq("estado", "completada"),
    supabase.from("insignias_alumno").select("alumno_id"),
  ]);

  if (perfilesRes.error) throw new Error(perfilesRes.error.message);
  if (progresoRes.error) throw new Error(progresoRes.error.message);
  if (insigniasRes.error) throw new Error(insigniasRes.error.message);

  const perfiles = (perfilesRes.data ?? []) as PerfilRow[];
  const progresoPorAlumno = agregarProgreso((progresoRes.data ?? []) as ProgresoRow[]);

  const insigniasPorAlumno = new Map<string, number>();
  for (const row of (insigniasRes.data ?? []) as { alumno_id: string }[]) {
    insigniasPorAlumno.set(row.alumno_id, (insigniasPorAlumno.get(row.alumno_id) ?? 0) + 1);
  }

  return { perfiles, progresoPorAlumno, insigniasPorAlumno };
}

function mapResumen(datos: DatosGrupo): AlumnoResumen[] {
  return datos.perfiles.map((perfil) =>
    construirResumen(
      perfil,
      datos.progresoPorAlumno.get(perfil.id) ?? aggVacio(),
      datos.insigniasPorAlumno.get(perfil.id) ?? 0,
    ),
  );
}

function derivarKpis(datos: DatosGrupo, resumen: AlumnoResumen[]): KpisGlobales {
  const totalAlumnos = resumen.length;
  const alumnosActivos = resumen.filter((r) => r.activo).length;
  const alumnosConActividad = resumen.filter((r) => r.leccionesCompletadas > 0).length;
  const xpTotalGrupo = resumen.reduce((sum, r) => sum + r.xpTotal, 0);
  const cursosCompletados = resumen.filter((r) => r.cursoCompletadoEn).length;
  const promedioAvance =
    totalAlumnos === 0
      ? 0
      : Math.round(resumen.reduce((sum, r) => sum + r.porcentajeAvance, 0) / totalAlumnos);

  const embudoModulos = course.map((section) => {
    const ids = section.units.flatMap((unit) => unit.activities).map((activity) => activity.id);
    const completados = datos.perfiles.filter((perfil) => {
      const codigos = datos.progresoPorAlumno.get(perfil.id)?.codigos ?? new Set<string>();
      return ids.every((id) => codigos.has(id));
    }).length;

    return { modulo: section.number, titulo: section.title, completados };
  });

  const distribucionHabilidad = HABILIDADES.map((habilidad) => ({
    habilidad,
    label: HABILIDAD_LABEL[habilidad],
    total: resumen.filter((r) => r.habilidadDominante === habilidad).length,
  }));

  return {
    totalAlumnos,
    alumnosActivos,
    alumnosConActividad,
    promedioAvance,
    xpTotalGrupo,
    cursosCompletados,
    embudoModulos,
    distribucionHabilidad,
  };
}

export async function fetchResumenAlumnos(): Promise<AlumnoResumen[]> {
  return mapResumen(await cargarDatosGrupo());
}

export async function fetchKpisGlobales(): Promise<KpisGlobales> {
  const datos = await cargarDatosGrupo();
  return derivarKpis(datos, mapResumen(datos));
}

export async function fetchReporteGrupo(): Promise<{ resumen: AlumnoResumen[]; kpis: KpisGlobales }> {
  const datos = await cargarDatosGrupo();
  const resumen = mapResumen(datos);
  return { resumen, kpis: derivarKpis(datos, resumen) };
}

// ============================================================
// Detalle de un alumno
// ============================================================

export interface SesionResumen {
  evaluacion: string | null;
  puntajeTotal: number | null;
  puntajeMaximo: number | null;
  estado: string;
  completadaEn: string | null;
}

export interface InsigniaResumen {
  nombre: string;
  moduloNumero: number | null;
  obtenidaEn: string;
}

export interface NegocioResumen {
  nombreNegocio: string | null;
  eslogan: string | null;
  ideaNombre: string | null;
  ideaTipo: string | null;
  ideaCosto: number | null;
  ideaPrecio: number | null;
  ideaGanancia: number | null;
  logoIcono: string | null;
  colorPrimario: string | null;
}

export interface ModuloAvance {
  modulo: number;
  titulo: string;
  completadas: number;
  total: number;
}

export interface AlumnoDetalle {
  perfil: AlumnoResumen;
  modulos: ModuloAvance[];
  sesiones: SesionResumen[];
  insignias: InsigniaResumen[];
  negocio: NegocioResumen | null;
}

interface SesionRow {
  puntaje_total: number | null;
  puntaje_maximo: number | null;
  estado: string;
  completada_en: string | null;
  evaluaciones: { nombre: string } | { nombre: string }[] | null;
}

function nombreEvaluacion(ev: SesionRow["evaluaciones"]): string | null {
  if (!ev) return null;
  if (Array.isArray(ev)) return ev[0]?.nombre ?? null;
  return ev.nombre;
}

export async function fetchAlumnoDetalle(alumnoId: string): Promise<AlumnoDetalle | null> {
  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select(PERFIL_COLUMNS)
    .eq("id", alumnoId)
    .maybeSingle<PerfilRow>();

  if (perfilError || !perfil) {
    if (perfilError) console.error("Error cargando alumno:", perfilError.message);
    return null;
  }

  const [progresoRes, insigniasRes, sesionesRes, negocioRes] = await Promise.all([
    supabase
      .from("progreso_lecciones")
      .select("alumno_id, codigo_leccion, xp_obtenido, estrellas, tiempo_segundos, completada_en")
      .eq("alumno_id", alumnoId)
      .eq("estado", "completada"),
    supabase
      .from("insignias_alumno")
      .select("nombre_insignia, modulo_numero, obtenida_en")
      .eq("alumno_id", alumnoId)
      .order("obtenida_en", { ascending: false }),
    supabase
      .from("sesiones_evaluacion")
      .select("puntaje_total, puntaje_maximo, estado, completada_en, evaluaciones ( nombre )")
      .eq("alumno_id", alumnoId)
      .order("iniciada_en", { ascending: false }),
    supabase
      .from("mi_negocio")
      .select(
        "nombre_negocio, eslogan, idea_nombre, idea_tipo, idea_costo, idea_precio, idea_ganancia, logo_icono, color_primario",
      )
      .eq("alumno_id", alumnoId)
      .maybeSingle(),
  ]);

  const progresoRows = (progresoRes.data ?? []) as ProgresoRow[];
  const agg = agregarProgreso(progresoRows).get(alumnoId) ?? aggVacio();

  const modulos: ModuloAvance[] = course.map((section) => {
    const actividades = section.units.flatMap((unit) => unit.activities);
    return {
      modulo: section.number,
      titulo: section.title,
      completadas: actividades.filter((activity) => agg.codigos.has(activity.id)).length,
      total: actividades.length,
    };
  });

  const sesiones: SesionResumen[] = ((sesionesRes.data ?? []) as SesionRow[]).map((row) => ({
    evaluacion: nombreEvaluacion(row.evaluaciones),
    puntajeTotal: row.puntaje_total,
    puntajeMaximo: row.puntaje_maximo,
    estado: row.estado,
    completadaEn: row.completada_en,
  }));

  const insignias: InsigniaResumen[] = (
    (insigniasRes.data ?? []) as {
      nombre_insignia: string;
      modulo_numero: number | null;
      obtenida_en: string;
    }[]
  ).map((row) => ({
    nombre: row.nombre_insignia,
    moduloNumero: row.modulo_numero,
    obtenidaEn: row.obtenida_en,
  }));

  const negocioRow = negocioRes.data as Record<string, unknown> | null;
  const negocio: NegocioResumen | null = negocioRow
    ? {
        nombreNegocio: (negocioRow.nombre_negocio as string) ?? null,
        eslogan: (negocioRow.eslogan as string) ?? null,
        ideaNombre: (negocioRow.idea_nombre as string) ?? null,
        ideaTipo: (negocioRow.idea_tipo as string) ?? null,
        ideaCosto: (negocioRow.idea_costo as number) ?? null,
        ideaPrecio: (negocioRow.idea_precio as number) ?? null,
        ideaGanancia: (negocioRow.idea_ganancia as number) ?? null,
        logoIcono: (negocioRow.logo_icono as string) ?? null,
        colorPrimario: (negocioRow.color_primario as string) ?? null,
      }
    : null;

  return {
    perfil: construirResumen(perfil, agg, insignias.length),
    modulos,
    sesiones,
    insignias,
    negocio,
  };
}

// ============================================================
// Mutaciones (CRUD de alumnos)
// ============================================================

export interface CambiosAlumno {
  nombre?: string;
  apellido?: string;
  edad?: number | null;
  gradoEscolar?: string | null;
  alias?: string | null;
}

export async function actualizarAlumno(id: string, cambios: CambiosAlumno): Promise<void> {
  const payload: Record<string, unknown> = {};

  if (cambios.nombre !== undefined) payload.nombre = cambios.nombre;
  if (cambios.apellido !== undefined) payload.apellido = cambios.apellido;
  if (cambios.edad !== undefined) payload.edad = cambios.edad;
  if (cambios.gradoEscolar !== undefined) payload.grado_escolar = cambios.gradoEscolar;
  if (cambios.alias !== undefined) payload.alias = cambios.alias;

  if (Object.keys(payload).length === 0) return;

  const { error } = await supabase.from("perfiles").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function cambiarRolAlumno(id: string, rol: string): Promise<void> {
  const { error } = await supabase.from("perfiles").update({ rol }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setAlumnoActivo(id: string, activo: boolean): Promise<void> {
  const { error } = await supabase.from("perfiles").update({ activo }).eq("id", id);
  if (error) throw new Error(error.message);
}

// Reinicia el avance del alumno respetando las llaves foráneas: primero las
// respuestas (hijas de las sesiones), luego sesiones, insignias y progreso, y
// por último limpia la marca de curso completado.
export async function reiniciarProgreso(alumnoId: string): Promise<void> {
  const { data: sesiones, error: sesionesError } = await supabase
    .from("sesiones_evaluacion")
    .select("id")
    .eq("alumno_id", alumnoId);

  if (sesionesError) throw new Error(sesionesError.message);

  const sesionIds = (sesiones ?? []).map((s) => s.id);

  if (sesionIds.length > 0) {
    const { error } = await supabase
      .from("respuestas_evaluacion")
      .delete()
      .in("sesion_id", sesionIds);
    if (error) throw new Error(error.message);
  }

  for (const tabla of ["sesiones_evaluacion", "insignias_alumno", "progreso_lecciones"]) {
    const { error } = await supabase.from(tabla).delete().eq("alumno_id", alumnoId);
    if (error) throw new Error(error.message);
  }

  const { error: perfilError } = await supabase
    .from("perfiles")
    .update({ curso_completado_en: null })
    .eq("id", alumnoId);
  if (perfilError) throw new Error(perfilError.message);
}
