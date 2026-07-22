import { supabase } from "@/lib/supabase";

export interface EvaluationOption {
  id: number;
  label: string;
  emoji: string | null;
  value: number;
  isCorrect: boolean;
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

interface OptionRow {
  id: number;
  etiqueta: string;
  emoji: string | null;
  valor: number;
  orden: number;
  es_correcta: boolean;
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

function mapEvaluation(row: EvaluationRow): Evaluation {
  const questions = [...row.preguntas_evaluacion]
    .sort(byOrden)
    .map((question) => ({
      id: question.id,
      text: question.texto,
      multiple: question.multiple,
      options: [...question.opciones_respuesta]
        .sort(byOrden)
        .map((option) => ({
          id: option.id,
          label: option.etiqueta,
          emoji: option.emoji,
          value: option.valor,
          isCorrect: option.es_correcta,
        })),
    }));

  return {
    id: row.id,
    name: row.nombre,
    instructions: row.instrucciones,
    questions,
  };
}

export async function fetchLessonEvaluation(
  lessonCode: string,
  moduleNumber: number,
): Promise<Evaluation | null> {
  const { data: lessonData, error: lessonError } = await supabase
    .from("evaluaciones")
    .select(
      `id, nombre, instrucciones,
       preguntas_evaluacion (
         id,
         texto,
         multiple,
         orden,
         opciones_respuesta (
           id,
           etiqueta,
           emoji,
           valor,
           orden,
           es_correcta
         )
       )`,
    )
    .eq("tipo", "modulo")
    .eq("codigo_leccion", lessonCode)
    .eq("activa", true)
    .limit(1)
    .returns<EvaluationRow[]>();

  if (!lessonError && lessonData && lessonData.length > 0) {
    return mapEvaluation(lessonData[0]);
  }

  return fetchModuleEvaluation(moduleNumber);
}

export async function fetchModuleEvaluation(
  moduleNumber: number,
): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      `id, nombre, instrucciones,
       modulos!inner ( numero ),
       preguntas_evaluacion (
         id,
         texto,
         multiple,
         orden,
         opciones_respuesta (
           id,
           etiqueta,
           emoji,
           valor,
           orden,
           es_correcta
         )
       )`,
    )
    .eq("tipo", "modulo")
    .eq("modulos.numero", moduleNumber)
    .eq("activa", true)
    .is("codigo_leccion", null)
    .limit(1)
    .returns<EvaluationRow[]>();

  if (error || !data || data.length === 0) {
    console.error("Error cargando evaluación:", error?.message);
    return null;
  }

  return mapEvaluation(data[0]);
}

export async function fetchFinalEvaluation(): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      `id, nombre, instrucciones,
       preguntas_evaluacion (
         id,
         texto,
         multiple,
         orden,
         opciones_respuesta (
           id,
           etiqueta,
           emoji,
           valor,
           orden,
           es_correcta
         )
       )`,
    )
    .eq("tipo", "final")
    .eq("activa", true)
    // Si quedara más de un examen final activo, siempre gana el más reciente.
    .order("id", { ascending: false })
    .limit(1)
    .returns<EvaluationRow[]>();

  if (error || !data || data.length === 0) {
    console.error("Error cargando evaluación final:", error?.message);
    return null;
  }

  return mapEvaluation(data[0]);
}

export async function fetchInitialEvaluation(): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from("evaluaciones")
    .select(
      `id, nombre, instrucciones,
       preguntas_evaluacion (
         id,
         texto,
         multiple,
         orden,
         opciones_respuesta (
           id,
           etiqueta,
           emoji,
           valor,
           orden,
           es_correcta
         )
       )`,
    )
    .eq("tipo", "inicial")
    .eq("activa", true)
    .limit(1)
    .returns<EvaluationRow[]>();

  if (error) {
    console.error("Error cargando test inicial:", error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.error(
      "No hay ninguna evaluación activa con tipo 'inicial'. Ejecuta seed_test_inicial.sql en el SQL Editor de Supabase.",
    );
    return null;
  }

  return mapEvaluation(data[0]);
}

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

  if (error || !data) {
    console.error("Error creando sesión:", error?.message);
    return null;
  }

  return data.id;
}

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
    const { error: insertError } = await supabase
      .from("respuestas_evaluacion")
      .insert(rows);

    if (insertError) {
      console.error("Error guardando respuestas:", insertError.message);
    }
  }

  const scoredQuestions = questions.filter(hasCorrectOptions);

  const puntajeTotal = answers.reduce((sum, answer) => {
    const question = questions.find((item) => item.id === answer.questionId);

    if (!question) return sum;
    if (!hasCorrectOptions(question)) return sum;

    return sum + (isAnswerCorrect(question, answer.optionIds) ? 1 : 0);
  }, 0);

  const { error: updateError } = await supabase
    .from("sesiones_evaluacion")
    .update({
      estado: "completada",
      puntaje_total: puntajeTotal,
      puntaje_maximo: scoredQuestions.length,
      completada_en: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (updateError) {
    console.error("Error cerrando sesión:", updateError.message);
  }
}

function valueForOption(
  questions: EvaluationQuestion[],
  questionId: number,
  optionId: number,
): number {
  const question = questions.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item.id === optionId);

  return option?.value ?? 0;
}

export function hasCorrectOptions(question: EvaluationQuestion): boolean {
  return question.options.some((option) => option.isCorrect);
}

// Una evaluación se aprueba solo si TODAS las preguntas que tienen respuesta
// correcta configurada están bien contestadas. Si ninguna pregunta tiene
// respuesta correcta en la base de datos, la evaluación está mal configurada:
// se reprueba en lugar de aprobar en silencio (un `every` sobre una lista
// vacía devuelve true, y eso dejaba pasar cualquier respuesta).
export function isEvaluationPassed(
  questions: EvaluationQuestion[],
  answers: Record<number, number[]>,
): boolean {
  const scoredQuestions = questions.filter(hasCorrectOptions);

  if (scoredQuestions.length === 0) return false;

  return scoredQuestions.every((question) =>
    isAnswerCorrect(question, answers[question.id] ?? []),
  );
}

export function isAnswerCorrect(
  question: EvaluationQuestion,
  selectedOptionIds: number[],
): boolean {
  const correctIds = question.options
    .filter((option) => option.isCorrect)
    .map((option) => option.id)
    .sort((a, b) => a - b);

  const selectedIds = [...selectedOptionIds].sort((a, b) => a - b);

  if (correctIds.length === 0) {
    return selectedIds.length > 0;
  }

  if (correctIds.length !== selectedIds.length) {
    return false;
  }

  return correctIds.every((id, index) => id === selectedIds[index]);
}