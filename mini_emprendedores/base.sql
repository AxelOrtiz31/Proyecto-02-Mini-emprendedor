-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.avatares (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying NOT NULL UNIQUE,
  url_imagen text NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  CONSTRAINT avatares_pkey PRIMARY KEY (id)
);
CREATE TABLE public.modulos (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  numero smallint NOT NULL UNIQUE,
  titulo character varying NOT NULL,
  orden smallint NOT NULL DEFAULT 1,
  activo boolean NOT NULL DEFAULT true,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT modulos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.unidades (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  modulo_id integer NOT NULL,
  numero smallint NOT NULL,
  titulo character varying NOT NULL,
  subtitulo character varying,
  orden smallint NOT NULL DEFAULT 1,
  activa boolean NOT NULL DEFAULT true,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT unidades_pkey PRIMARY KEY (id),
  CONSTRAINT unidades_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.modulos(id)
);
CREATE TABLE public.lecciones (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  unidad_id integer NOT NULL,
  titulo character varying NOT NULL,
  descripcion text,
  tipo character varying NOT NULL DEFAULT 'lesson'::character varying CHECK (tipo::text = ANY (ARRAY['lesson'::character varying, 'practice'::character varying, 'story'::character varying, 'challenge'::character varying, 'bonus'::character varying, 'boss'::character varying]::text[])),
  orden smallint NOT NULL DEFAULT 1,
  xp_recompensa smallint NOT NULL DEFAULT 23 CHECK (xp_recompensa >= 0),
  activa boolean NOT NULL DEFAULT true,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lecciones_pkey PRIMARY KEY (id),
  CONSTRAINT lecciones_unidad_id_fkey FOREIGN KEY (unidad_id) REFERENCES public.unidades(id)
);
CREATE TABLE public.perfiles (
  id uuid NOT NULL,
  nombre character varying NOT NULL,
  apellido character varying NOT NULL,
  edad smallint CHECK (edad >= 5 AND edad <= 18),
  fecha_nacimiento date,
  avatar_id integer,
  ultima_sesion timestamp with time zone,
  rol character varying NOT NULL DEFAULT 'alumno'::character varying CHECK (rol::text = ANY (ARRAY['alumno'::character varying, 'tutor'::character varying, 'maestro'::character varying, 'admin'::character varying]::text[])),
  alias character varying,
  grado_escolar character varying,
  fecha_registro timestamp with time zone NOT NULL DEFAULT now(),
  activo boolean NOT NULL DEFAULT true,
  CONSTRAINT perfiles_pkey PRIMARY KEY (id),
  CONSTRAINT perfiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT perfiles_avatar_id_fkey FOREIGN KEY (avatar_id) REFERENCES public.avatares(id)
);
CREATE TABLE public.tutor_alumno (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  tutor_id uuid NOT NULL,
  alumno_id uuid NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  fecha_alta timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tutor_alumno_pkey PRIMARY KEY (id),
  CONSTRAINT tutor_alumno_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.perfiles(id),
  CONSTRAINT tutor_alumno_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.perfiles(id)
);
CREATE TABLE public.evaluaciones (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying NOT NULL,
  descripcion text,
  tipo character varying NOT NULL CHECK (tipo::text = ANY (ARRAY['inicial'::character varying, 'final'::character varying, 'modulo'::character varying]::text[])),
  modulo_id integer,
  instrucciones text,
  activa boolean NOT NULL DEFAULT true,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT evaluaciones_pkey PRIMARY KEY (id),
  CONSTRAINT evaluaciones_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.modulos(id)
);
CREATE TABLE public.preguntas_evaluacion (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  evaluacion_id integer NOT NULL,
  texto text NOT NULL,
  orden smallint NOT NULL DEFAULT 1,
  activa boolean NOT NULL DEFAULT true,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  multiple boolean NOT NULL DEFAULT false,
  CONSTRAINT preguntas_evaluacion_pkey PRIMARY KEY (id),
  CONSTRAINT preguntas_evaluacion_evaluacion_id_fkey FOREIGN KEY (evaluacion_id) REFERENCES public.evaluaciones(id)
);
CREATE TABLE public.opciones_respuesta (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  pregunta_id integer NOT NULL,
  etiqueta character varying NOT NULL,
  valor smallint NOT NULL CHECK (valor > 0),
  emoji character varying,
  orden smallint NOT NULL DEFAULT 1,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT opciones_respuesta_pkey PRIMARY KEY (id),
  CONSTRAINT opciones_respuesta_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas_evaluacion(id)
);
CREATE TABLE public.sesiones_evaluacion (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  alumno_id uuid NOT NULL,
  evaluacion_id integer NOT NULL,
  puntaje_total smallint,
  puntaje_maximo smallint,
  completada_en timestamp with time zone,
  estado character varying NOT NULL DEFAULT 'en_progreso'::character varying CHECK (estado::text = ANY (ARRAY['en_progreso'::character varying, 'completada'::character varying, 'abandonada'::character varying]::text[])),
  iniciada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sesiones_evaluacion_pkey PRIMARY KEY (id),
  CONSTRAINT sesiones_evaluacion_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.perfiles(id),
  CONSTRAINT sesiones_evaluacion_evaluacion_id_fkey FOREIGN KEY (evaluacion_id) REFERENCES public.evaluaciones(id)
);
CREATE TABLE public.respuestas_evaluacion (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  sesion_id integer NOT NULL,
  pregunta_id integer NOT NULL,
  opcion_id integer NOT NULL,
  valor_registrado smallint NOT NULL,
  respondida_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT respuestas_evaluacion_pkey PRIMARY KEY (id),
  CONSTRAINT respuestas_evaluacion_sesion_id_fkey FOREIGN KEY (sesion_id) REFERENCES public.sesiones_evaluacion(id),
  CONSTRAINT respuestas_evaluacion_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas_evaluacion(id),
  CONSTRAINT respuestas_evaluacion_opcion_id_fkey FOREIGN KEY (opcion_id) REFERENCES public.opciones_respuesta(id)
);
CREATE TABLE public.progreso_lecciones (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  alumno_id uuid NOT NULL,
  leccion_id integer,
  completada_en timestamp with time zone,
  estado character varying NOT NULL DEFAULT 'completada'::character varying CHECK (estado::text = ANY (ARRAY['en_progreso'::character varying, 'completada'::character varying]::text[])),
  xp_obtenido smallint NOT NULL DEFAULT 0 CHECK (xp_obtenido >= 0),
  estrellas smallint NOT NULL DEFAULT 0 CHECK (estrellas >= 0 AND estrellas <= 3),
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  codigo_leccion character varying,
  CONSTRAINT progreso_lecciones_pkey PRIMARY KEY (id),
  CONSTRAINT progreso_lecciones_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.perfiles(id),
  CONSTRAINT progreso_lecciones_leccion_id_fkey FOREIGN KEY (leccion_id) REFERENCES public.lecciones(id)
);


-- 1) La política que faltaba: modulos tiene RLS pero sin lectura.
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura de modulos" ON public.modulos;
CREATE POLICY "Lectura de modulos" ON public.modulos
  FOR SELECT TO authenticated USING (true);

