-- ============================================================
-- SistemaTickets - Script de creacion de tablas de tickets
-- Base de datos: DB_TICKETS
-- Fecha: 2026-06-03
-- ============================================================

USE DB_TICKETS;
GO

-- ============================================================
-- 1. TicketCategorias
-- ============================================================
IF NOT EXISTS (
    SELECT 1 
    FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'TicketCategorias') 
      AND type = N'U'
)
BEGIN
    CREATE TABLE TicketCategorias (
        IdCategoria INT IDENTITY(1,1) NOT NULL,
        Nombre      NVARCHAR(100) NOT NULL,
        Activo      BIT NOT NULL CONSTRAINT DF_TktCat_Activo DEFAULT 1,
        CONSTRAINT PK_TicketCategorias PRIMARY KEY (IdCategoria)
    );

    PRINT 'Tabla TicketCategorias creada.';
END
ELSE
BEGIN
    PRINT 'Tabla TicketCategorias ya existe.';
END
GO

-- ============================================================
-- 2. TicketSubcategorias
-- ============================================================
IF NOT EXISTS (
    SELECT 1 
    FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'TicketSubcategorias') 
      AND type = N'U'
)
BEGIN
    CREATE TABLE TicketSubcategorias (
        IdSubcategoria INT IDENTITY(1,1) NOT NULL,
        IdCategoria    INT NOT NULL,
        Nombre         NVARCHAR(100) NOT NULL,
        Activo         BIT NOT NULL CONSTRAINT DF_TktSub_Activo DEFAULT 1,

        CONSTRAINT PK_TicketSubcategorias 
            PRIMARY KEY (IdSubcategoria),

        CONSTRAINT FK_TktSub_Categoria 
            FOREIGN KEY (IdCategoria)
            REFERENCES TicketCategorias(IdCategoria)
    );

    CREATE INDEX IX_TktSub_Categoria 
        ON TicketSubcategorias(IdCategoria);

    PRINT 'Tabla TicketSubcategorias creada.';
END
ELSE
BEGIN
    PRINT 'Tabla TicketSubcategorias ya existe.';
END
GO

-- ============================================================
-- 3. Tickets
-- ============================================================
IF NOT EXISTS (
    SELECT 1 
    FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'Tickets') 
      AND type = N'U'
)
BEGIN
    CREATE TABLE Tickets (
        IdTicket            INT IDENTITY(1,1) NOT NULL,
        Folio               NVARCHAR(25)  NULL,
        Titulo              NVARCHAR(200) NOT NULL,
        Descripcion         NVARCHAR(MAX) NOT NULL,
        IdCategoria         INT NOT NULL,
        IdSubcategoria      INT NULL,
        Prioridad           NVARCHAR(20) NOT NULL 
                            CONSTRAINT DF_Tkt_Prioridad DEFAULT 'Media',
        Estado              NVARCHAR(20) NOT NULL 
                            CONSTRAINT DF_Tkt_Estado DEFAULT 'Nuevo',
        IdUsuarioCreador    INT NOT NULL,
        IdUsuarioAsignado   INT NULL,
        FechaCreacion       DATETIME NOT NULL 
                            CONSTRAINT DF_Tkt_FechaCreacion DEFAULT GETDATE(),
        FechaActualizacion  DATETIME NOT NULL 
                            CONSTRAINT DF_Tkt_FechaActualizacion DEFAULT GETDATE(),
        FechaCierre         DATETIME NULL,
        Activo              BIT NOT NULL 
                            CONSTRAINT DF_Tkt_Activo DEFAULT 1,

        CONSTRAINT PK_Tickets 
            PRIMARY KEY (IdTicket),

        CONSTRAINT FK_Tkt_Categoria 
            FOREIGN KEY (IdCategoria)
            REFERENCES TicketCategorias(IdCategoria),

        CONSTRAINT FK_Tkt_Subcategoria 
            FOREIGN KEY (IdSubcategoria)
            REFERENCES TicketSubcategorias(IdSubcategoria),

        CONSTRAINT FK_Tkt_UsuarioCreador 
            FOREIGN KEY (IdUsuarioCreador)
            REFERENCES TBA_Usuarios_Perfiles(IdUsuario),

        CONSTRAINT FK_Tkt_UsuarioAsignado 
            FOREIGN KEY (IdUsuarioAsignado)
            REFERENCES TBA_Usuarios_Perfiles(IdUsuario),

        CONSTRAINT CHK_Tkt_Prioridad 
            CHECK (Prioridad IN ('Baja', 'Media', 'Alta', 'Critica')),

        CONSTRAINT CHK_Tkt_Estado 
            CHECK (
                Estado IN (
                    'Nuevo',
                    'Asignado',
                    'En proceso',
                    'En espera',
                    'Resuelto',
                    'Cerrado',
                    'Cancelado',
                    'Reabierto'
                )
            )
    );

    CREATE UNIQUE INDEX UIX_Tkt_Folio 
        ON Tickets(Folio) 
        WHERE Folio IS NOT NULL;

    CREATE INDEX IX_Tkt_Estado 
        ON Tickets(Estado);

    CREATE INDEX IX_Tkt_Prioridad 
        ON Tickets(Prioridad);

    CREATE INDEX IX_Tkt_Fecha 
        ON Tickets(FechaCreacion);

    CREATE INDEX IX_Tkt_Creador 
        ON Tickets(IdUsuarioCreador);

    CREATE INDEX IX_Tkt_Asignado 
        ON Tickets(IdUsuarioAsignado);

    PRINT 'Tabla Tickets creada.';
