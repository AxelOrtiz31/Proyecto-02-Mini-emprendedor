-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.avatares (
  nombre character varying NOT NULL UNIQUE,
  url_imagen text NOT NULL,
  id integer NOT NULL DEFAULT nextval('avatares_id_seq'::regclass),
  activo boolean NOT NULL DEFAULT true,
  CONSTRAINT avatares_pkey PRIMARY KEY (id)
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
  alias character varying DEFAULT NULL::character varying,
  grado_escolar character varying DEFAULT NULL::character varying,
  fecha_registro timestamp with time zone NOT NULL DEFAULT now(),
  activo boolean NOT NULL DEFAULT true,
  CONSTRAINT perfiles_pkey PRIMARY KEY (id),
  CONSTRAINT perfiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT perfiles_avatar_id_fkey FOREIGN KEY (avatar_id) REFERENCES public.avatares(id)
);
CREATE TABLE public.tutor_alumno (
  tutor_id uuid NOT NULL,
  alumno_id uuid NOT NULL,
  id integer NOT NULL DEFAULT nextval('tutor_alumno_id_seq'::regclass),
  activo boolean NOT NULL DEFAULT true,
  fecha_alta timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tutor_alumno_pkey PRIMARY KEY (id),
  CONSTRAINT tutor_alumno_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.perfiles(id),
  CONSTRAINT tutor_alumno_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.perfiles(id)
);
CREATE TABLE public.evaluaciones (
  nombre character varying NOT NULL,
  descripcion text,
  tipo character varying NOT NULL CHECK (tipo::text = ANY (ARRAY['inicial'::character varying, 'final'::character varying, 'modulo'::character varying]::text[])),
  modulo_id integer,
  instrucciones text,
  id integer NOT NULL DEFAULT nextval('evaluaciones_id_seq'::regclass),
  activa boolean NOT NULL DEFAULT true,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT evaluaciones_pkey PRIMARY KEY (id),
  CONSTRAINT evaluaciones_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.modulos(id)
);
CREATE TABLE public.preguntas_evaluacion (
  evaluacion_id integer NOT NULL,
  texto text NOT NULL,
  id integer NOT NULL DEFAULT nextval('preguntas_evaluacion_id_seq'::regclass),
  orden smallint NOT NULL DEFAULT 1,
  activa boolean NOT NULL DEFAULT true,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT preguntas_evaluacion_pkey PRIMARY KEY (id),
  CONSTRAINT preguntas_evaluacion_evaluacion_id_fkey FOREIGN KEY (evaluacion_id) REFERENCES public.evaluaciones(id)
);
CREATE TABLE public.opciones_respuesta (
  pregunta_id integer NOT NULL,
  etiqueta character varying NOT NULL,
  valor smallint NOT NULL CHECK (valor > 0),
  id integer NOT NULL DEFAULT nextval('opciones_respuesta_id_seq'::regclass),
  emoji character varying DEFAULT NULL::character varying,
  orden smallint NOT NULL DEFAULT 1,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT opciones_respuesta_pkey PRIMARY KEY (id),
  CONSTRAINT opciones_respuesta_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas_evaluacion(id)
);
CREATE TABLE public.sesiones_evaluacion (
  alumno_id uuid NOT NULL,
  evaluacion_id integer NOT NULL,
  puntaje_total smallint,
  puntaje_maximo smallint,
  completada_en timestamp with time zone,
  id integer NOT NULL DEFAULT nextval('sesiones_evaluacion_id_seq'::regclass),
  estado character varying NOT NULL DEFAULT 'en_progreso'::character varying CHECK (estado::text = ANY (ARRAY['en_progreso'::character varying, 'completada'::character varying, 'abandonada'::character varying]::text[])),
  iniciada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sesiones_evaluacion_pkey PRIMARY KEY (id),
  CONSTRAINT sesiones_evaluacion_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.perfiles(id),
  CONSTRAINT sesiones_evaluacion_evaluacion_id_fkey FOREIGN KEY (evaluacion_id) REFERENCES public.evaluaciones(id)
);
CREATE TABLE public.respuestas_evaluacion (
  sesion_id integer NOT NULL,
  pregunta_id integer NOT NULL,
  opcion_id integer NOT NULL,
  valor_registrado smallint NOT NULL,
  id integer NOT NULL DEFAULT nextval('respuestas_evaluacion_id_seq'::regclass),
  respondida_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT respuestas_evaluacion_pkey PRIMARY KEY (id),
  CONSTRAINT respuestas_evaluacion_sesion_id_fkey FOREIGN KEY (sesion_id) REFERENCES public.sesiones_evaluacion(id),
  CONSTRAINT respuestas_evaluacion_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas_evaluacion(id),
  CONSTRAINT respuestas_evaluacion_opcion_id_fkey FOREIGN KEY (opcion_id) REFERENCES public.opciones_respuesta(id)
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
  tipo character varying NOT NULL DEFAULT 'lesson'::character varying CHECK (tipo::text = ANY (ARRAY['lesson'::text, 'practice'::text, 'story'::text, 'challenge'::text, 'bonus'::text, 'boss'::text])),
  orden smallint NOT NULL DEFAULT 1,
  xp_recompensa smallint NOT NULL DEFAULT 23 CHECK (xp_recompensa >= 0),
  activa boolean NOT NULL DEFAULT true,
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lecciones_pkey PRIMARY KEY (id),
  CONSTRAINT lecciones_unidad_id_fkey FOREIGN KEY (unidad_id) REFERENCES public.unidades(id)
);
CREATE TABLE public.progreso_lecciones (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  alumno_id uuid NOT NULL,
  completada_en timestamp with time zone,
  leccion_id integer,
  estado character varying NOT NULL DEFAULT 'completada'::character varying CHECK (estado::text = ANY (ARRAY['en_progreso'::text, 'completada'::text])),
  xp_obtenido smallint NOT NULL DEFAULT 0 CHECK (xp_obtenido >= 0),
  estrellas smallint NOT NULL DEFAULT 0 CHECK (estrellas >= 0 AND estrellas <= 3),
  creada_en timestamp with time zone NOT NULL DEFAULT now(),
  codigo_leccion character varying,
  CONSTRAINT progreso_lecciones_pkey PRIMARY KEY (id),
  CONSTRAINT progreso_lecciones_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.perfiles(id),
  CONSTRAINT progreso_lecciones_leccion_id_fkey FOREIGN KEY (leccion_id) REFERENCES public.lecciones(id)
);