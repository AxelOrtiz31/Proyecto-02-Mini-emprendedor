-- Semilla del Examen final (tipo = 'final').
-- Correr en el SQL Editor de Supabase. Es idempotente: se puede correr varias veces.
-- A diferencia del onboarding del Módulo 1, aquí sí hay una opción correcta por pregunta
-- (columna es_correcta), para que el examen final funcione como repaso real del curso.

DO $$
DECLARE
  v_eval_id integer;
  v_preg_id integer;
BEGIN
  -- No duplicar si ya existe un examen final.
  IF EXISTS (SELECT 1 FROM public.evaluaciones WHERE tipo = 'final') THEN
    RETURN;
  END IF;

  INSERT INTO public.evaluaciones (nombre, descripcion, tipo, modulo_id, instrucciones)
  VALUES (
    'Examen final · ¡Ya eres un mini emprendedor!',
    'Repaso final de todo lo aprendido a lo largo del curso.',
    'final',
    NULL,
    'Elige la respuesta correcta en cada pregunta. ¡Demuestra todo lo que aprendiste!'
  )
  RETURNING id INTO v_eval_id;

  -- Pregunta 1 · Módulo 1 (¿Qué es emprender?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es un emprendedor?', 1, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Alguien que crea algo nuevo para resolver un problema', '🚀', 1, 1, true),
    (v_preg_id, 'Alguien que solo espera a que le regalen dinero', '😴', 1, 2, false),
    (v_preg_id, 'Alguien que nunca comete errores', '🙅', 1, 3, false);

  -- Pregunta 2 · Módulo 2 (Mi idea de negocio)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Cómo se le llama a un problema o necesidad que tu negocio puede resolver?', 2, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Una oportunidad', '💡', 1, 1, true),
    (v_preg_id, 'Una casualidad', '🎲', 1, 2, false),
    (v_preg_id, 'Un obstáculo imposible', '🚧', 1, 3, false);

  -- Pregunta 3 · Módulo 3 (¿Quién es mi cliente?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Quién es tu cliente ideal?', 3, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'La persona a la que más le sirve tu producto', '🎯', 1, 1, true),
    (v_preg_id, 'Cualquier persona, sin importar sus gustos', '🤷', 1, 2, false),
    (v_preg_id, 'Solo tus familiares', '👪', 1, 3, false);

  -- Pregunta 4 · Módulo 4 (¡Le doy color a mi negocio!)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Para qué sirve el nombre y el logo de tu negocio?', 4, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Para que la gente reconozca y recuerde tu marca', '🎨', 1, 1, true),
    (v_preg_id, 'No sirven para nada', '❌', 1, 2, false),
    (v_preg_id, 'Solo para que se vea bonito, sin más propósito', '✨', 1, 3, false);

  -- Pregunta 5 · Módulo 5 (¿Cuánto vale mi esfuerzo?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es la ganancia?', 5, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'El dinero que queda después de pagar los costos', '💰', 1, 1, true),
    (v_preg_id, 'El precio total de venta', '🏷️', 1, 2, false),
    (v_preg_id, 'El dinero que gastaste en materiales', '📦', 1, 3, false);

  -- Pregunta 6 · Módulo 6 (¡A vender!)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es lo más importante al presentar tu producto a un cliente?', 6, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Explicar con confianza cómo ayuda a resolver su necesidad', '🎤', 1, 1, true),
    (v_preg_id, 'Hablar lo más rápido posible', '⏩', 1, 2, false),
    (v_preg_id, 'Evitar que el cliente haga preguntas', '🙊', 1, 3, false);
END $$;
