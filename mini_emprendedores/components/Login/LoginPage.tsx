"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getOnboardingStatus, routeForStatus } from "@/lib/onboarding";
import { fetchCurrentProfileRole, isStaffRole } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { RobotBuddy, type RobotMood } from "./RobotBuddy";

// Mensajes de la burbuja del robot según lo que esté haciendo el alumno.
const bubbleText: Record<RobotMood, string> = {
  idle: "¡Hola de nuevo! ¿Entramos? 👋",
  point: "¡Escribe tu correo ahí!",
  peek: "Prometo no ver tu contraseña 🙈",
  happy: "¡Yujuu! Vamos a aprender 🎉",
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);
  // Estado del robot: reacciona al campo que tenga el foco.
  const [mood, setMood] = useState<RobotMood>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.correo,
      password: form.contrasena,
    });

    if (authError) {
      setError("Correo o contraseña incorrectos");
      setCargando(false);
      return;
    }

    // La maestra o admin entra directo a su panel; así no pasa por el test
    // inicial de alumno (que se dispara cuando no hay habilidad dominante).
    const rol = await fetchCurrentProfileRole();

    if (isStaffRole(rol)) {
      setCargando(false);
      router.push("/admin");
      return;
    }

    // El alumno nuevo pasa primero por el test inicial y la selección de avatar.
    const status = await getOnboardingStatus();

    setCargando(false);
    router.push(routeForStatus(status));
  }

  return (
    <main className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Mitad izquierda: robot que saluda, apunta y fisgonea */}
      <section className="relative flex items-center justify-center overflow-hidden bg-secondary px-6 py-10 lg:min-h-screen lg:w-1/2 lg:py-0">
        {/* Decoración de fondo con la paleta del camino */}
        <div aria-hidden="true">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/25" />
          <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-primary/10" />
          <div className="absolute right-14 top-20 h-6 w-6 rounded-full bg-primary/25" />
          <div className="absolute bottom-28 left-12 h-4 w-4 rounded-full bg-accent/50" />
          <div className="absolute left-24 top-1/3 h-3 w-3 rounded-full bg-success/30" />
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="absolute left-5 top-5 flex items-center gap-2 lg:left-8 lg:top-7"
        >
          <img src="/caelus.svg" alt="EmprendeKids" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-xl font-extrabold">
            <span className="text-foreground">Emprende</span>
            <span className="text-primary">Kids</span>
          </span>
        </Link>

        <div className="relative z-10 mt-10 flex flex-col items-center lg:mt-0">
          {/* Burbuja de diálogo */}
          <div className="relative mb-4 animate-mascot">
            <div className="rounded-2xl border-2 border-border bg-card px-5 py-2.5 font-display text-sm font-extrabold text-foreground shadow-(--shadow-card) sm:text-base">
              {bubbleText[mood]}
            </div>
            <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-border bg-card" />
          </div>

          <RobotBuddy mood={mood} className="h-64 w-64 sm:h-80 sm:w-80 lg:h-[32rem] lg:w-[32rem]" />
        </div>
      </section>

      {/* Mitad derecha: formulario */}
      <section className="flex flex-1 items-center justify-center px-4 py-10 lg:min-h-screen">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 font-display text-sm font-extrabold text-primary transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.6} />
            Volver
          </Link>

          <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            ¡Hola de nuevo! 👋
          </h1>
          <p className="mt-1.5 mb-8 font-semibold text-muted-foreground">
            Ingresa a tu cuenta para continuar aprendiendo
          </p>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Correo */}
            <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
              <input
                className="w-full bg-transparent font-semibold text-foreground outline-none placeholder:text-muted-foreground/70"
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={form.correo}
                onChange={handleChange}
                onFocus={() => setMood("point")}
                onBlur={() => setMood("idle")}
                required
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <Lock className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
              <input
                className="w-full bg-transparent font-semibold text-foreground outline-none placeholder:text-muted-foreground/70"
                type={mostrarPass ? "text" : "password"}
                name="contrasena"
                placeholder="Contraseña"
                value={form.contrasena}
                onChange={handleChange}
                onFocus={() => setMood("peek")}
                onBlur={() => setMood("idle")}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setMostrarPass((v) => !v)}
                aria-label={mostrarPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarPass ? (
                  <EyeOff className="h-5 w-5" strokeWidth={2.4} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={2.4} />
                )}
              </button>
            </div>

            {error && (
              <p role="alert" className="text-sm font-bold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className={cn(
                "w-full rounded-full bg-primary py-3.5 font-display text-lg font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform",
                "hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
              )}
            >
              {cargando ? "Entrando..." : "¡Entrar! 🚀"}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            <a
              href="#"
              className="block text-sm font-bold text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
            <p className="text-sm font-semibold text-muted-foreground">
              ¿Aún no tienes cuenta?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
