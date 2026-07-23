import {
  formatearFecha,
  formatearFechaHora,
  formatearTiempo,
  nombreCompleto,
  HABILIDAD_LABEL,
  type AlumnoDetalle,
} from "@/lib/admin";
import { cn } from "@/lib/utils";
import { ProgressByModule } from "./ProgressByModule";

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-card p-4 text-center shadow-(--shadow-card)">
      <p className="font-display text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

export function StudentDetail({ detalle }: { detalle: AlumnoDetalle }) {
  const { perfil, modulos, sesiones, insignias, negocio } = detalle;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-card p-6 shadow-(--shadow-card)">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-foreground">
              {nombreCompleto(perfil)}
            </h1>
            <p className="text-sm font-semibold text-muted-foreground">
              {perfil.alias ? `${perfil.alias} · ` : ""}
              {perfil.edad ? `${perfil.edad} años` : "Edad sin registrar"}
              {perfil.gradoEscolar ? ` · ${perfil.gradoEscolar}` : ""}
            </p>
            {perfil.habilidadDominante && HABILIDAD_LABEL[perfil.habilidadDominante] && (
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">
                ⭐ {HABILIDAD_LABEL[perfil.habilidadDominante]}
              </p>
            )}
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              perfil.activo ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
            )}
          >
            {perfil.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs font-semibold text-muted-foreground">
          <span>Registro: {formatearFecha(perfil.fechaRegistro)}</span>
          <span>Último acceso: {formatearFechaHora(perfil.ultimaSesion)}</span>
          {perfil.cursoCompletadoEn && (
            <span className="text-success">
              Curso completado: {formatearFecha(perfil.cursoCompletadoEn)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <Tile label="Avance" value={`${perfil.porcentajeAvance}%`} />
        <Tile label="Lecciones" value={perfil.leccionesCompletadas} />
        <Tile label="XP" value={perfil.xpTotal} />
        <Tile label="Estrellas" value={perfil.estrellas} />
        <Tile label="Insignias" value={perfil.insignias} />
        <Tile label="Módulos" value={perfil.modulosCompletados} />
        <Tile label="Tiempo" value={formatearTiempo(perfil.tiempoTotalSegundos)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProgressByModule modulos={modulos} />

        <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
          <h2 className="font-display text-lg font-extrabold text-foreground">Evaluaciones</h2>
          {sesiones.length === 0 ? (
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              Sin evaluaciones registradas.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {sesiones.map((sesion, index) => (
                <li
                  key={`${sesion.evaluacion ?? "eval"}-${index}`}
                  className="flex items-center justify-between gap-2 border-b border-border pb-2 text-sm last:border-0 last:pb-0"
                >
                  <span className="font-bold text-foreground">
                    {sesion.evaluacion ?? "Evaluación"}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {sesion.puntajeTotal ?? "—"}
                    {sesion.puntajeMaximo ? `/${sesion.puntajeMaximo}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {insignias.length > 0 && (
        <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
          <h2 className="font-display text-lg font-extrabold text-foreground">Insignias</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {insignias.map((insignia, index) => (
              <span
                key={`${insignia.nombre}-${index}`}
                className="rounded-full bg-accent/25 px-3 py-1 text-xs font-bold text-accent-foreground"
              >
                🏅 {insignia.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      {negocio?.nombreNegocio && (
        <div className="rounded-2xl bg-card p-5 shadow-(--shadow-card)">
          <h2 className="font-display text-lg font-extrabold text-foreground">Mi negocio</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl">{negocio.logoIcono ?? "🏪"}</span>
            <div>
              <p className="font-display text-lg font-extrabold text-foreground">
                {negocio.nombreNegocio}
              </p>
              {negocio.eslogan && (
                <p className="text-sm font-semibold italic text-muted-foreground">
                  &ldquo;{negocio.eslogan}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