END
ELSE
BEGIN
    PRINT 'Tabla Tickets ya existe.';
END
GO

-- ============================================================
-- 4. TicketComentarios
-- ============================================================
IF NOT EXISTS (
    SELECT 1 
    FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'TicketComentarios') 
      AND type = N'U'
)
BEGIN
    CREATE TABLE TicketComentarios (
        IdComentario   INT IDENTITY(1,1) NOT NULL,
        IdTicket       INT NOT NULL,
        IdUsuario      INT NOT NULL,
        Comentario     NVARCHAR(MAX) NOT NULL,
        FechaCreacion  DATETIME NOT NULL 
                       CONSTRAINT DF_TktCom_Fecha DEFAULT GETDATE(),
        EsInterno      BIT NOT NULL 
                       CONSTRAINT DF_TktCom_Interno DEFAULT 0,
        Activo         BIT NOT NULL 
                       CONSTRAINT DF_TktCom_Activo DEFAULT 1,

        CONSTRAINT PK_TicketComentarios 
            PRIMARY KEY (IdComentario),

        CONSTRAINT FK_TktCom_Ticket 
            FOREIGN KEY (IdTicket)
            REFERENCES Tickets(IdTicket),

        CONSTRAINT FK_TktCom_Usuario 
            FOREIGN KEY (IdUsuario)
            REFERENCES TBA_Usuarios_Perfiles(IdUsuario)
    );

    CREATE INDEX IX_TktCom_Ticket 
        ON TicketComentarios(IdTicket);

    PRINT 'Tabla TicketComentarios creada.';
END
ELSE
BEGIN
    PRINT 'Tabla TicketComentarios ya existe.';
END
GO

-- ============================================================
-- 5. TicketHistorial
-- ============================================================
IF NOT EXISTS (
    SELECT 1 
    FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'TicketHistorial') 
      AND type = N'U'
)
BEGIN
    CREATE TABLE TicketHistorial (
        IdHistorial      INT IDENTITY(1,1) NOT NULL,
        IdTicket         INT NOT NULL,
        IdUsuario        INT NOT NULL,
        Accion           NVARCHAR(100) NOT NULL,
        CampoModificado  NVARCHAR(100) NULL,
        ValorAnterior    NVARCHAR(500) NULL,
        ValorNuevo       NVARCHAR(500) NULL,
        Comentario       NVARCHAR(MAX) NULL,
        FechaMovimiento  DATETIME NOT NULL 
                         CONSTRAINT DF_TktHist_Fecha DEFAULT GETDATE(),

        CONSTRAINT PK_TicketHistorial 
            PRIMARY KEY (IdHistorial),

        CONSTRAINT FK_TktHist_Ticket 
            FOREIGN KEY (IdTicket)
            REFERENCES Tickets(IdTicket),

        CONSTRAINT FK_TktHist_Usuario 
            FOREIGN KEY (IdUsuario)
            REFERENCES TBA_Usuarios_Perfiles(IdUsuario)
    );

    CREATE INDEX IX_TktHist_Ticket 
        ON TicketHistorial(IdTicket);

    PRINT 'Tabla TicketHistorial creada.';
