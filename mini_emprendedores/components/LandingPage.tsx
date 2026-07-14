"use client";

import Link from "next/link";
import { Check, Lightbulb, Sparkles, Star, TrendingUp, Trophy } from "lucide-react";
import { RobotBuddy } from "@/components/Login/RobotBuddy";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Retícula de puntos sutil, como fondo de pizarra */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Manchas de color de la paleta */}
      <div aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-primary/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-12 px-6 py-14 lg:flex-row lg:gap-8 lg:py-0">
        {/* Izquierda: marca, mensaje y acciones */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-border bg-card shadow-(--shadow-card)">
            <img src="/caelus.svg" alt="" width={52} height={52} className="h-13 w-13" />
          </div>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight sm:text-6xl">
            <span className="text-foreground">Emprende</span>
            <span className="text-primary">Kids</span>
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-info px-3 py-1 font-display text-xs font-extrabold uppercase tracking-widest text-info-foreground">
              IA
            </span>
            <span className="flex items-center gap-1 rounded-full border-2 border-accent bg-accent/25 px-3 py-1 font-display text-xs font-extrabold uppercase tracking-widest text-accent-foreground">
              <Sparkles className="h-3 w-3" /> ¡Nuevo!
            </span>
          </div>

          <p className="mt-4 max-w-md text-lg font-semibold text-muted-foreground">
            Aprende a emprender paso a paso con retos divertidos, tu robot
            acompañante y un camino lleno de sorpresas.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-3.5 font-display text-lg font-extrabold uppercase tracking-wider text-primary-foreground shadow-(--shadow-node) transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="flex flex-1 items-center justify-center rounded-full bg-accent px-6 py-3.5 font-display text-lg font-extrabold uppercase tracking-wider text-accent-foreground shadow-(--shadow-node-accent) transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Registrarse
            </Link>
          </div>
        </div>

        {/* Derecha: robot, mini-camino y tarjetas flotantes */}
        <div
          className="relative h-105 w-full max-w-xl lg:h-140 lg:w-1/2"
          aria-hidden="true"
        >
          {/* Mini-camino de nodos con huellas */}
          <svg
            viewBox="0 0 400 480"
            className="absolute inset-0 h-full w-full"
            fill="none"
          >
            <g
              stroke="var(--color-success)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="2 14"
              opacity="0.6"
            >
              <path d="M84 128 Q60 210 96 300" />
              <path d="M96 340 Q120 400 190 424" />
            </g>
          </svg>

          {/* Nodos del mini-camino */}
          <PathNode className="left-[12%] top-[18%]" state="done" />
          <PathNode className="left-[15%] top-[58%]" state="done" />
          <PathNode className="left-[42%] top-[84%]" state="current" />

          {/* Robot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <RobotBuddy mood="idle" className="h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
          </div>

          {/* Tarjetas flotantes estilo dashboard */}
          <FeatureCard
            className="left-0 top-0 animate-mascot"
            icon={<Lightbulb className="h-4 w-4" strokeWidth={2.6} />}
            iconClass="bg-accent/40 text-accent-foreground"
            label="Ideas de negocio"
          />
          <FeatureCard
            className="right-0 top-[30%] animate-mascot [animation-delay:0.6s]"
            icon={<TrendingUp className="h-4 w-4" strokeWidth={2.6} />}
            iconClass="bg-info/15 text-info"
            label="Aprende finanzas"
          />
          <FeatureCard
            className="right-[8%] bottom-[6%] animate-mascot [animation-delay:1.2s]"
            icon={<Trophy className="h-4 w-4" strokeWidth={2.6} />}
            iconClass="bg-primary/15 text-primary"
            label="Gana retos"
          />
        </div>
      </div>
    </main>
  );
}

// Nodo del mini-camino, con el mismo estilo de los nodos del dashboard.
function PathNode({
  className,
  state,
}: {
  className: string;
  state: "done" | "current";
}) {
  const isDone = state === "done";

  return (
    <div
      className={`absolute flex h-14 w-14 items-center justify-center rounded-full ${className} ${
        isDone
          ? "bg-gradient-to-b from-success to-[oklch(0.66_0.16_155)] text-success-foreground [box-shadow:var(--shadow-node-success)]"
          : "bg-gradient-to-b from-primary to-[oklch(0.64_0.18_45)] text-primary-foreground [box-shadow:var(--shadow-node)] animate-node-bounce"
      }`}
    >
      {isDone ? (
        <Check className="h-7 w-7" strokeWidth={2.6} />
      ) : (
        <Star className="h-7 w-7" strokeWidth={2.6} />
      )}
    </div>
  );
}

// Tarjetita flotante con icono, estilo tarjetas del panel del dashboard.
function FeatureCard({
  className,
  icon,
  iconClass,
  label,
}: {
  className: string;
  icon: React.ReactNode;
  iconClass: string;
  label: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-2xl border-2 border-border bg-card px-4 py-2.5 shadow-(--shadow-card) ${className}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </span>
      <span className="whitespace-nowrap font-display text-sm font-extrabold text-foreground">
        {label}
      </span>
    </div>
  );
}
