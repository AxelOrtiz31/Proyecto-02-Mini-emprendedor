"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ correo: "", contrasena: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aquí irá la lógica de autenticación con BD en el futuro
    console.log("Login:", form);
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
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            ¡Entrar! 🚀
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
