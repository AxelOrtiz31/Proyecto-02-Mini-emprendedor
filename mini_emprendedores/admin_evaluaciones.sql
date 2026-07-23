-- ============================================================
-- Módulo Admin — edición de evaluaciones (preguntas y respuestas).
-- Correr en el SQL Editor de Supabase. Es idempotente.
-- Requiere que admin_module.sql se haya corrido antes (usa es_personal()).
-- Por si acaso, aquí se vuelve a crear la función (CREATE OR REPLACE).
--
-- Da al personal (maestro/admin) permiso para leer y editar el contenido de
-- las evaluaciones: preguntas y opciones de respuesta. Solo AGREGA políticas;
-- no toca las del alumno ni habilita/deshabilita RLS.
--
-- Nota: borrar una pregunta u opción que un alumno ya respondió lo impide la
-- llave foránea de respuestas_evaluacion (error 23503). En ese caso, la app
-- sugiere desactivar la pregunta en lugar de borrarla.
-- ============================================================

CREATE OR REPLACE FUNCTION public.es_personal()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfiles
    WHERE id = auth.uid()
      AND rol IN ('maestro', 'admin')
      AND activo = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.es_personal() TO authenticated;

DO $$
DECLARE
  v_tabla text;
  v_accion text;
  v_nombre text;
BEGIN
  -- Para cada tabla se crean las políticas de personal que falten.
  FOREACH v_tabla IN ARRAY ARRAY['evaluaciones', 'preguntas_evaluacion', 'opciones_respuesta']
  LOOP
    FOREACH v_accion IN ARRAY ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']
    LOOP
      -- evaluaciones no necesita INSERT/DELETE desde el panel (solo editar).
      IF v_tabla = 'evaluaciones' AND v_accion IN ('INSERT', 'DELETE') THEN
        CONTINUE;
      END IF;

      v_nombre := 'El personal administra ' || v_tabla || ' (' || v_accion || ')';

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = v_tabla
          AND policyname = v_nombre
      ) THEN
        IF v_accion = 'INSERT' THEN
          EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.es_personal())',
            v_nombre, v_tabla
          );
        ELSIF v_accion = 'UPDATE' THEN
          EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.es_personal()) WITH CHECK (public.es_personal())',
            v_nombre, v_tabla
          );
        ELSE
          -- SELECT y DELETE solo usan USING.
          EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR %s TO authenticated USING (public.es_personal())',
            v_nombre, v_tabla, v_accion
          );
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END $$;
