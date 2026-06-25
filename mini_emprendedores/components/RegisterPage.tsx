  "use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./RegisterPage.module.css";
import { supabase } from "@/lib/supabase";

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function changeEdad(delta: number) {
    setForm((prev) => ({
      ...prev,
      edad: Math.min(18, Math.max(5, prev.edad + delta)),
    }));
  }

  function validar() {
    const errores: Record<string, string> = {};
    if (!form.nombre.trim()) errores.nombre = "El nombre es obligatorio";
    if (!form.apellido.trim()) errores.apellido = "El apellido es obligatorio";
    if (!form.correo.trim()) errores.correo = "El correo es obligatorio";
    if (!form.contrasena) errores.contrasena = "La contraseña es obligatoria";
    else if (form.contrasena.length < 6) errores.contrasena = "Mínimo 6 caracteres";
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

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.correo,
      password: form.contrasena,
      options: {
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          edad: form.edad,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setCargando(false);
      return;
    }

    setCargando(false);
    router.push("/dashboard");
  }

  return (
    <main className={styles.root}>
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.card}>
        {/* Volver */}
        <Link href="/" className={styles.backLink}>
          <span className={styles.backArrow}>←</span> Volver
        </Link>

        {/* Encabezado */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              ¡Crear cuenta! <span className={styles.titleSpark}>✨</span>
            </h1>
            <p className={styles.subtitle}>Únete y empieza tu aventura emprendedora</p>
          </div>
          <span className={styles.mascot} aria-hidden="true">🤖</span>
        </div>

        {/* Caja de bienvenida */}
        <div className={styles.welcomeBox}>
          ¡Vas a ser un gran emprendedor! 🐻<br />
          Rellena tus datos para empezar.
        </div>

        {/* Formulario */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Nombre */}
          <div className={`${styles.fieldWrapper} ${camposError.nombre ? styles.fieldWrapperError : ""}`}>
            <span className={styles.fieldIcon}>👤</span>
            <input
              className={styles.input}
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              autoComplete="given-name"
            />
          </div>
          {camposError.nombre && <p className={styles.fieldError}>{camposError.nombre}</p>}

          {/* Apellido */}
          <div className={`${styles.fieldWrapper} ${camposError.apellido ? styles.fieldWrapperError : ""}`}>
            <span className={styles.fieldIcon}>👥</span>
            <input
              className={styles.input}
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              autoComplete="family-name"
            />
          </div>
          {camposError.apellido && <p className={styles.fieldError}>{camposError.apellido}</p>}

          {/* Correo */}
          <div className={`${styles.fieldWrapper} ${camposError.correo ? styles.fieldWrapperError : ""}`}>
            <span className={styles.fieldIcon}>📧</span>
            <input
              className={styles.input}
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {camposError.correo && <p className={styles.fieldError}>{camposError.correo}</p>}

          {/* Contraseña */}
          <div className={`${styles.fieldWrapper} ${camposError.contrasena ? styles.fieldWrapperError : ""}`}>
            <span className={styles.fieldIcon}>🔒</span>
            <input
              className={styles.input}
              type={mostrarPass ? "text" : "password"}
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setMostrarPass((v) => !v)}
              aria-label={mostrarPass ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarPass ? "🙈" : "👁️"}
            </button>
          </div>
          {camposError.contrasena && <p className={styles.fieldError}>{camposError.contrasena}</p>}

          {/* Edad */}
          <div className={styles.ageField}>
            <span className={styles.fieldIcon}>🎂</span>
            <span className={styles.ageLabel}>Edad</span>
            <div className={styles.ageControls}>
              <button
                type="button"
                className={styles.ageBtn}
                onClick={() => changeEdad(-1)}
                aria-label="Reducir edad"
              >
                −
              </button>
              <span className={styles.ageValue}>{form.edad}</span>
              <button
                type="button"
                className={styles.ageBtn}
                onClick={() => changeEdad(1)}
                aria-label="Aumentar edad"
              >
                +
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={cargando}>
            {cargando ? "Creando cuenta..." : "¡Listo! 🎉"}
          </button>
        </form>

        {/* Link a login */}
        <p className={styles.loginLink}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
