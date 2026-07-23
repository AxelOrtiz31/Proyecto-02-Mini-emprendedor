-- ============================================================
-- Módulo Admin (Panel de la maestra) — acceso del personal vía RLS.
-- Correr en el SQL Editor de Supabase. Es idempotente: se puede correr
-- varias veces sin duplicar nada.
--
-- Qué hace:
--   A. Crea la función es_personal(): true si el usuario autenticado es
--      maestro o admin. Es SECURITY DEFINER para poder leer perfiles sin
--      que RLS entre en recursión con las políticas de la propia tabla.
--   B. Agrega políticas RLS para que el personal (maestro/admin) pueda LEER
--      el progreso de todo el grupo y ADMINISTRAR a los alumnos (editar,
--      dar de baja lógica y reiniciar progreso). Solo AGREGA acceso: nunca
--      quita ni cambia las políticas del alumno, y no habilita/deshabilita
--      RLS en ninguna tabla.
--   C. Bloque para promover una cuenta ya registrada a rol 'maestro'.
--
-- Nota: las políticas son aditivas (se combinan con OR). Si en alguna tabla
-- RLS estuviera deshabilitado, la política queda inerte y el panel igual
-- funciona porque la lectura directa ya devuelve todas las filas.
-- ============================================================

-- ============================================================
-- A. Función de rol del personal
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

-- ============================================================
-- B. Políticas RLS del personal
-- ============================================================

DO $$
BEGIN
  -- --------- perfiles ---------
  -- El personal lee todos los perfiles (lista de alumnos y sus datos).
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'perfiles'
      AND policyname = 'El personal ve todos los perfiles'
  ) THEN
    CREATE POLICY "El personal ve todos los perfiles"
      ON public.perfiles FOR SELECT
      TO authenticated
      USING (public.es_personal());
  END IF;

  -- El personal actualiza cualquier perfil (editar datos, activo, rol,
  -- y reiniciar curso_completado_en).
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'perfiles'
      AND policyname = 'El personal actualiza los perfiles'
  ) THEN
    CREATE POLICY "El personal actualiza los perfiles"
      ON public.perfiles FOR UPDATE
      TO authenticated
      USING (public.es_personal())
      WITH CHECK (public.es_personal());
  END IF;

  -- --------- progreso_lecciones ---------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'progreso_lecciones'
      AND policyname = 'El personal ve todo el progreso'
  ) THEN
    CREATE POLICY "El personal ve todo el progreso"
      ON public.progreso_lecciones FOR SELECT
      TO authenticated
      USING (public.es_personal());
  END IF;

  -- Reiniciar el progreso de un alumno.
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'progreso_lecciones'
      AND policyname = 'El personal reinicia el progreso'
  ) THEN
    CREATE POLICY "El personal reinicia el progreso"
      ON public.progreso_lecciones FOR DELETE
      TO authenticated
      USING (public.es_personal());
  END IF;

  -- --------- insignias_alumno ---------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'insignias_alumno'
      AND policyname = 'El personal ve todas las insignias'
  ) THEN
    CREATE POLICY "El personal ve todas las insignias"
      ON public.insignias_alumno FOR SELECT
      TO authenticated
      USING (public.es_personal());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'insignias_alumno'
      AND policyname = 'El personal borra insignias'
  ) THEN
    CREATE POLICY "El personal borra insignias"
      ON public.insignias_alumno FOR DELETE
      TO authenticated
      USING (public.es_personal());
  END IF;

  -- --------- sesiones_evaluacion ---------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'sesiones_evaluacion'
      AND policyname = 'El personal ve todas las sesiones'
  ) THEN
    CREATE POLICY "El personal ve todas las sesiones"
      ON public.sesiones_evaluacion FOR SELECT
      TO authenticated
      USING (public.es_personal());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'sesiones_evaluacion'
      AND policyname = 'El personal borra sesiones'
  ) THEN
    CREATE POLICY "El personal borra sesiones"
      ON public.sesiones_evaluacion FOR DELETE
      TO authenticated
      USING (public.es_personal());
  END IF;

  -- --------- respuestas_evaluacion ---------
  -- (Hijas de sesiones_evaluacion; se borran primero al reiniciar.)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'respuestas_evaluacion'
      AND policyname = 'El personal ve todas las respuestas'
  ) THEN
    CREATE POLICY "El personal ve todas las respuestas"
      ON public.respuestas_evaluacion FOR SELECT
      TO authenticated
      USING (public.es_personal());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'respuestas_evaluacion'
      AND policyname = 'El personal borra respuestas'
  ) THEN
    CREATE POLICY "El personal borra respuestas"
      ON public.respuestas_evaluacion FOR DELETE
      TO authenticated
      USING (public.es_personal());
  END IF;

  -- --------- mi_negocio ---------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'mi_negocio'
      AND policyname = 'El personal ve todos los negocios'
  ) THEN
    CREATE POLICY "El personal ve todos los negocios"
      ON public.mi_negocio FOR SELECT
      TO authenticated
      USING (public.es_personal());
  END IF;
END $$;

-- ============================================================
-- C. Promover una cuenta a maestro
-- 1) La maestra se registra normal en la app (crea su usuario en auth).
-- 2) Cambia el correo de abajo y corre este bloque.
-- (No se pueden crear usuarios de auth desde SQL; por eso primero el registro.)
-- ============================================================

DO $$
DECLARE
  v_correo text := 'maestra@ejemplo.com';  -- <-- CAMBIA ESTE CORREO
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = v_correo;

  IF v_uid IS NULL THEN
    RAISE NOTICE 'No existe un usuario con el correo %. Regístralo primero en la app.', v_correo;
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM public.perfiles WHERE id = v_uid) THEN
    UPDATE public.perfiles
      SET rol = 'maestro', activo = true
      WHERE id = v_uid;
    RAISE NOTICE 'Perfil de % promovido a maestro.', v_correo;
  ELSE
    INSERT INTO public.perfiles (id, nombre, apellido, rol, activo)
      VALUES (v_uid, 'Maestra', '', 'maestro', true);
    RAISE NOTICE 'Perfil creado y promovido a maestro para %.', v_correo;
  END IF;
END $$;