END
ELSE
BEGIN
    PRINT 'Tabla TicketHistorial ya existe.';
END
GO

-- ============================================================
-- 6. TicketAdjuntos
-- ============================================================
IF NOT EXISTS (
    SELECT 1 
    FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'TicketAdjuntos') 
      AND type = N'U'
)
BEGIN
    CREATE TABLE TicketAdjuntos (
        IdAdjunto       INT IDENTITY(1,1) NOT NULL,
        IdTicket        INT NOT NULL,
        IdComentario    INT NULL,
        NombreOriginal  NVARCHAR(260) NOT NULL,
        NombreGuardado  NVARCHAR(260) NOT NULL,
        RutaArchivo     NVARCHAR(500) NOT NULL,
        Extension       NVARCHAR(20) NOT NULL,
        TamanoBytes     BIGINT NOT NULL 
                        CONSTRAINT DF_TktAdj_Tamano DEFAULT 0,
        IdUsuarioCarga  INT NOT NULL,
        FechaCarga      DATETIME NOT NULL 
                        CONSTRAINT DF_TktAdj_Fecha DEFAULT GETDATE(),
        Activo          BIT NOT NULL 
                        CONSTRAINT DF_TktAdj_Activo DEFAULT 1,

        CONSTRAINT PK_TicketAdjuntos 
            PRIMARY KEY (IdAdjunto),

        CONSTRAINT FK_TktAdj_Ticket 
            FOREIGN KEY (IdTicket)
            REFERENCES Tickets(IdTicket),

        CONSTRAINT FK_TktAdj_Comentario 
            FOREIGN KEY (IdComentario)
            REFERENCES TicketComentarios(IdComentario),

        CONSTRAINT FK_TktAdj_Usuario 
            FOREIGN KEY (IdUsuarioCarga)
            REFERENCES TBA_Usuarios_Perfiles(IdUsuario)
    );

    CREATE INDEX IX_TktAdj_Ticket 
        ON TicketAdjuntos(IdTicket);

    CREATE INDEX IX_TktAdj_Comentario 
        ON TicketAdjuntos(IdComentario);

    PRINT 'Tabla TicketAdjuntos creada.';
END
ELSE
BEGIN
    PRINT 'Tabla TicketAdjuntos ya existe.';
END
GO

-- ============================================================
-- Datos iniciales: categorias y subcategorias
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM TicketCategorias)
BEGIN
    INSERT INTO TicketCategorias (Nombre) 
    VALUES
        ('Hardware'),
        ('Software'),
        ('Red y Conectividad'),
        ('Accesos y Permisos'),
        ('Correo Electronico'),
        ('Impresion'),
        ('Soporte General'),
        ('Solicitud de Servicio'),
        ('Incidencia');

    -- Hardware (IdCategoria = 1)
    INSERT INTO TicketSubcategorias (IdCategoria, Nombre) 
    VALUES
        (1, 'Computadora de escritorio'),
        (1, 'Laptop'),
        (1, 'Monitor'),
        (1, 'Teclado / Mouse'),
        (1, 'Dispositivos perifericos');

    -- Software (IdCategoria = 2)
    INSERT INTO TicketSubcategorias (IdCategoria, Nombre) 
    VALUES
        (2, 'Sistema Operativo'),
        (2, 'Aplicacion de escritorio'),
        (2, 'Aplicacion web'),
        (2, 'Antivirus / Seguridad'),
        (2, 'Actualizaciones');

    -- Red y Conectividad (IdCategoria = 3)
    INSERT INTO TicketSubcategorias (IdCategoria, Nombre) 
    VALUES
        (3, 'Internet'),
        (3, 'VPN'),
        (3, 'Wi-Fi'),
        (3, 'Switch / Router'),
        (3, 'Cable de red');

    -- Accesos y Permisos (IdCategoria = 4)
    INSERT INTO TicketSubcategorias (IdCategoria, Nombre) 
    VALUES
        (4, 'Alta de usuario'),
        (4, 'Baja de usuario'),
        (4, 'Permisos de carpeta'),
        (4, 'Contrasena bloqueada'),
        (4, 'Acceso a sistema');

    -- Correo Electronico (IdCategoria = 5)
    INSERT INTO TicketSubcategorias (IdCategoria, Nombre) 
    VALUES
        (5, 'No puede enviar correos'),
        (5, 'No puede recibir correos'),
        (5, 'Configuracion de cuenta'),
        (5, 'Spam / Correo no deseado');

    PRINT 'Datos iniciales insertados.';
