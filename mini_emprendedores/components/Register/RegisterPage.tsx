"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Cake,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Minus,
  Plus,
  Presentation,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { RobotBuddy, type RobotMood } from "@/components/Login/RobotBuddy";

type Rol = "alumno" | "maestro";

type Grupo = {
  id: string;
  nombre: string;
};

// TODO(BD): reemplazar esta lista por una búsqueda real contra la base de
// datos (por ejemplo una consulta a Supabase que filtre por `busquedaGrupo`).
// Por ahora es un mock para poder armar la interfaz.
const GRUPOS_MOCK: Grupo[] = [
  { id: "g1", nombre: "3° A - Primaria Juárez" },
  { id: "g2", nombre: "4° B - Primaria Juárez" },
  { id: "g3", nombre: "5° A - Colegio Nueva Era" },
  { id: "g4", nombre: "6° C - Colegio Nueva Era" },
  { id: "g5", nombre: "2° A - Instituto Aurora" },
  { id: "g6", nombre: "1° B - Instituto Aurora" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    edad: 11,
  });
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);
  const [camposError, setCamposError] = useState<Record<string, string>>({});
  // Campo con foco y celebración: definen el estado del robot y su burbuja.
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [celebrando, setCelebrando] = useState(false);

  // Rol (alumno / maestro) y su/sus grupo(s).
  const [rol, setRol] = useState<Rol | null>(null);
  const [busquedaGrupo, setBusquedaGrupo] = useState("");
  const [mostrarListaGrupos, setMostrarListaGrupos] = useState(false);
  const [grupoAlumno, setGrupoAlumno] = useState<Grupo | null>(null);
  const [gruposMaestro, setGruposMaestro] = useState<Grupo[]>([]);

  const grupoFiltrados = GRUPOS_MOCK.filter((g) =>
    g.nombre.toLowerCase().includes(busquedaGrupo.trim().toLowerCase()),
  );

  const mood: RobotMood = celebrando
    ? "happy"
    : focusedField === "contrasena"
      ? "peek"
      : focusedField
        ? "point"
        : "idle";

  function bubbleText(): string {
    if (celebrando) return "¡Yujuu! Bienvenido a bordo 🎉";

    switch (focusedField) {
      case "nombre":
        return form.nombre.trim()
          ? `¡Mucho gusto, ${form.nombre.trim()}!`
          : "¿Cómo te llamas?";
      case "apellido":
        return "¡Escribe tu apellido ahí!";
      case "correo":
        return "Ahora tu correo ✉️";
      case "contrasena":
        return "Prometo no ver tu contraseña 🙈";
      case "edad":
        return "¿Cuántos años tienes?";
      case "rol":
        return "¿Eres alumno o maestro?";
      case "grupo":
        return rol === "maestro"
          ? "Busca y elige tus grupos"
          : "Busca tu grupo";
      default:
        return "¡Vas a ser un gran emprendedor!";
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function changeEdad(delta: number) {
    setFocusedField("edad");
    setForm((prev) => ({
      ...prev,
      edad: Math.min(12, Math.max(10, prev.edad + delta)),
    }));
  }

  function elegirRol(nuevoRol: Rol) {
    setRol(nuevoRol);
    // Al cambiar de rol reiniciamos la selección de grupo(s) para evitar
    // mandar datos que ya no aplican (p. ej. varios grupos si pasa a alumno).
    setGrupoAlumno(null);
    setGruposMaestro([]);
    setBusquedaGrupo("");
    setCamposError((prev) => ({ ...prev, rol: "", grupo: "" }));
  }

  function seleccionarGrupoAlumno(grupo: Grupo) {
    setGrupoAlumno(grupo);
    setBusquedaGrupo("");
    setMostrarListaGrupos(false);
    setCamposError((prev) => ({ ...prev, grupo: "" }));
  }

  function toggleGrupoMaestro(grupo: Grupo) {
    setGruposMaestro((prev) =>
      prev.some((g) => g.id === grupo.id)
        ? prev.filter((g) => g.id !== grupo.id)
        : [...prev, grupo],
    );
    setCamposError((prev) => ({ ...prev, grupo: "" }));
  }

  function quitarGrupoMaestro(id: string) {
    setGruposMaestro((prev) => prev.filter((g) => g.id !== id));
  }

  function validar() {
    const errores: Record<string, string> = {};
    if (!form.nombre.trim()) errores.nombre = "El nombre es obligatorio";
    if (!form.apellido.trim()) errores.apellido = "El apellido es obligatorio";
    if (!form.correo.trim()) errores.correo = "El correo es obligatorio";
    if (!form.contrasena) errores.contrasena = "La contraseña es obligatoria";
    else if (form.contrasena.length < 6) errores.contrasena = "Mínimo 6 caracteres";
    if (!rol) errores.rol = "Elige si eres alumno o maestro";
    if (rol === "alumno" && !grupoAlumno)
      errores.grupo = "Busca y selecciona tu grupo";
    if (rol === "maestro" && gruposMaestro.length === 0)
      errores.grupo = "Selecciona al menos un grupo";
    return errores;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errores = validar();
    if (Object.keys(errores).length > 0) {
      setCamposError(errores);
      return;
    }
    setCamposError({});
    setCargando(true);
    setCelebrando(true);

    const { error: authError } = await supabase.auth.signUp({
      email: form.correo,
      password: form.contrasena,
      options: {
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          edad: form.edad,
          rol,
          // TODO(BD): una vez conectada la búsqueda real, aquí viajarán los
          // ids reales del/los grupo(s) elegidos.
          grupo_id: rol === "alumno" ? grupoAlumno?.id ?? null : null,
          grupos_ids: rol === "maestro" ? gruposMaestro.map((g) => g.id) : [],
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setCargando(false);
      setCelebrando(false);
      return;
    }

    setCargando(false);
    router.push("/login");
  }

  const inputWrapper = (hasError: boolean) =>
    cn(
      "flex items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 transition-all focus-within:ring-4",
      hasError
        ? "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/15"
        : "border-border focus-within:border-primary focus-within:ring-primary/15",
    );

  const inputClass =
    "w-full bg-transparent font-semibold text-foreground outline-none placeholder:text-muted-foreground/70";

  return (
    <main className="flex min-h-screen flex-col-reverse bg-background lg:flex-row">
      {/* Mitad izquierda: formulario */}
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
            ¡Crear cuenta! ✨
          </h1>
          <p className="mt-1.5 mb-7 font-semibold text-muted-foreground">
            Únete y empieza tu aventura emprendedora
          </p>

          <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div>
              <div className={inputWrapper(Boolean(camposError.nombre))}>
                <User className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
                <input
                  className={inputClass}
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("nombre")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="given-name"
                />
              </div>
              {camposError.nombre && <FieldError text={camposError.nombre} />}
            </div>

            {/* Apellido */}
            <div>
              <div className={inputWrapper(Boolean(camposError.apellido))}>
                <Users className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
                <input
                  className={inputClass}
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("apellido")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="family-name"
                />
              </div>
              {camposError.apellido && <FieldError text={camposError.apellido} />}
            </div>

            {/* Correo */}
            <div>
              <div className={inputWrapper(Boolean(camposError.correo))}>
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
                <input
                  className={inputClass}
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={form.correo}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("correo")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                />
              </div>
              {camposError.correo && <FieldError text={camposError.correo} />}
            </div>

            {/* Contraseña */}
            <div>
              <div className={inputWrapper(Boolean(camposError.contrasena))}>
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
                <input
                  className={inputClass}
                  type={mostrarPass ? "text" : "password"}
                  name="contrasena"
                  placeholder="Contraseña"
                  value={form.contrasena}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("contrasena")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="new-password"
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
              {camposError.contrasena && <FieldError text={camposError.contrasena} />}
            </div>

            {/* Edad */}
            <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-2.5">
              <Cake className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
              <span className="flex-1 font-semibold text-foreground">Edad</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeEdad(-1)}
                  aria-label="Reducir edad"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent/40"
                >
                  <Minus className="h-4 w-4" strokeWidth={2.6} />
                </button>
                <span className="w-8 text-center font-display text-xl font-extrabold text-foreground">
                  {form.edad}
                </span>
                <button
                  type="button"
                  onClick={() => changeEdad(1)}
                  aria-label="Aumentar edad"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent/40"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.6} />
                </button>
              </div>
            </div>

            {/* Tipo de cuenta: alumno o maestro */}
            <div>
              <p className="mb-2 pl-1 text-sm font-bold text-foreground">
                ¿Eres alumno o maestro?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => elegirRol("alumno")}
                  onFocus={() => setFocusedField("rol")}
                  onBlur={() => setFocusedField(null)}
                  aria-pressed={rol === "alumno"}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3.5 font-display text-sm font-extrabold transition-all",
                    rol === "alumno"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <GraduationCap className="h-6 w-6" strokeWidth={2.4} />
                  Soy alumno
                </button>
                <button
                  type="button"
                  onClick={() => elegirRol("maestro")}
                  onFocus={() => setFocusedField("rol")}
                  onBlur={() => setFocusedField(null)}
                  aria-pressed={rol === "maestro"}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3.5 font-display text-sm font-extrabold transition-all",
                    rol === "maestro"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <Presentation className="h-6 w-6" strokeWidth={2.4} />
                  Soy maestro
                </button>
              </div>
              {camposError.rol && <FieldError text={camposError.rol} />}
            </div>

            {/* Grupo (alumno = uno, maestro = varios) */}
            {rol && (
              <div>
                <p className="mb-2 pl-1 text-sm font-bold text-foreground">
                  {rol === "alumno" ? "Tu grupo" : "Tus grupos"}
                </p>

                {/* Chips de grupos elegidos (maestro) */}
                {rol === "maestro" && gruposMaestro.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {gruposMaestro.map((g) => (
                      <span
                        key={g.id}
                        className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
                      >
                        {g.nombre}
                        <button
                          type="button"
                          onClick={() => quitarGrupoMaestro(g.id)}
                          aria-label={`Quitar ${g.nombre}`}
                          className="text-primary/70 transition-colors hover:text-primary"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2.6} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Grupo elegido (alumno) */}
                {rol === "alumno" && grupoAlumno && (
                  <div className="mb-2 flex items-center justify-between rounded-2xl border-2 border-primary bg-primary/10 px-4 py-3">
                    <span className="font-semibold text-primary">
                      {grupoAlumno.nombre}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGrupoAlumno(null)}
                      aria-label="Quitar grupo"
                      className="text-primary/70 transition-colors hover:text-primary"
                    >
                      <X className="h-4 w-4" strokeWidth={2.6} />
                    </button>
                  </div>
                )}

                {/* Buscador de grupo(s): el alumno lo oculta una vez que ya eligió el suyo */}
                {(rol === "maestro" || !grupoAlumno) && (
                  <div className="relative">
                    <div className={inputWrapper(Boolean(camposError.grupo))}>
                      <Search
                        className="h-5 w-5 shrink-0 text-muted-foreground"
                        strokeWidth={2.4}
                      />
                      <input
                        className={inputClass}
                        type="text"
                        placeholder={
                          rol === "maestro" ? "Busca tus grupos" : "Busca tu grupo"
                        }
                        value={busquedaGrupo}
                        onChange={(e) => setBusquedaGrupo(e.target.value)}
                        onFocus={() => {
                          setFocusedField("grupo");
                          setMostrarListaGrupos(true);
                        }}
                        onBlur={() => {
                          // pequeño respiro para que el click en la lista se
                          // registre antes de que se cierre por el blur
                          setTimeout(() => setMostrarListaGrupos(false), 150);
                          setFocusedField(null);
                        }}
                      />
                    </div>

                    {mostrarListaGrupos && (
                      <div className="absolute z-20 mt-1.5 max-h-48 w-full overflow-y-auto rounded-2xl border-2 border-border bg-card p-1.5 shadow-(--shadow-card)">
                        {grupoFiltrados.length === 0 ? (
                          <p className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                            No encontramos ese grupo
                          </p>
                        ) : (
                          grupoFiltrados.map((g) => {
                            const yaElegido =
                              rol === "maestro"
                                ? gruposMaestro.some((x) => x.id === g.id)
                                : grupoAlumno?.id === g.id;
                            return (
                              <button
                                key={g.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() =>
                                  rol === "maestro"
                                    ? toggleGrupoMaestro(g)
                                    : seleccionarGrupoAlumno(g)
                                }
                                className={cn(
                                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
                                  yaElegido
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-secondary",
                                )}
                              >
                                {g.nombre}
                                {yaElegido && (
                                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.6} />
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}

                {camposError.grupo && <FieldError text={camposError.grupo} />}
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm font-bold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className={cn(
                "w-full rounded-full bg-success py-3.5 font-display text-lg font-extrabold uppercase tracking-wider text-success-foreground shadow-(--shadow-node-success) transition-transform",
                "hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
              )}
            >
              {cargando ? "Creando cuenta..." : "¡Listo! 🎉"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>

      {/* Mitad derecha: robot que te acompaña mientras te registras */}
      <section className="relative flex items-center justify-center overflow-hidden bg-secondary px-6 py-10 lg:min-h-screen lg:w-1/2 lg:py-0">
        <div aria-hidden="true">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/25" />
          <div className="absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-primary/10" />
          <div className="absolute left-14 top-20 h-6 w-6 rounded-full bg-primary/25" />
          <div className="absolute bottom-28 right-12 h-4 w-4 rounded-full bg-accent/50" />
          <div className="absolute right-24 top-1/3 h-3 w-3 rounded-full bg-success/30" />
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="absolute right-5 top-5 flex items-center gap-2 lg:right-8 lg:top-7"
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
              {bubbleText()}
            </div>
            <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-border bg-card" />
          </div>

          {/* Espejado para que al apuntar señale hacia el formulario (izquierda) */}
          <div className="-scale-x-100">
            <RobotBuddy
              mood={mood}
              className="h-64 w-64 sm:h-80 sm:w-80 lg:h-[32rem] lg:w-[32rem]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FieldError({ text }: { text: string }) {
  return <p className="mt-1 pl-2 text-xs font-bold text-red-600">{text}</p>;
}