-- 2) Verifica que la semilla SÍ tiene datos (esto corre como postgres y salta RLS):
SELECT
  (SELECT count(*) FROM public.modulos)                          AS modulos,
  (SELECT count(*) FROM public.evaluaciones WHERE tipo='modulo') AS evals_modulo,
  (SELECT count(*) FROM public.preguntas_evaluacion)             AS preguntas,
  (SELECT count(*) FROM public.opciones_respuesta)               AS opciones;


  -- Semilla del módulo de preguntas (onboarding) del Módulo 1.
-- Correr en el SQL Editor de Supabase. Es idempotente: se puede correr varias veces.
-- Plantilla para los módulos 2-6: copia el bloque DO y cambia el numero de módulo y los textos.

-- a) Soporte de preguntas de selección múltiple (no rompe nada: default false).
ALTER TABLE public.preguntas_evaluacion
  ADD COLUMN IF NOT EXISTS multiple boolean NOT NULL DEFAULT false;

-- b) Catálogo de módulos (numero 1-6). El numero es la llave que enlaza con Section.number del frontend.
INSERT INTO public.modulos (numero, titulo, orden) VALUES
  (1, '¿Qué es emprender?', 1),
  (2, 'Mi idea de negocio', 2),
  (3, '¿Quién es mi cliente?', 3),
  (4, '¡Le doy color a mi negocio!', 4),
  (5, '¿Cuánto vale mi esfuerzo?', 5),
  (6, '¡A vender!', 6)
ON CONFLICT (numero) DO NOTHING;

-- c) Evaluación del Módulo 1 con sus preguntas y opciones.
DO $$
DECLARE
  v_modulo_id integer;
  v_eval_id   integer;
  v_preg_id   integer;