END
ELSE
BEGIN
    PRINT 'Las categorias iniciales ya existen.';
END
GO

-- ============================================================
-- Usuarios de prueba
-- ============================================================

IF NOT EXISTS (
    SELECT 1 
    FROM TBA_Usuarios_Perfiles 
    WHERE Correo = 'admin@empresa.com'
)
BEGIN
    INSERT INTO TBA_Usuarios_Perfiles (
        Nombre, 
        Correo, 
        Contrasena, 
        Activo, 
        Perfil
    )
    VALUES (
        'Administrador', 
        'admin@empresa.com', 
        'Admin123', 
        1, 
        'Admin'
    );

    PRINT 'Usuario admin@empresa.com creado (Perfil: Admin).';
END
ELSE
BEGIN
    PRINT 'Usuario admin@empresa.com ya existe.';
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM TBA_Usuarios_Perfiles 
    WHERE Correo = 'agente@empresa.com'
)
BEGIN
    INSERT INTO TBA_Usuarios_Perfiles (
        Nombre, 
        Correo, 
        Contrasena, 
        Activo, 
        Perfil
    )
    VALUES (
        'Agente Soporte', 
        'agente@empresa.com', 
        'Agente123', 
        1, 
        'Agente'
    );

    PRINT 'Usuario agente@empresa.com creado (Perfil: Agente).';
END
ELSE
BEGIN
    PRINT 'Usuario agente@empresa.com ya existe.';
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM TBA_Usuarios_Perfiles 
    WHERE Correo = 'usuario@empresa.com'
)
BEGIN
    INSERT INTO TBA_Usuarios_Perfiles (
        Nombre, 
        Correo, 
        Contrasena, 
        Activo, 
        Perfil
    )
    VALUES (
        'Usuario Prueba', 
        'usuario@empresa.com', 
        'Usuario123', 
        1, 
        'Usuario'
    );

    PRINT 'Usuario usuario@empresa.com creado (Perfil: Usuario).';
END
ELSE
BEGIN
    PRINT 'Usuario usuario@empresa.com ya existe.';
END
GO

PRINT '=== Script completado correctamente ===';
GO

-- ----------------------------
-- Table structure for TBA_Usuarios_Perfiles
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[TBA_Usuarios_Perfiles]') AND type IN ('U'))
	DROP TABLE [dbo].[TBA_Usuarios_Perfiles]
GO

CREATE TABLE [dbo].[TBA_Usuarios_Perfiles] (
  [IdUsuario] int  IDENTITY(1,1) NOT NULL,
  [Nombre] nvarchar(100) COLLATE Modern_Spanish_CI_AS  NOT NULL,
  [Correo] nvarchar(150) COLLATE Modern_Spanish_CI_AS  NOT NULL,
  [Contrasena] nvarchar(255) COLLATE Modern_Spanish_CI_AS  NOT NULL,
  [Activo] bit DEFAULT 1 NOT NULL,
  [Perfil] nvarchar(50) COLLATE Modern_Spanish_CI_AS DEFAULT 'Agente' NOT NULL,
  [NombreSup] varchar(150) COLLATE Modern_Spanish_CI_AS  NULL,
  [ID_EXTENSION] varchar(10) COLLATE Modern_Spanish_CI_AS  NULL,
  [PASS_EXTENSION] varchar(255) COLLATE Modern_Spanish_CI_AS  NULL,
  [IP_PBX] varchar(255) COLLATE Modern_Spanish_CI_AS  NULL,
  [IdTipoSuper] int  NULL,
  [IdTipoPerfil] int  NULL,
  [IdSupervisor] int  NULL
)
GO

ALTER TABLE [dbo].[TBA_Usuarios_Perfiles] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Auto increment value for TBA_Usuarios_Perfiles
-- ----------------------------
DBCC CHECKIDENT ('[dbo].[TBA_Usuarios_Perfiles]', RESEED, 224)
GO


