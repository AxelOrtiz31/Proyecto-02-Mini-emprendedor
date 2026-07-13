"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface Profile {
  nombre: string;
  apellido: string;
  edad: number | null;
  avatar_url?: string;
}

interface ProgressStats {
  totalLecciones: number;
  totalXp: number;
  totalEstrellas: number;
  racha: number;
  moduloActual: string | null;
  moduloNumero: number | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProgressStats | null>(null);
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
          .select("nombre, apellido, edad, avatar_id")
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
        });

        // 4. Estadísticas de progreso
        const { data: progreso, error: progError } = await supabase
          .from("progreso_lecciones")
          .select("completada_en, xp_obtenido, estrellas, codigo_leccion")
          .eq("alumno_id", user.id)
          .eq("estado", "completada")
          .order("completada_en", { ascending: false });

        if (progError) throw progError;

        const completadas = progreso || [];

        // Totales
        const totalLecciones = completadas.length;
        const totalXp = completadas.reduce((sum, p) => sum + p.xp_obtenido, 0);
        const totalEstrellas = completadas.reduce((sum, p) => sum + p.estrellas, 0);

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

        const racha = calcularRacha(completadas);

        setStats({
          totalLecciones,
          totalXp,
          totalEstrellas,
          racha,
          moduloActual,
          moduloNumero,
        });
      } catch (err: any) {
        console.error("Error cargando perfil:", err);
        setError(err.message || "Error al cargar el perfil");
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
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Lecciones" value={stats.totalLecciones} icon="📚" color="bg-blue-100 text-blue-700" />
          <StatCard label="XP" value={stats.totalXp} icon="⭐" color="bg-yellow-100 text-yellow-700" />
          <StatCard label="Estrellas" value={stats.totalEstrellas} icon="🌟" color="bg-green-100 text-green-700" />
          <StatCard label="Racha" value={`${stats.racha} ${stats.racha === 1 ? "día" : "días"}`} icon="🔥" color="bg-red-100 text-red-700" />
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

function calcularRacha(progreso: { completada_en: string | null }[]): number {
  if (!progreso.length) return 0;

  const fechas = progreso
    .map((p) => p.completada_en?.split("T")[0])
    .filter((fecha): fecha is string => fecha !== undefined && fecha !== null);

  if (fechas.length === 0) return 0;

  const fechasUnicas = [...new Set(fechas)].sort().reverse();

  let racha = 0;
  let fechaEsperada = new Date();
  fechaEsperada.setHours(0, 0, 0, 0);

  for (const fechaStr of fechasUnicas) {
    const fecha = new Date(fechaStr);
    fecha.setHours(0, 0, 0, 0);

    const diff = (fechaEsperada.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 0 || diff === 1) {
      racha++;
      fechaEsperada.setDate(fechaEsperada.getDate() - 1);
    } else {
      break;
    }
  }

  return racha;
}