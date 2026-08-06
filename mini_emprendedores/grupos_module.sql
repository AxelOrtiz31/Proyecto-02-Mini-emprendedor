-- ============================================================================
-- Módulo de grupos: escuela -> grado -> grupo (salón) -> alumno.
--
-- Modelo de un solo maestro/admin: no hay relación maestro<->alumno, el
-- personal (maestro o admin) ve y administra a todos los alumnos. La única
-- definición de "personal" es es_personal(), la que ya usaba el panel.
--
-- Correr los dos bloques en orden en el SQL Editor de Supabase.
-- Todo es idempotente: se puede correr varias veces sin duplicar nada.
--
-- Nota: base.sql está desincronizado de la base real (sus primeras 766 líneas
-- son T-SQL de otro proyecto y no corren en Postgres). Las tablas y columnas
-- que sí usa el código -- insignias_alumno, perfiles.curso_completado_en,
-- progreso_lecciones.tiempo_segundos e .intentos -- existen solo en Supabase.
-- Este script no las toca.
-- ============================================================================


-- ============================================================================
-- BLOQUE A — Revierte el script multi-maestro y restaura el panel admin.
-- ============================================================================

-- A.1 Fuera las tablas del modelo anterior (CASCADE se lleva sus políticas).
DROP TABLE IF EXISTS public.grupo_alumnos CASCADE;
DROP TABLE IF EXISTS public.grupos CASCADE;

-- A.2 Fuera cualquier política que haya quedado apuntando a las funciones
--     viejas. Se busca por el texto de la política en vez de por su nombre,
--     que es lo único confiable si el script anterior se corrió a medias.
DO $$
DECLARE v_pol record;
BEGIN
  FOR v_pol IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (qual       ILIKE '%es_mi_alumno%' OR with_check ILIKE '%es_mi_alumno%'
        OR qual       ILIKE '%es_mi_grupo%'  OR with_check ILIKE '%es_mi_grupo%')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', v_pol.policyname, v_pol.tablename);
    RAISE NOTICE 'Eliminada política vieja % en %', v_pol.policyname, v_pol.tablename;
  END LOOP;
END $$;

-- A.3 Fuera las funciones del modelo multi-maestro.
DROP FUNCTION IF EXISTS public.es_mi_alumno(uuid);
DROP FUNCTION IF EXISTS public.es_mi_grupo(integer);
DROP FUNCTION IF EXISTS public.buscar_grupo_por_codigo(text);
DROP FUNCTION IF EXISTS public.es_admin();

-- A.4 es_personal(): maestro o admin, igual que isStaffRole() en lib/admin.ts.
CREATE OR REPLACE FUNCTION public.es_personal()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND rol IN ('maestro', 'admin') AND activo = true
  );
$$;
GRANT EXECUTE ON FUNCTION public.es_personal() TO authenticated;

-- A.5 Restaura las políticas del personal que el script anterior borró.
--     Se recrean con nombre determinista para que correr esto dos veces no
--     deje copias con nombres distintos otorgando el mismo acceso.
DO $$
DECLARE
  v_specs text[][] := ARRAY[
    ['perfiles',              'SELECT,UPDATE'],
    ['progreso_lecciones',    'SELECT,DELETE'],
    ['insignias_alumno',      'SELECT,DELETE'],
    ['sesiones_evaluacion',   'SELECT,DELETE'],
    ['respuestas_evaluacion', 'SELECT,DELETE'],
    ['mi_negocio',            'SELECT']
  ];
  v_tabla  text;
  v_accion text;
  v_nombre text;
  i int;
BEGIN
  FOR i IN 1 .. array_length(v_specs, 1) LOOP
    v_tabla := v_specs[i][1];

    FOREACH v_accion IN ARRAY string_to_array(v_specs[i][2], ',') LOOP
      v_nombre := 'El personal administra ' || v_tabla || ' (' || v_accion || ')';
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_nombre, v_tabla);

      IF v_accion = 'UPDATE' THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated '
          'USING (public.es_personal()) WITH CHECK (public.es_personal())',
          v_nombre, v_tabla);
      ELSE
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR %s TO authenticated USING (public.es_personal())',
          v_nombre, v_tabla, v_accion);
      END IF;
    END LOOP;
  END LOOP;
END $$;


-- ============================================================================
-- BLOQUE B — Escuelas, grupos, alta de perfil y RLS.
-- ============================================================================

-- B.0 Fuera los triggers de perfiles de corridas anteriores, ANTES de tocar
--     datos. trg_proteger_campos_perfil revierte grupo_id cuando quien edita
--     no es personal, y en el SQL Editor no hay sesión (auth.uid() es NULL):
--     dejarlo puesto haría que los UPDATE de más abajo no surtan efecto.
--     Los dos se vuelven a crear en B.5 y B.7, dentro de esta misma corrida.
DROP TRIGGER IF EXISTS trg_proteger_campos_perfil ON public.perfiles;
DROP TRIGGER IF EXISTS trg_sync_grado_escolar ON public.perfiles;