-- ----------------------------
-- Indexes structure for table TBA_Usuarios_Perfiles
-- ----------------------------
CREATE NONCLUSTERED INDEX [idx_usuariosuper_copy1]
ON [dbo].[TBA_Usuarios_Perfiles] (
  [IdUsuario] ASC
)
GO

CREATE NONCLUSTERED INDEX [idx_exten_super]
ON [dbo].[TBA_Usuarios_Perfiles] (
  [ID_EXTENSION] ASC
)
GO


-- ----------------------------
-- Uniques structure for table TBA_Usuarios_Perfiles
-- ----------------------------
ALTER TABLE [dbo].[TBA_Usuarios_Perfiles] ADD CONSTRAINT [UQ__TBA_Supe__60695A19ED69BC8F] UNIQUE NONCLUSTERED ([Correo] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table TBA_Usuarios_Perfiles
-- ----------------------------
ALTER TABLE [dbo].[TBA_Usuarios_Perfiles] ADD CONSTRAINT [PK__TBA_Supe__5B65BF977F4B1B84] PRIMARY KEY CLUSTERED ([IdUsuario])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Foreign Keys structure for table TBA_Usuarios_Perfiles
-- ----------------------------
ALTER TABLE [dbo].[TBA_Usuarios_Perfiles] ADD CONSTRAINT [FK_TBA_Usuarios_Perfiles_Supervisor] FOREIGN KEY ([IdSupervisor]) REFERENCES [dbo].[TBA_Usuarios_Perfiles] ([IdUsuario]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO


-- ============================================================
-- NUEVAS TABLAS DE GAMIFICACIÓN / EDUCACIÓN (Convertidas a T-SQL)
-- ============================================================

CREATE TABLE avatares (
  id INT IDENTITY(1,1) NOT NULL,
  nombre NVARCHAR(255) NOT NULL UNIQUE,
  url_imagen NVARCHAR(MAX) NOT NULL,
  activo BIT NOT NULL DEFAULT 1,
  CONSTRAINT PK_avatares PRIMARY KEY (id)
);
GO

CREATE TABLE modulos (
  id INT IDENTITY(1,1) NOT NULL,
  numero SMALLINT NOT NULL UNIQUE,
  titulo NVARCHAR(255) NOT NULL,
  orden SMALLINT NOT NULL DEFAULT 1,
  activo BIT NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT PK_modulos PRIMARY KEY (id)
);
GO

CREATE TABLE unidades (
  id INT IDENTITY(1,1) NOT NULL,
  modulo_id INT NOT NULL,
  numero SMALLINT NOT NULL,
  titulo NVARCHAR(255) NOT NULL,
  subtitulo NVARCHAR(255) NULL,
  orden SMALLINT NOT NULL DEFAULT 1,
  activa BIT NOT NULL DEFAULT 1,
  creada_en DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT PK_unidades PRIMARY KEY (id),
  CONSTRAINT FK_unidades_modulo FOREIGN KEY (modulo_id) REFERENCES modulos(id)
);
GO

CREATE TABLE lecciones (
  id INT IDENTITY(1,1) NOT NULL,
  unidad_id INT NOT NULL,
  titulo NVARCHAR(255) NOT NULL,
  descripcion NVARCHAR(MAX) NULL,
  tipo NVARCHAR(50) NOT NULL DEFAULT 'lesson' 
       CHECK (tipo IN ('lesson', 'practice', 'story', 'challenge', 'bonus', 'boss')),
  orden SMALLINT NOT NULL DEFAULT 1,
  xp_recompensa SMALLINT NOT NULL DEFAULT 23 CHECK (xp_recompensa >= 0),
  activa BIT NOT NULL DEFAULT 1,
  creada_en DATETIME NOT NULL DEFAULT GETDATE(),
  ruta NVARCHAR(255) NULL,
  CONSTRAINT PK_lecciones PRIMARY KEY (id),
  CONSTRAINT FK_lecciones_unidad FOREIGN KEY (unidad_id) REFERENCES unidades(id)
);
GO

CREATE TABLE perfiles (
  id UNIQUEIDENTIFIER NOT NULL,
  nombre NVARCHAR(255) NOT NULL,
  apellido NVARCHAR(255) NOT NULL,
  edad SMALLINT CHECK (edad >= 5 AND edad <= 18),
  fecha_nacimiento DATE NULL,
  avatar_id INT NULL,
  ultima_sesion DATETIME NULL,
  rol NVARCHAR(50) NOT NULL DEFAULT 'alumno' 
      CHECK (rol IN ('alumno', 'tutor', 'maestro', 'admin')),
  alias NVARCHAR(255) NULL,
  grado_escolar NVARCHAR(255) NULL,
  fecha_registro DATETIME NOT NULL DEFAULT GETDATE(),
  activo BIT NOT NULL DEFAULT 1,
  CONSTRAINT PK_perfiles PRIMARY KEY (id),
  -- CONSTRAINT FK_perfiles_auth FOREIGN KEY (id) REFERENCES auth_users(id), -- Requiere tabla de auth externa
  CONSTRAINT FK_perfiles_avatar FOREIGN KEY (avatar_id) REFERENCES avatares(id)
);
GO

CREATE TABLE tutor_alumno (
  id INT IDENTITY(1,1) NOT NULL,
  tutor_id UNIQUEIDENTIFIER NOT NULL,
  alumno_id UNIQUEIDENTIFIER NOT NULL,
  activo BIT NOT NULL DEFAULT 1,
  fecha_alta DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT PK_tutor_alumno PRIMARY KEY (id),
  CONSTRAINT FK_tutor_alumno_tutor FOREIGN KEY (tutor_id) REFERENCES perfiles(id),
  CONSTRAINT FK_tutor_alumno_alumno FOREIGN KEY (alumno_id) REFERENCES perfiles(id)
);
GO

CREATE TABLE evaluaciones (
  id INT IDENTITY(1,1) NOT NULL,
  nombre NVARCHAR(255) NOT NULL,
  descripcion NVARCHAR(MAX) NULL,
  tipo NVARCHAR(50) NOT NULL CHECK (tipo IN ('inicial', 'final', 'modulo')),
  modulo_id INT NULL,
  instrucciones NVARCHAR(MAX) NULL,
  activa BIT NOT NULL DEFAULT 1,
  creada_en DATETIME NOT NULL DEFAULT GETDATE(),
  actualizada_en DATETIME NOT NULL DEFAULT GETDATE(),
  codigo_leccion NVARCHAR(255) NULL,
  CONSTRAINT PK_evaluaciones PRIMARY KEY (id),
  CONSTRAINT FK_evaluaciones_modulo FOREIGN KEY (modulo_id) REFERENCES modulos(id)
);
GO

CREATE TABLE preguntas_evaluacion (
  id INT IDENTITY(1,1) NOT NULL,
  evaluacion_id INT NOT NULL,
  texto NVARCHAR(MAX) NOT NULL,
  orden SMALLINT NOT NULL DEFAULT 1,
  activa BIT NOT NULL DEFAULT 1,
  creada_en DATETIME NOT NULL DEFAULT GETDATE(),
  multiple BIT NOT NULL DEFAULT 0,
  nivel INT NULL,
  CONSTRAINT PK_preguntas_evaluacion PRIMARY KEY (id),
  CONSTRAINT FK_preg_eval_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id)
);
GO

CREATE TABLE opciones_respuesta (
  id INT IDENTITY(1,1) NOT NULL,
  pregunta_id INT NOT NULL,
  etiqueta NVARCHAR(255) NOT NULL,
  valor SMALLINT NOT NULL CHECK (valor > 0),
  emoji NVARCHAR(50) NULL,
  orden SMALLINT NOT NULL DEFAULT 1,
  creada_en DATETIME NOT NULL DEFAULT GETDATE(),
  es_correcta BIT NOT NULL DEFAULT 0,
  CONSTRAINT PK_opciones_respuesta PRIMARY KEY (id),
  CONSTRAINT FK_opciones_pregunta FOREIGN KEY (pregunta_id) REFERENCES preguntas_evaluacion(id)
);
GO

CREATE TABLE sesiones_evaluacion (
  id INT IDENTITY(1,1) NOT NULL,
  alumno_id UNIQUEIDENTIFIER NOT NULL,
  evaluacion_id INT NOT NULL,
  puntaje_total SMALLINT NULL,
  puntaje_maximo SMALLINT NULL,
  completada_en DATETIME NULL,
  estado NVARCHAR(50) NOT NULL DEFAULT 'en_progreso' 
         CHECK (estado IN ('en_progreso', 'completada', 'abandonada')),
  iniciada_en DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT PK_sesiones_evaluacion PRIMARY KEY (id),
  CONSTRAINT FK_sesiones_alumno FOREIGN KEY (alumno_id) REFERENCES perfiles(id),
  CONSTRAINT FK_sesiones_evaluacion FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id)
);
GO

