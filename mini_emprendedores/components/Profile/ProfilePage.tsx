"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { calculateStreak, formatStreakDays } from "@/lib/streak";
import { fetchInsignias } from "@/lib/insignias";
import { fetchMiNegocio, type MiNegocio } from "@/lib/negocio";
import { course } from "@/data/course";

interface Profile {
  nombre: string;
  apellido: string;
  edad: number | null;
  avatar_url?: string;
  ultimaSesion: string | null;
  habilidadDominante: string | null;
}

interface ProgressStats {
  totalLecciones: number;
  totalXp: number;
  totalEstrellas: number;
  totalInsignias: number;
  tiempoTotalSegundos: number;
  modulosCompletados: number;
  totalModulos: number;
  racha: number;
  moduloActual: string | null;
  moduloNumero: number | null;
}

const HABILIDAD_LABEL: Record<string, string> = {
  liderazgo: "Liderazgo",
  creatividad: "Creatividad",
  trabajo_equipo: "Trabajo en equipo",
  resolucion_problemas: "Resolución de problemas",
};

function formatearTiempoTotal(segundos: number): string {
  if (segundos <= 0) return "Sin registrar aún";
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  if (horas > 0) return `${horas} h ${minutos} min`;
  return `${minutos} min`;
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) return "Sin registrar";
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [negocio, setNegocio] = useState<MiNegocio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        // 1. Obtener usuario autenticado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("No autenticado");
        setUser(user);

        // 2. Obtener perfil (sin insertar, solo consultar)
        const { data: perfil, error: perfilError } = await supabase
          .from("perfiles")
          .select("nombre, apellido, edad, avatar_id, ultima_sesion, habilidad_dominante")
          .eq("id", user.id)
          .maybeSingle();

        if (perfilError) throw perfilError;

        let profileData = perfil;

        // Si no hay perfil, usar valores por defecto (no insertamos)
        if (!profileData) {
          profileData = {
            nombre: "Alumno",
            apellido: "",
            edad: null,
            avatar_id: null,
            ultima_sesion: null,
            habilidad_dominante: null,
          };
        }

        // 3. Obtener avatar (si existe)
        let avatarUrl = undefined;
        if (profileData.avatar_id) {
          const { data: avatar, error: avatarError } = await supabase
            .from("avatares")
            .select("url_imagen")
            .eq("id", profileData.avatar_id)
            .maybeSingle();

          if (!avatarError && avatar) {
            avatarUrl = avatar.url_imagen;
          }
        }

        setProfile({
          nombre: profileData.nombre || "Alumno",
          apellido: profileData.apellido || "",
          edad: profileData.edad || null,
          avatar_url: avatarUrl,
          ultimaSesion: profileData.ultima_sesion ?? null,
          habilidadDominante: profileData.habilidad_dominante ?? null,
        });

        // 4. Estadísticas de progreso
        const { data: progreso, error: progError } = await supabase
          .from("progreso_lecciones")
          .select("completada_en, xp_obtenido, estrellas, codigo_leccion, tiempo_segundos")
          .eq("alumno_id", user.id)
          .eq("estado", "completada")
          .order("completada_en", { ascending: false });

        if (progError) throw progError;

        const completadas = progreso || [];

        // Totales
        const totalLecciones = completadas.length;
        const totalXp = completadas.reduce((sum, p) => sum + p.xp_obtenido, 0);
        const totalEstrellas = completadas.reduce((sum, p) => sum + p.estrellas, 0);
        const tiempoTotalSegundos = completadas.reduce(
          (sum, p) => sum + (p.tiempo_segundos || 0),
          0,
        );

        // Insignias reales
        const insignias = await fetchInsignias();

        // Negocio creado
        const negocioData = await fetchMiNegocio();
        setNegocio(negocioData);

        // Módulos completados: todas sus actividades están en `completadas`.
        const codigosCompletados = new Set(completadas.map((p) => p.codigo_leccion));
        const modulosCompletados = course.filter((section) =>
          section.units
            .flatMap((unit) => unit.activities)
            .every((activity) => codigosCompletados.has(activity.id)),
        ).length;

        // Módulo actual
        let moduloActual: string | null = null;
        let moduloNumero: number | null = null;
        if (completadas.length > 0) {
          const ultima = completadas[0];
          const codigo = ultima.codigo_leccion;
          if (codigo) {
            const match = codigo.match(/^s(\d+)/);
            if (match) {
              moduloNumero = parseInt(match[1], 10);
              const { data: modulo, error: modError } = await supabase
                .from("modulos")
                .select("titulo")
                .eq("numero", moduloNumero)
                .maybeSingle();

              if (!modError && modulo) {
                moduloActual = modulo.titulo;
              } else {
                moduloActual = `Módulo ${moduloNumero}`;
              }
            }
          }
        }

        const racha = calculateStreak(completadas.map((p) => p.completada_en));

        setStats({
          totalLecciones,
          totalXp,
          totalEstrellas,
          totalInsignias: insignias.length,
          tiempoTotalSegundos,
          modulosCompletados,
          totalModulos: course.length,
          racha,
          moduloActual,
          moduloNumero,
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setError(err instanceof Error ? err.message : "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (error || !profile || !stats) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="font-display text-xl font-extrabold text-foreground">
          {error || "No se pudo cargar el perfil"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-2xl bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Encabezado */}
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card p-6 shadow-(--shadow-card) sm:flex-row sm:p-8">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-5xl">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl">🧑‍🎓</span>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-2xl font-extrabold text-foreground">
              {profile.nombre} {profile.apellido}
            </h1>
            {profile.edad && (
              <p className="text-sm font-semibold text-muted-foreground">
                {profile.edad} años
              </p>
            )}
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {user?.email}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Último acceso: {formatearFecha(profile.ultimaSesion)}
            </p>
            {profile.habilidadDominante && HABILIDAD_LABEL[profile.habilidadDominante] && (
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">
                ⭐ Habilidad dominante: {HABILIDAD_LABEL[profile.habilidadDominante]}
              </p>
            )}
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Lecciones" value={stats.totalLecciones} icon="📚" color="bg-blue-100 text-blue-700" />
          <StatCard label="XP" value={stats.totalXp} icon="⭐" color="bg-yellow-100 text-yellow-700" />
          <StatCard label="Estrellas" value={stats.totalEstrellas} icon="🌟" color="bg-green-100 text-green-700" />
          <StatCard label="Racha" value={formatStreakDays(stats.racha)} icon="🔥" color="bg-red-100 text-red-700" />
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Insignias" value={stats.totalInsignias} icon="🏅" color="bg-purple-100 text-purple-700" />
          <StatCard
            label="Tiempo total"
            value={formatearTiempoTotal(stats.tiempoTotalSegundos)}
            icon="⏱️"
            color="bg-orange-100 text-orange-700"
          />
          <StatCard
            label="Módulos"
            value={`${stats.modulosCompletados}/${stats.totalModulos}`}
            icon="🗺️"
            color="bg-teal-100 text-teal-700"
          />
        </div>

        {/* Módulo actual */}
        <div className="mt-6 rounded-3xl bg-card p-6 shadow-(--shadow-card)">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Módulo actual
          </h2>
          <p className="mt-1 font-display text-xl font-extrabold text-foreground">
            {stats.moduloActual || "Sin lecciones completadas"}
          </p>
          {stats.moduloNumero && (
            <p className="text-sm font-semibold text-muted-foreground">
              Módulo {stats.moduloNumero}
            </p>
          )}
        </div>

        {/* Negocio creado */}
        {negocio?.nombreNegocio && (
          <div
            className="mt-6 flex items-center gap-4 rounded-3xl border-4 p-6 shadow-(--shadow-card)"
            style={{
              borderColor: negocio.colorPrimario ?? undefined,
              backgroundColor: negocio.colorPrimario ? `${negocio.colorPrimario}15` : undefined,
            }}
          >
            <span className="text-4xl">{negocio.logoIcono ?? "🏪"}</span>
            <div>
              <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
                Mi negocio
              </h2>
              <p className="font-display text-xl font-extrabold text-foreground">
                {negocio.nombreNegocio}
              </p>
              {negocio.eslogan && (
                <p className="text-sm font-semibold italic text-muted-foreground">
                  &ldquo;{negocio.eslogan}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botón volver */}
        <div className="mt-8 flex justify-center">
          <a
            href="/dashboard"
            className="rounded-2xl bg-primary px-8 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-1"
          >
            Volver al camino
          </a>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-(--shadow-card) text-center">
      <div className={`mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full ${color} text-xl`}>
        {icon}
      </div>
      <p className="mt-2 font-display text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
