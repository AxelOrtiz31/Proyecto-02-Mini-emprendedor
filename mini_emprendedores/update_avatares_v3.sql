-- Migración de avatares a la versión 3 (estilo chibi).
-- Correr en el SQL Editor de Supabase. Es idempotente: se puede correr varias veces.
--
-- Qué hace:
--   1. Renombra en su MISMO id cada avatar viejo al personaje nuevo de su misma
--      habilidad (Leo→Balam, etc.). Así los perfiles.avatar_id ya elegidos no se
--      rompen: el alumno conserva su avatar, solo cambia el arte y el nombre.
--   2. Inserta los que falten (cubre una base fresca donde nunca existieron los
--      viejos). En una base ya migrada este paso no hace nada.
--
-- Requisito: los SVG nuevos deben existir en public/avatars/ (ya en el repo).

DO $$
DECLARE
  v_old text;
  v_new text;
  v_url text;
  v_skill text;
  v_map text[][] := ARRAY[
    ['Leo',       'Balam',  '/avatars/liderazgo-balam.svg',       'liderazgo'],
    ['Valentina', 'Ixchel', '/avatars/liderazgo-ixchel.svg',      'liderazgo'],
    ['Diego',     'Kinich', '/avatars/liderazgo-kinich.svg',      'liderazgo'],
    ['Frida',     'Itzel',  '/avatars/creatividad-itzel.svg',     'creatividad'],
    ['Mateo',     'Dzul',   '/avatars/creatividad-dzul.svg',      'creatividad'],
    ['Regina',    'Sasil',  '/avatars/creatividad-sasil.svg',     'creatividad'],
    ['Santiago',  'Yaax',   '/avatars/trabajo-equipo-yaax.svg',   'trabajo_equipo'],
    ['Camila',    'Nicté',  '/avatars/trabajo-equipo-nicte.svg',  'trabajo_equipo'],
    ['Emiliano',  'Canek',  '/avatars/trabajo-equipo-canek.svg',  'trabajo_equipo'],
    ['Sofía',     'Kaan',   '/avatars/resolucion-kaan.svg',       'resolucion_problemas'],
    ['Sebastián', 'Nahil',  '/avatars/resolucion-nahil.svg',      'resolucion_problemas'],
    ['Ximena',    'Xook',   '/avatars/resolucion-xook.svg',       'resolucion_problemas']
  ];
  i integer;
BEGIN
  FOR i IN 1 .. array_length(v_map, 1) LOOP
    v_old := v_map[i][1];
    v_new := v_map[i][2];
    v_url := v_map[i][3];
    v_skill := v_map[i][4];

    -- 1. Migrar la fila vieja conservando su id (y por lo tanto las FK).
    UPDATE public.avatares
    SET nombre = v_new, url_imagen = v_url, habilidad = v_skill, activo = true
    WHERE nombre = v_old;

    -- 2. Si no existía (ni vieja ni nueva), insertarla.
    IF NOT EXISTS (SELECT 1 FROM public.avatares WHERE nombre = v_new) THEN
      INSERT INTO public.avatares (nombre, url_imagen, habilidad, activo)
      VALUES (v_new, v_url, v_skill, true);
    END IF;
  END LOOP;
END $$;

-- Verificación rápida: debe devolver 12 filas, 3 por habilidad, con los nombres nuevos.
SELECT habilidad, count(*) AS avatares, string_agg(nombre, ', ' ORDER BY id) AS nombres
FROM public.avatares
WHERE habilidad IS NOT NULL AND activo = true
GROUP BY habilidad
ORDER BY habilidad;