BEGIN
  SELECT id INTO v_modulo_id FROM public.modulos WHERE numero = 1;

  -- No duplicar si ya se sembró la evaluación de este módulo.
  IF EXISTS (
    SELECT 1 FROM public.evaluaciones
    WHERE tipo = 'modulo' AND modulo_id = v_modulo_id
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.evaluaciones (nombre, descripcion, tipo, modulo_id, instrucciones)
  VALUES (
    'Módulo 1 · ¿Qué es emprender?',
    'Preguntas de inicio para conocerte y personalizar tu camino emprendedor.',
    'modulo',
    v_modulo_id,
    'Elige la opción que más va contigo. ¡No hay respuestas incorrectas!'
  )
  RETURNING id INTO v_eval_id;

  -- Pregunta 1 (selección única).
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Qué hace principalmente un emprendedor?', 1, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden) VALUES
    (v_preg_id, 'Crea productos o servicios que ayudan a otros', '🚀', 1, 1),
    (v_preg_id, 'Solo trabaja para otras empresas', '🏢', 1, 2),
    (v_preg_id, 'Espera que alguien le dé una idea', '😴', 1, 3);

  -- Pregunta 2 (selección múltiple).
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Por qué quieres aprender a emprender?', 2, true)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden) VALUES
    (v_preg_id, 'Solo por diversión', '🎉', 1, 1),
    (v_preg_id, 'Impulsar mi carrera', '💼', 1, 2),
    (v_preg_id, 'Usar mi tiempo productivamente', '🧠', 1, 3),
    (v_preg_id, 'Conectar con otras personas', '🧑‍🤝‍🧑', 1, 4),
    (v_preg_id, 'Generar ingresos extra', '💰', 1, 5),
    (v_preg_id, 'Apoyar mis estudios', '📚', 1, 6),
    (v_preg_id, 'Otra razón', '🟣', 1, 7);

  -- Pregunta 3 (selección única).
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Cuánto sabes sobre emprender?', 3, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden) VALUES
    (v_preg_id, 'Soy nuevo en esto', '🌱', 1, 1),
    (v_preg_id, 'Conozco algunos conceptos', '📈', 1, 2),
    (v_preg_id, 'Tengo una idea en mente', '🛠️', 1, 3),
    (v_preg_id, 'Ya tengo un pequeño negocio', '🏆', 1, 4);

  -- Pregunta 4 (selección única).
  INSERT INTO public.preguntas_evaluacion (evaluacion_id, texto, orden, multiple)
  VALUES (v_eval_id, '¿Cuánto tiempo puedes dedicar al día?', 4, false)
  RETURNING id INTO v_preg_id;
  INSERT INTO public.opciones_respuesta (pregunta_id, etiqueta, emoji, valor, orden) VALUES
    (v_preg_id, '5 minutos · Casual', '⏱️', 1, 1),
    (v_preg_id, '10 minutos · Regular', '🔥', 1, 2),
    (v_preg_id, '15 minutos · Serio', '🚀', 1, 3),
    (v_preg_id, '20 minutos · Intenso', '🏅', 1, 4);
END $$;

-- d) Políticas RLS (recomendado; hoy las tablas solo tienen GRANT abierto).
--    Contenido de solo lectura para autenticados; sesiones y respuestas acotadas al alumno dueño.
ALTER TABLE public.evaluaciones          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preguntas_evaluacion  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opciones_respuesta    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones_evaluacion   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas_evaluacion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura de evaluaciones" ON public.evaluaciones;
CREATE POLICY "Lectura de evaluaciones" ON public.evaluaciones
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Lectura de preguntas" ON public.preguntas_evaluacion;
CREATE POLICY "Lectura de preguntas" ON public.preguntas_evaluacion
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Lectura de opciones" ON public.opciones_respuesta;
CREATE POLICY "Lectura de opciones" ON public.opciones_respuesta
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Alumno ve sus sesiones" ON public.sesiones_evaluacion;
CREATE POLICY "Alumno ve sus sesiones" ON public.sesiones_evaluacion
  FOR SELECT TO authenticated USING (auth.uid() = alumno_id);

DROP POLICY IF EXISTS "Alumno crea sus sesiones" ON public.sesiones_evaluacion;
CREATE POLICY "Alumno crea sus sesiones" ON public.sesiones_evaluacion
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = alumno_id);

DROP POLICY IF EXISTS "Alumno actualiza sus sesiones" ON public.sesiones_evaluacion;
CREATE POLICY "Alumno actualiza sus sesiones" ON public.sesiones_evaluacion
  FOR UPDATE TO authenticated USING (auth.uid() = alumno_id) WITH CHECK (auth.uid() = alumno_id);

DROP POLICY IF EXISTS "Alumno ve sus respuestas" ON public.respuestas_evaluacion;
CREATE POLICY "Alumno ve sus respuestas" ON public.respuestas_evaluacion
  FOR SELECT TO authenticated USING (
    sesion_id IN (SELECT id FROM public.sesiones_evaluacion WHERE alumno_id = auth.uid())
  );

DROP POLICY IF EXISTS "Alumno inserta sus respuestas" ON public.respuestas_evaluacion;
CREATE POLICY "Alumno inserta sus respuestas" ON public.respuestas_evaluacion
  FOR INSERT TO authenticated WITH CHECK (
    sesion_id IN (SELECT id FROM public.sesiones_evaluacion WHERE alumno_id = auth.uid())
  );


-- 1) Repone el trigger que crea el perfil al registrarse (para NUEVOS registros)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, apellido, edad)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Alumno'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    NULLIF(NEW.raw_user_meta_data->>'edad', '')::smallint
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) Crea los perfiles que faltan para los usuarios que YA existen (esto quita el 409 ahora)
INSERT INTO public.perfiles (id, nombre, apellido, edad)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'nombre', 'Alumno'),
  COALESCE(u.raw_user_meta_data->>'apellido', ''),
  NULLIF(u.raw_user_meta_data->>'edad', '')::smallint
FROM auth.users u
LEFT JOIN public.perfiles p ON p.id = u.id
WHERE p.id IS NULL;

ALTER TABLE public.preguntas_evaluacion ADD COLUMN IF NOT EXISTS nivel integer;
ALTER TABLE public.preguntas_evaluacion ADD COLUMN IF NOT EXISTS nivel integer;