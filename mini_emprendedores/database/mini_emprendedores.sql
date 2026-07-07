/* ============================================================
   MINI EMPRENDEDORES
   Base de datos MVP para Supabase
   ------------------------------------------------------------
   Esta versión guarda:
   - Usuarios (alumnos y maestros)
   - Superpoder elegido por el alumno
   - Puntos acumulados
   - Rachas de uso
   - Relación maestro-alumno
   - Progreso por módulo y nivel
   - Medallas obtenidas
   ============================================================ */


/* ============================================================
   ENUM: TIPOS DE USUARIO
   ------------------------------------------------------------
   Define los roles permitidos dentro de la aplicación.
   ============================================================ */
CREATE TYPE user_role AS ENUM (
    'alumno',
    'maestro'
);


/* ============================================================
   ENUM: SUPERPODERES
   ------------------------------------------------------------
   Cada alumno selecciona un superpoder al registrarse.
   Más adelante puede mostrarse en su perfil.
   ============================================================ */
CREATE TYPE superpower AS ENUM (
    'liderazgo',
    'creatividad',
    'iniciativa',
    'esfuerzo',
    'responsabilidad',
    'adaptabilidad',
    'resolucion',
    'comunicacion'
);


/* ============================================================
   TABLA: PROFILES
   ------------------------------------------------------------
   Información adicional del usuario.

   Supabase ya guarda:
   - Email
   - Contraseña
   - ID de autenticación

   Esta tabla complementa esos datos con información
   específica de la aplicación.
   ============================================================ */
CREATE TABLE profiles (

    -- ID del usuario autenticado en Supabase Auth
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Datos personales
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    -- Se guarda también para facilitar consultas
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Alumno o maestro
    rol user_role NOT NULL DEFAULT 'alumno',

    -- Superpoder elegido
    superpoder superpower NOT NULL,

    -- Puntos totales obtenidos en toda la aplicación
    total_points INTEGER NOT NULL DEFAULT 0,

    -- Racha actual de días consecutivos usando la app
    current_streak INTEGER NOT NULL DEFAULT 0,

    -- Mejor racha histórica
    longest_streak INTEGER NOT NULL DEFAULT 0,

    -- Fecha de la última actividad del usuario
    last_activity_date DATE,

    -- Fecha de creación del perfil
    created_at TIMESTAMP DEFAULT NOW()
);


/* ============================================================
   TABLA: TEACHER_STUDENTS
   ------------------------------------------------------------
   Relaciona maestros con alumnos.

   Ejemplo:
   Maestro Juan
      ├─ Ana
      ├─ Pedro
      └─ Sofía
   ============================================================ */
CREATE TABLE teacher_students (

    -- ID interno de la relación
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Maestro responsable
    teacher_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    -- Alumno asignado
    student_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    -- Evita duplicar la misma relación
    UNIQUE (teacher_id, student_id)
);


/* ============================================================
   TABLA: USER_PROGRESS
   ------------------------------------------------------------
   Guarda el avance del alumno.

   Estructura del curso:

   6 módulos
   3 niveles por módulo
   5 preguntas por nivel

   Aquí NO se guardan preguntas ni respuestas,
   únicamente si el nivel fue completado.
   ============================================================ */
CREATE TABLE user_progress (

    -- ID del registro
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Alumno que avanza
    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    -- Número de módulo (1 a 6)
    module_number INTEGER NOT NULL
        CHECK (module_number BETWEEN 1 AND 6),

    -- Número de nivel (1 a 3)
    level_number INTEGER NOT NULL
        CHECK (level_number BETWEEN 1 AND 3),

    -- Puntuación obtenida en el nivel
    -- Valor permitido: 0 a 5
    score INTEGER NOT NULL DEFAULT 0
        CHECK (score BETWEEN 0 AND 5),

    -- Indica si el nivel fue completado
    completed BOOLEAN NOT NULL DEFAULT FALSE,

    -- Última actualización del progreso
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Un alumno solo puede tener un registro
    -- por módulo y nivel
    UNIQUE(user_id, module_number, level_number)
);


/* ============================================================
   TABLA: USER_BADGES
   ------------------------------------------------------------
   Guarda las medallas obtenidas por cada alumno.

   Regla:
   Cuando complete los 3 niveles de un módulo,
   recibe una medalla.

   Máximo:
   6 medallas (una por módulo).
   ============================================================ */
CREATE TABLE user_badges (

    -- ID interno
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Usuario que obtuvo la medalla
    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    -- Módulo asociado a la medalla
    module_number INTEGER NOT NULL
        CHECK (module_number BETWEEN 1 AND 6),

    -- Fecha en la que se obtuvo
    earned_at TIMESTAMP DEFAULT NOW(),

    -- Evita que un alumno reciba dos veces
    -- la misma medalla del mismo módulo
    UNIQUE(user_id, module_number)
);