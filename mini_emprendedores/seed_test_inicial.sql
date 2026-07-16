-- Semilla del Test inicial de habilidad (tipo = 'inicial') + avatares por habilidad.
-- Correr en el SQL Editor de Supabase. Es idempotente: se puede correr varias veces.
--
-- Qué hace:
--   A. Agrega la columna avatares.habilidad y perfiles.habilidad_dominante, y
--      asegura que el CHECK de evaluaciones.tipo acepte 'inicial'.
--   B. Asegura las políticas RLS necesarias (alta y update del propio perfil,
--      lectura de avatares).
--   C. Inserta los 12 avatares (3 por habilidad) apuntando a los SVG de public/avatars/.
--   D. Inserta la evaluación tipo 'inicial' con 5 preguntas de opción múltiple.
--
-- Convención de opciones_respuesta.valor (mapeo opción → habilidad):
--   1 = liderazgo | 2 = creatividad | 3 = trabajo_equipo | 4 = resolucion_problemas
-- Ninguna opción tiene es_correcta = true: el test no califica, clasifica.

-- ============================================================
-- A. Columnas nuevas
-- ============================================================

ALTER TABLE public.avatares
  ADD COLUMN IF NOT EXISTS habilidad text
  CHECK (habilidad IN ('liderazgo', 'creatividad', 'trabajo_equipo', 'resolucion_problemas'));

ALTER TABLE public.perfiles
  ADD COLUMN IF NOT EXISTS habilidad_dominante text
  CHECK (habilidad_dominante IN ('liderazgo', 'creatividad', 'trabajo_equipo', 'resolucion_problemas'));

-- El CHECK de evaluaciones.tipo debe aceptar 'inicial'. Si la tabla se creó con
-- un CHECK que solo permitía 'final' y 'modulo', el INSERT del bloque D falla,
-- el bloque completo se revierte y el test nunca aparece en la app.
DO $$
DECLARE
  v_constraint text;
BEGIN
  -- Quitar cualquier CHECK sobre "tipo" que no contemple 'inicial'.
  FOR v_constraint IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'evaluaciones'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%tipo%'
      AND pg_get_constraintdef(con.oid) NOT ILIKE '%inicial%'
  LOOP
    EXECUTE format('ALTER TABLE public.evaluaciones DROP CONSTRAINT %I', v_constraint);
  END LOOP;

  -- Crear el CHECK correcto si no quedó ninguno que acepte 'inicial'.
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'evaluaciones'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%tipo%'
      AND pg_get_constraintdef(con.oid) ILIKE '%inicial%'
  ) THEN
    ALTER TABLE public.evaluaciones
      ADD CONSTRAINT evaluaciones_tipo_check
      CHECK (tipo IN ('inicial', 'final', 'modulo'));
  END IF;
END $$;

-- ============================================================
-- B. Políticas RLS
-- (Si RLS no está habilitado en la tabla, la política queda creada
--  y no afecta nada; si está habilitado, permite el flujo nuevo.)
-- ============================================================

DO $$
BEGIN
  -- El alumno puede leer su propia fila de perfiles. Sin esta política, RLS
  -- oculta la fila: las lecturas vuelven vacías (el gate manda siempre al test)
  -- y update().select() no puede confirmar lo que guardó, aunque sí lo escriba.
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'perfiles'
      AND policyname = 'Los alumnos ven su propio perfil'
  ) THEN
    CREATE POLICY "Los alumnos ven su propio perfil"
      ON public.perfiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- El alumno puede actualizar su propia fila de perfiles
  -- (necesario para guardar habilidad_dominante y avatar_id).
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'perfiles'
      AND policyname = 'Los alumnos actualizan su propio perfil'
  ) THEN
    CREATE POLICY "Los alumnos actualizan su propio perfil"
      ON public.perfiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  -- El alumno puede crear su propia fila de perfiles. El registro solo guarda
  -- los datos en auth.users, así que si no hay un trigger que copie el perfil,
  -- la app lo crea al guardar el resultado del test inicial.
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'perfiles'
      AND policyname = 'Los alumnos crean su propio perfil'
  ) THEN
    CREATE POLICY "Los alumnos crean su propio perfil"
      ON public.perfiles FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Cualquier usuario autenticado puede leer el catálogo de avatares.
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'avatares'
      AND policyname = 'Los avatares son visibles para usuarios autenticados'
  ) THEN
    CREATE POLICY "Los avatares son visibles para usuarios autenticados"
      ON public.avatares FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- ============================================================
-- C. Los 12 avatares (3 por habilidad, estilo chibi v3)
-- Si la base ya tenía los avatares viejos (Leo, Valentina...),
-- correr update_avatares_v3.sql: migra las filas en su mismo id.
-- ============================================================

