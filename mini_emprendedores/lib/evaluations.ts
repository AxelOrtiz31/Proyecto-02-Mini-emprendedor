import { supabase } from "@/lib/supabase";

// El contenido de las evaluaciones vive en Supabase (evaluaciones, preguntas_evaluacion,
// opciones_respuesta) y las respuestas del alumno se guardan en sesiones_evaluacion y
// respuestas_evaluacion. Cada evaluación de tipo "modulo" se enlaza a un módulo por su número.

export interface EvaluationOption {
  id: number;
  label: string;
  emoji: string | null;
  value: number;
}

export interface EvaluationQuestion {
  id: number;
  text: string;
  multiple: boolean;
  options: EvaluationOption[];
}

export interface Evaluation {
  id: number;
  name: string;
  instructions: string | null;
  questions: EvaluationQuestion[];
}

export interface Answer {
  questionId: number;
  optionIds: number[];
}

// Formas crudas tal como llegan de Supabase (nombres de columnas en español).
interface OptionRow {
  id: number;
  etiqueta: string;
  emoji: string | null;
  valor: number;
  orden: number;
}

interface QuestionRow {
  id: number;
  texto: string;
  multiple: boolean;
  orden: number;
  opciones_respuesta: OptionRow[];
}

interface EvaluationRow {
  id: number;
  nombre: string;
  instrucciones: string | null;
  preguntas_evaluacion: QuestionRow[];
}

function byOrden(a: { orden: number }, b: { orden: number }): number {
  return a.orden - b.orden;
}

// Carga la evaluación de un módulo (por su número) con preguntas y opciones ya ordenadas.
export async function fetchModuleEvaluation(
  moduleNumber: number,
): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      `id, nombre, instrucciones,
       modulos!inner ( numero ),
       preguntas_evaluacion ( id, texto, multiple, orden,
         opciones_respuesta ( id, etiqueta, emoji, valor, orden ) )`,
    )
    .eq("tipo", "modulo")
    .eq("modulos.numero", moduleNumber)
    .eq("activa", true)
    .limit(1)
    .returns<EvaluationRow[]>();

  if (error || !data || data.length === 0) return null;
  const row = data[0];

  const questions = [...row.preguntas_evaluacion].sort(byOrden).map((question) => ({
    id: question.id,
    text: question.texto,
    multiple: question.multiple,
    options: [...question.opciones_respuesta].sort(byOrden).map((option) => ({
      id: option.id,
      label: option.etiqueta,
      emoji: option.emoji,
      value: option.valor,
    })),
  }));

  return {
    id: row.id,
    name: row.nombre,
    instructions: row.instrucciones,
    questions,
  };
}

// Crea una sesión de evaluación para el alumno autenticado y devuelve su id.
export async function startEvaluationSession(
  evaluationId: number,
): Promise<number | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("sesiones_evaluacion")
    .insert({
      alumno_id: user.id,
      evaluacion_id: evaluationId,
      estado: "en_progreso",
    })
    .select("id")
    .single<{ id: number }>();

  if (error || !data) return null;
  return data.id;
}

// Guarda las respuestas del alumno y cierra la sesión con su puntaje.
export async function finishEvaluationSession(
  sessionId: number,
  answers: Answer[],
  questions: EvaluationQuestion[],
): Promise<void> {
  const rows = answers.flatMap((answer) =>
    answer.optionIds.map((optionId) => ({
      sesion_id: sessionId,
      pregunta_id: answer.questionId,
      opcion_id: optionId,
      valor_registrado: valueForOption(questions, answer.questionId, optionId),
    })),
  );

  if (rows.length > 0) {
    await supabase.from("respuestas_evaluacion").insert(rows);
  }

  const puntajeTotal = rows.reduce((sum, row) => sum + row.valor_registrado, 0);

  await supabase
    .from("sesiones_evaluacion")
    .update({
      estado: "completada",
      puntaje_total: puntajeTotal,
      puntaje_maximo: questions.length,
      completada_en: new Date().toISOString(),
    })
    .eq("id", sessionId);
}

// El valor de cada opción se copia al responder para conservar el puntaje histórico
// aunque después se editen las opciones en el catálogo.
function valueForOption(
  questions: EvaluationQuestion[],
  questionId: number,
  optionId: number,
): number {
  const question = questions.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item.id === optionId);
  return option?.value ?? 0;
}
