-- Semilla del Examen final (tipo = 'final'), versión basada en el documento
-- "PREGUNTAS POR NIVELES EMPRENDEKIDS IA" (12 preguntas: 2 por cada sección del curso).
-- Correr en el SQL Editor de Supabase. Es idempotente: se puede correr varias veces.
-- Si ya existe un examen final anterior, se desactiva (activa = false) en lugar de
-- borrarse, para conservar las sesiones y respuestas históricas de los alumnos.

DO $$
DECLARE
  v_eval_id integer;
  v_preg_id integer;
BEGIN
  -- No duplicar si esta versión del examen ya fue creada.
  IF EXISTS (
    SELECT 1 FROM public.evaluaciones
    WHERE tipo = 'final'
      AND nombre = 'Examen final · ¡Demuestra lo que aprendiste!'
  ) THEN
    RETURN;
  END IF;

  -- Desactivar cualquier examen final anterior.
  UPDATE public.evaluaciones
  SET activa = false, actualizada_en = now()
  WHERE tipo = 'final' AND activa = true;

  INSERT INTO public.evaluaciones (nombre, descripcion, tipo, modulo_id, instrucciones)
  VALUES (
    'Examen final · ¡Demuestra lo que aprendiste!',
    'Repaso final del curso con preguntas de las 6 secciones, tomadas de EmprendeKids IA.',
    'final',
    NULL,
    'Elige la respuesta correcta en cada pregunta. ¡Demuestra todo lo que aprendiste!'
  )
  RETURNING id INTO v_eval_id;

  -- Pregunta 1 · Sección 1 (¿Qué es emprender?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué significa emprender?', 1, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Copiar las ideas de otra persona', '📋', 1, 1, false),
    (v_preg_id, 'Crear una idea para resolver una necesidad', '💡', 1, 2, true),
    (v_preg_id, 'Comprar muchas cosas', '🛍️', 1, 3, false),
    (v_preg_id, 'Jugar videojuegos todo el día', '🎮', 1, 4, false);

  -- Pregunta 2 · Sección 1 (¿Qué es emprender?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué debe hacer un emprendedor cuando algo no sale bien?', 2, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Aprender del error e intentarlo otra vez', '🌱', 1, 1, true),
    (v_preg_id, 'Rendirse', '😞', 1, 2, false),
    (v_preg_id, 'Enojarse con todos', '😠', 1, 3, false),
    (v_preg_id, 'Culpar a los demás', '👉', 1, 4, false);

  -- Pregunta 3 · Sección 2 (Mi idea de negocio)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es una idea de negocio?', 3, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Un juego de computadora', '🕹️', 1, 1, false),
    (v_preg_id, 'Un dibujo sin propósito', '🖍️', 1, 2, false),
    (v_preg_id, 'Una forma de resolver una necesidad con un producto o servicio', '💡', 1, 3, true),
    (v_preg_id, 'Una tarea escolar', '📚', 1, 4, false);

  -- Pregunta 4 · Sección 2 (Mi idea de negocio)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué tienen en común un producto y un servicio?', 4, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Ambos buscan ayudar al cliente', '🤝', 1, 1, true),
    (v_preg_id, 'Ambos son juguetes', '🧸', 1, 2, false),
    (v_preg_id, 'Ambos son gratuitos', '🎁', 1, 3, false),
    (v_preg_id, 'Ambos se venden en internet', '💻', 1, 4, false);

  -- Pregunta 5 · Sección 3 (¿Quién es mi cliente?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Quién es un cliente?', 5, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'El dueño del negocio', '🏪', 1, 1, false),
    (v_preg_id, 'La persona que compra o utiliza un producto o servicio', '🛒', 1, 2, true),
    (v_preg_id, 'El maestro', '🧑‍🏫', 1, 3, false),
    (v_preg_id, 'El repartidor', '🛵', 1, 4, false);

  -- Pregunta 6 · Sección 3 (¿Quién es mi cliente?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es el mercado meta?', 6, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'El grupo de personas al que está dirigido un producto o servicio', '🎯', 1, 1, true),
    (v_preg_id, 'Todas las personas del mundo', '🌍', 1, 2, false),
    (v_preg_id, 'Los empleados del negocio', '🧑‍💼', 1, 3, false),
    (v_preg_id, 'Solo los vecinos', '🏘️', 1, 4, false);

  -- Pregunta 7 · Sección 4 (¡Le doy color a mi negocio!)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es un logotipo?', 7, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Una factura', '🧾', 1, 1, false),
    (v_preg_id, 'Un precio', '🏷️', 1, 2, false),
    (v_preg_id, 'Una receta', '🍳', 1, 3, false),
    (v_preg_id, 'Un dibujo o símbolo que representa un negocio', '🎨', 1, 4, true);

  -- Pregunta 8 · Sección 4 (¡Le doy color a mi negocio!)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué elementos forman la identidad de un negocio?', 8, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Nombre, logotipo, colores y eslogan', '✨', 1, 1, true),
    (v_preg_id, 'Solo el precio', '🏷️', 1, 2, false),
    (v_preg_id, 'Solo el producto', '📦', 1, 3, false),
    (v_preg_id, 'Solo el uniforme', '👕', 1, 4, false);

  -- Pregunta 9 · Sección 5 (¿Cuánto vale mi esfuerzo?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es la ganancia?', 9, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'El dinero que gastas en materiales', '📦', 1, 1, false),
    (v_preg_id, 'El dinero que queda después de recuperar el costo', '💰', 1, 2, true),
    (v_preg_id, 'El precio total de venta', '🏷️', 1, 3, false),
    (v_preg_id, 'El nombre del negocio', '🏪', 1, 4, false);

  -- Pregunta 10 · Sección 5 (¿Cuánto vale mi esfuerzo?)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, 'Si hacer una pulsera cuesta $20 y la vendes en $35, ¿cuánto ganas?', 10, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, '$15', '💵', 1, 1, true),
    (v_preg_id, '$20', '🪙', 1, 2, false),
    (v_preg_id, '$35', '💳', 1, 3, false),
    (v_preg_id, '$55', '💰', 1, 4, false);

  -- Pregunta 11 · Sección 6 (¡A vender!)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué es un pitch de ventas?', 11, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Una receta de cocina', '🍰', 1, 1, false),
    (v_preg_id, 'Una presentación breve para explicar un negocio', '🎤', 1, 2, true),
    (v_preg_id, 'Un dibujo', '🖍️', 1, 3, false),
    (v_preg_id, 'Una lista de compras', '📝', 1, 4, false);

  -- Pregunta 12 · Sección 6 (¡A vender!)
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Cuál representa mejor a un emprendedor?', 12, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Una persona que crea soluciones para ayudar a los demás', '🚀', 1, 1, true),
    (v_preg_id, 'Una persona que nunca aprende', '🙅', 1, 2, false),
    (v_preg_id, 'Una persona que copia todo', '📋', 1, 3, false),
    (v_preg_id, 'Una persona que no escucha a nadie', '🙉', 1, 4, false);
END $$;