-- B.1 Catálogo de escuelas.
CREATE TABLE IF NOT EXISTS public.escuelas (
  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre    varchar(160) NOT NULL,
  clave     varchar(40),                       -- CCT u otra clave, opcional
  activa    boolean NOT NULL DEFAULT true,
  creada_en timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT escuelas_nombre_key UNIQUE (nombre)
);

-- B.2 Grupos (salones). grado = "3°", nombre = "A".
CREATE TABLE IF NOT EXISTS public.grupos (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  escuela_id    integer NOT NULL REFERENCES public.escuelas(id) ON DELETE CASCADE,
  grado         varchar(20) NOT NULL,
  nombre        varchar(20) NOT NULL,
  turno         varchar(20),
  ciclo_escolar varchar(20),
  activo        boolean NOT NULL DEFAULT true,
  creado_en     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT grupos_escuela_grado_nombre_key UNIQUE (escuela_id, grado, nombre)
);
CREATE INDEX IF NOT EXISTS idx_grupos_escuela ON public.grupos (escuela_id);

-- B.3 El alumno pertenece a un grupo. Una columna, no una tabla puente.
--     La columna y la llave foránea se agregan por separado a propósito: si la
--     columna ya existe, ADD COLUMN IF NOT EXISTS se salta TAMBIÉN el
--     REFERENCES, y sin esa llave el join de PostgREST (perfiles -> grupos)
--     falla con "Could not find a relationship ... in the schema cache".
ALTER TABLE public.perfiles ADD COLUMN IF NOT EXISTS grupo_id integer;

DO $$
BEGIN
  -- Una corrida anterior pudo dejar ids que ya no existen (el bloque A borra
  -- y recrea grupos). Se limpian o la llave foránea no se puede crear.
  UPDATE public.perfiles p
     SET grupo_id = NULL
   WHERE p.grupo_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM public.grupos g WHERE g.id = p.grupo_id);

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.perfiles'::regclass
      AND contype = 'f'
      AND conname = 'perfiles_grupo_id_fkey'
  ) THEN
    ALTER TABLE public.perfiles
      ADD CONSTRAINT perfiles_grupo_id_fkey
      FOREIGN KEY (grupo_id) REFERENCES public.grupos(id) ON DELETE SET NULL;
    RAISE NOTICE 'Creada la llave foránea perfiles.grupo_id -> grupos.id';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_perfiles_grupo ON public.perfiles (grupo_id);

-- B.4 Grupo "Sin asignar" (inactivo: no aparece en el registro, sí en el
--     panel) y reubicación de los alumnos que ya existen.
DO $$
DECLARE v_escuela integer; v_grupo integer;
BEGIN
  INSERT INTO public.escuelas (nombre, activa) VALUES ('Sin asignar', false)
    ON CONFLICT (nombre) DO NOTHING;
  SELECT id INTO v_escuela FROM public.escuelas WHERE nombre = 'Sin asignar';

  INSERT INTO public.grupos (escuela_id, grado, nombre, activo)
    VALUES (v_escuela, 'Sin asignar', '—', false)
    ON CONFLICT (escuela_id, grado, nombre) DO NOTHING;
  SELECT id INTO v_grupo FROM public.grupos
    WHERE escuela_id = v_escuela AND grado = 'Sin asignar' AND nombre = '—';

  UPDATE public.perfiles SET grupo_id = v_grupo
    WHERE rol = 'alumno' AND grupo_id IS NULL;
END $$;

-- B.5 grado_escolar sigue al grupo, para no romper el detalle del alumno ni
--     el PDF, que leen esa columna. El grupo "Sin asignar" no pisa el grado
--     que la maestra ya hubiera capturado a mano.
CREATE OR REPLACE FUNCTION public.sync_grado_escolar()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_grado text;
BEGIN
  IF NEW.grupo_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT g.grado INTO v_grado FROM public.grupos g WHERE g.id = NEW.grupo_id;

  IF v_grado IS NOT NULL AND v_grado <> 'Sin asignar' THEN
    NEW.grado_escolar := v_grado;
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_sync_grado_escolar ON public.perfiles;
CREATE TRIGGER trg_sync_grado_escolar
  BEFORE INSERT OR UPDATE OF grupo_id ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_grado_escolar();

-- B.6 Alta del perfil en el signUp, con el grupo elegido en el registro.
--     Antes la fila nacía tarde desde el cliente (lib/onboarding.ts) y solo
--     con nombre y apellido: edad, rol y grupo se perdían.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_meta_grupo integer;
  v_grupo_id   integer;
  v_edad       smallint;