CREATE TABLE respuestas_evaluacion (
  id INT IDENTITY(1,1) NOT NULL,
  sesion_id INT NOT NULL,
  pregunta_id INT NOT NULL,
  opcion_id INT NOT NULL,
  valor_registrado SMALLINT NOT NULL,
  respondida_en DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT PK_respuestas_evaluacion PRIMARY KEY (id),
  CONSTRAINT FK_resp_eval_sesion FOREIGN KEY (sesion_id) REFERENCES sesiones_evaluacion(id),
  CONSTRAINT FK_resp_eval_pregunta FOREIGN KEY (pregunta_id) REFERENCES preguntas_evaluacion(id),
  CONSTRAINT FK_resp_eval_opcion FOREIGN KEY (opcion_id) REFERENCES opciones_respuesta(id)
);
GO

CREATE TABLE progreso_lecciones (
  id INT IDENTITY(1,1) NOT NULL,
  alumno_id UNIQUEIDENTIFIER NOT NULL,
  leccion_id INT NULL,
  completada_en DATETIME NULL,
  estado NVARCHAR(50) NOT NULL DEFAULT 'completada' 
         CHECK (estado IN ('en_progreso', 'completada')),
  xp_obtenido SMALLINT NOT NULL DEFAULT 0 CHECK (xp_obtenido >= 0),
  estrellas SMALLINT NOT NULL DEFAULT 0 CHECK (estrellas >= 0 AND estrellas <= 3),
  creada_en DATETIME NOT NULL DEFAULT GETDATE(),
  codigo_leccion NVARCHAR(255) NULL,
  CONSTRAINT PK_progreso_lecciones PRIMARY KEY (id),
  CONSTRAINT FK_progreso_alumno FOREIGN KEY (alumno_id) REFERENCES perfiles(id),
  CONSTRAINT FK_progreso_leccion FOREIGN KEY (leccion_id) REFERENCES lecciones(id)
);
GO

