"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    edad: 11,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function changeEdad(delta: number) {
    setForm((prev) => ({
      ...prev,
      edad: Math.min(18, Math.max(5, prev.edad + delta)),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aquí irá la lógica de registro con BD en el futuro
    console.log("Datos del registro:", form);
    // Por ahora redirige al inicio
    router.push("/");
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
          <div className={styles.fieldWrapper}>
            <span className={styles.fieldIcon}>👤</span>
            <input
              className={styles.input}
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
          </div>

          {/* Apellido */}
          <div className={styles.fieldWrapper}>
            <span className={styles.fieldIcon}>👥</span>
            <input
              className={styles.input}
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

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

          {/* Submit */}
          <button type="submit" className={styles.submitBtn}>
            ¡Listo! 🎉
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