BEGIN
  -- El metadata lo controla el cliente: se castea con red y se valida contra
  -- la tabla, para que un id basura no tumbe el registro.
  BEGIN
    v_meta_grupo := NULLIF(NEW.raw_user_meta_data->>'grupo_id', '')::integer;
  EXCEPTION WHEN others THEN
    v_meta_grupo := NULL;
  END;

  SELECT g.id INTO v_grupo_id
  FROM public.grupos g
  WHERE g.id = v_meta_grupo AND g.activo = true;

  IF v_grupo_id IS NULL THEN
    SELECT g.id INTO v_grupo_id
    FROM public.grupos g
    JOIN public.escuelas e ON e.id = g.escuela_id
    WHERE e.nombre = 'Sin asignar' AND g.grado = 'Sin asignar';
  END IF;

  v_edad := NULLIF(regexp_replace(
    COALESCE(NEW.raw_user_meta_data->>'edad', ''), '\D', '', 'g'), '')::smallint;

  INSERT INTO public.perfiles (id, nombre, apellido, edad, grupo_id, rol, activo)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'nombre', ''), 'Alumno'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    v_edad,
    v_grupo_id,
    'alumno',   -- NUNCA se lee el rol del metadata: cualquiera mandaría 'admin'.
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B.7 Un alumno no puede ascenderse solo. La política de seed_test_inicial.sql
--     lo deja actualizar su propia fila, y ahí va incluido el rol.
CREATE OR REPLACE FUNCTION public.proteger_campos_perfil()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Sin sesión (SQL Editor, service_role, migraciones) el cambio pasa tal
  -- cual: el candado es solo contra el alumno que edita su propia fila desde
  -- la app. El rol anon no puede llegar aquí porque ninguna política de RLS
  -- le concede UPDATE sobre perfiles.
  IF auth.uid() IS NULL OR public.es_personal() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.rol := 'alumno';
    NEW.activo := true;
  ELSE
    NEW.rol      := OLD.rol;
    NEW.activo   := OLD.activo;
    NEW.grupo_id := OLD.grupo_id;
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_proteger_campos_perfil ON public.perfiles;
CREATE TRIGGER trg_proteger_campos_perfil
  BEFORE INSERT OR UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.proteger_campos_perfil();

-- B.8 RLS. La lectura es pública porque el alumno llena el formulario de
--     registro antes de tener sesión. Solo se exponen nombres de escuelas y
--     salones, ningún dato personal.
ALTER TABLE public.escuelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cualquiera lee escuelas activas" ON public.escuelas;
CREATE POLICY "Cualquiera lee escuelas activas" ON public.escuelas
  FOR SELECT TO anon, authenticated USING (activa = true);

DROP POLICY IF EXISTS "Cualquiera lee grupos activos" ON public.grupos;
CREATE POLICY "Cualquiera lee grupos activos" ON public.grupos
  FOR SELECT TO anon, authenticated USING (activo = true);

DROP POLICY IF EXISTS "El personal administra escuelas" ON public.escuelas;
CREATE POLICY "El personal administra escuelas" ON public.escuelas
  FOR ALL TO authenticated USING (public.es_personal()) WITH CHECK (public.es_personal());

DROP POLICY IF EXISTS "El personal administra grupos" ON public.grupos;
CREATE POLICY "El personal administra grupos" ON public.grupos
  FOR ALL TO authenticated USING (public.es_personal()) WITH CHECK (public.es_personal());

-- B.9 Escuela y grupos de ejemplo, para poder probar el registro de inmediato.
--     Bórralos desde el panel cuando cargues los reales.
DO $$
DECLARE v_escuela integer;
BEGIN
  INSERT INTO public.escuelas (nombre) VALUES ('Primaria Benito Juárez')
    ON CONFLICT (nombre) DO NOTHING;
  SELECT id INTO v_escuela FROM public.escuelas WHERE nombre = 'Primaria Benito Juárez';

  INSERT INTO public.grupos (escuela_id, grado, nombre, turno, ciclo_escolar) VALUES
    (v_escuela, '4°', 'A', 'Matutino', '2026-2027'),
    (v_escuela, '5°', 'A', 'Matutino', '2026-2027'),
    (v_escuela, '5°', 'B', 'Matutino', '2026-2027'),
    (v_escuela, '6°', 'A', 'Matutino', '2026-2027')
  ON CONFLICT (escuela_id, grado, nombre) DO NOTHING;
END $$;


-- B.10 PostgREST guarda el esquema en caché. Sin esto, el panel sigue diciendo
--      "no se pudo encontrar una relación entre 'perfiles' y 'grupos'" aunque
--      la llave foránea ya exista. Siempre al final, después de todo el DDL.
NOTIFY pgrst, 'reload schema';


-- ============================================================================
-- Verificación 1: las llaves foráneas de las que dependen los joins del panel.
-- Deben salir exactamente 2 filas.
-- ============================================================================
SELECT conname AS llave, conrelid::regclass AS tabla, confrelid::regclass AS apunta_a
FROM pg_constraint
WHERE contype = 'f'
  AND conrelid IN ('public.perfiles'::regclass, 'public.grupos'::regclass)
  AND confrelid IN ('public.grupos'::regclass, 'public.escuelas'::regclass);

-- ============================================================================
-- Verificación 2: deben aparecer las políticas "El personal administra ..." de
-- las 6 tablas de datos de alumno, más las 4 de escuelas y grupos. No debe
-- quedar ninguna que mencione es_mi_alumno o es_mi_grupo.
-- ============================================================================
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('perfiles', 'progreso_lecciones', 'insignias_alumno',
                    'sesiones_evaluacion', 'respuestas_evaluacion', 'mi_negocio',
                    'escuelas', 'grupos')
ORDER BY tablename, cmd;