CREATE TABLE mi_negocio (
  id INT IDENTITY(1,1) NOT NULL,
  alumno_id UNIQUEIDENTIFIER NOT NULL UNIQUE,
  cliente_id NVARCHAR(255) NULL,
  cliente_nombre NVARCHAR(255) NULL,
  cliente_emoji NVARCHAR(50) NULL,
  nombre_negocio NVARCHAR(255) NULL,
  estilo_marca NVARCHAR(255) NULL,
  color_primario NVARCHAR(50) NULL,
  color_secundario NVARCHAR(50) NULL,
  logo_icono NVARCHAR(255) NULL,
  logo_forma NVARCHAR(255) NULL,
  creado_en DATETIME NOT NULL DEFAULT GETDATE(),
  actualizado_en DATETIME NOT NULL DEFAULT GETDATE(),
  idea_nombre NVARCHAR(255) NULL,
  idea_tipo NVARCHAR(255) NULL,
  idea_ayuda NVARCHAR(255) NULL,
  idea_costo DECIMAL(18,2) NULL,
  idea_precio DECIMAL(18,2) NULL,
  idea_ganancia DECIMAL(18,2) NULL,
  idea_estrategia NVARCHAR(255) NULL,
  eslogan NVARCHAR(255) NULL,
  pitch_diseno NVARCHAR(255) NULL,
  pitch_razon NVARCHAR(255) NULL,
  empaque_color NVARCHAR(255) NULL,
  empaque_material NVARCHAR(255) NULL,
  empaque_elementos NVARCHAR(255) NULL,
  empaque_ambiental NVARCHAR(255) NULL,
  cliente_necesita NVARCHAR(255) NULL,
  cliente_donde_encontrar NVARCHAR(255) NULL,
  marca_percepcion NVARCHAR(255) NULL,
  CONSTRAINT PK_mi_negocio PRIMARY KEY (id),
  CONSTRAINT FK_mi_negocio_alumno FOREIGN KEY (alumno_id) REFERENCES perfiles(id)
);
GO