INSERT INTO public.avatares (nombre, url_imagen, habilidad, activo) VALUES
  ('Balam',  '/avatars/liderazgo-balam.svg',      'liderazgo',            true),
  ('Ixchel', '/avatars/liderazgo-ixchel.svg',     'liderazgo',            true),
  ('Kinich', '/avatars/liderazgo-kinich.svg',     'liderazgo',            true),
  ('Itzel',  '/avatars/creatividad-itzel.svg',    'creatividad',          true),
  ('Dzul',   '/avatars/creatividad-dzul.svg',     'creatividad',          true),
  ('Sasil',  '/avatars/creatividad-sasil.svg',    'creatividad',          true),
  ('Yaax',   '/avatars/trabajo-equipo-yaax.svg',  'trabajo_equipo',       true),
  ('Nicté',  '/avatars/trabajo-equipo-nicte.svg', 'trabajo_equipo',       true),
  ('Canek',  '/avatars/trabajo-equipo-canek.svg', 'trabajo_equipo',       true),
  ('Kaan',   '/avatars/resolucion-kaan.svg',      'resolucion_problemas', true),
  ('Nahil',  '/avatars/resolucion-nahil.svg',     'resolucion_problemas', true),
  ('Xook',   '/avatars/resolucion-xook.svg',      'resolucion_problemas', true)
ON CONFLICT (nombre) DO UPDATE
  SET url_imagen = EXCLUDED.url_imagen,
      habilidad  = EXCLUDED.habilidad,
      activo     = true;

-- ============================================================
-- D. Evaluación tipo 'inicial' (5 preguntas, 4 opciones cada una)
-- ============================================================

DO $$
DECLARE
  v_eval_id integer;
  v_preg_id integer;
BEGIN
  -- No duplicar si esta versión del test ya fue creada.
  IF EXISTS (
    SELECT 1 FROM public.evaluaciones
    WHERE tipo = 'inicial'
      AND nombre = 'Test inicial · Descubre tu superpoder emprendedor'
  ) THEN
    RETURN;
  END IF;

  -- Desactivar cualquier test inicial anterior.
  UPDATE public.evaluaciones
  SET activa = false, actualizada_en = now()
  WHERE tipo = 'inicial' AND activa = true;

  INSERT INTO public.evaluaciones (nombre, descripcion, tipo, modulo_id, instrucciones)
  VALUES (
    'Test inicial · Descubre tu superpoder emprendedor',
    'Test de 5 preguntas que identifica la habilidad dominante del alumno: liderazgo, creatividad, trabajo en equipo o resolución de problemas.',
    'inicial',
    NULL,
    'No hay respuestas buenas ni malas. Elige la opción que más se parezca a ti.'
  )
  RETURNING id INTO v_eval_id;

  -- Pregunta 1
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, 'Tu equipo va a vender limonada en la kermés. ¿Qué haces primero?', 1, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Organizo al equipo y reparto las tareas', '📣', 1, 1, false),
    (v_preg_id, 'Invento un nombre divertido y un cartel llamativo', '🎨', 2, 2, false),
    (v_preg_id, 'Pregunto a todos qué quieren hacer y los apoyo', '🤝', 3, 3, false),
    (v_preg_id, 'Hago cuentas de cuántos limones necesitamos', '🧮', 4, 4, false);

  -- Pregunta 2
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, 'En el recreo, el juego que más te gusta se descompone. ¿Qué haces?', 2, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Lo reviso con calma para descubrir qué le falló', '🔍', 4, 1, false),
    (v_preg_id, 'Invento un juego nuevo con lo que tenemos', '✨', 2, 2, false),
    (v_preg_id, 'Junto a mis amigos y propongo un nuevo plan', '🧭', 1, 3, false),
    (v_preg_id, 'Busco que nadie se quede fuera y juguemos todos', '🤗', 3, 4, false);

  -- Pregunta 3
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, 'La maestra deja un proyecto en equipo. ¿Qué parte te gusta más?', 3, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Escuchar las ideas de todos y ponernos de acuerdo', '👂', 3, 1, false),
    (v_preg_id, 'Resolver las partes difíciles paso a paso', '🧩', 4, 2, false),
    (v_preg_id, 'Guiar al equipo para terminar a tiempo', '⏰', 1, 3, false),
    (v_preg_id, 'Decorarlo y darle un toque único', '🖍️', 2, 4, false);

  -- Pregunta 4
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, 'Tu puesto de galletas no vendió nada hoy. ¿Qué harías?', 4, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Se me ocurre una promoción divertida para mañana', '🎉', 2, 1, false),
    (v_preg_id, 'Animo a mi equipo a no rendirse y seguir intentando', '💪', 1, 2, false),
    (v_preg_id, 'Investigo qué pasó y cambio el plan', '📊', 4, 3, false),
    (v_preg_id, 'Pido consejos a mi familia y a mis amigos', '💬', 3, 4, false);

  -- Pregunta 5
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué frase se parece más a ti?', 5, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden, es_correcta) VALUES
    (v_preg_id, 'Me encanta resolver acertijos y retos', '🕵️', 4, 1, false),
    (v_preg_id, 'Todo sale mejor cuando lo hacemos juntos', '🫶', 3, 2, false),
    (v_preg_id, 'Siempre tengo ideas nuevas en la cabeza', '💡', 2, 3, false),
    (v_preg_id, 'Me gusta guiar a los demás hacia una meta', '🚀', 1, 4, false);
END $$;
