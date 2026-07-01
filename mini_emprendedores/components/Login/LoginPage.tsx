"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);

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

    setCargando(false);
    router.push("/dashboard");
  }

  return (
    <main className={styles.root}>
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.card}>
        {/* Volver */}
        <Link href="/" className={styles.backLink}>
          ← Volver
        </Link>

        {/* Título */}
        <h1 className={styles.title}>¡Hola de nuevo! 👋</h1>
        <p className={styles.subtitle}>Ingresa a tu cuenta para continuar aprendiendo</p>

        {/* Formulario */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Correo */}
          <div className={styles.fieldWrapper}>
            <span className={styles.fieldIcon}>📧</span>
            <input
              className={styles.input}
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          {/* Contraseña */}
          <div className={styles.fieldWrapper}>
            <span className={styles.fieldIcon}>🔒</span>
            <input
              className={styles.input}
              type={mostrarPass ? "text" : "password"}
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              autoComplete="current-password"
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

          {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={cargando}>
            {cargando ? "Entrando..." : "¡Entrar! 🚀"}
          </button>
        </form>

        <a href="#" className={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
      </div>

      {/* Mascota con burbuja */}
      <div className={styles.mascotArea} aria-hidden="true">
        <div className={styles.bubble}>¡Te esperaba! Entremos juntos 😊</div>
        <span className={styles.mascot}>🤖</span>
      </div>
    </main>
  );
}
