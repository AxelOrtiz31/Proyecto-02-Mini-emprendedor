"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>¡Hola, emprendedor! 👋</h1>
      <p style={{ color: "#666" }}>Aquí irá el dashboard de EmprendeKids.</p>
      <Link
        href="/"
        style={{ background: "#6d5ddb", color: "#fff", padding: "0.75rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: 700 }}
      >
        ← Volver al inicio
      </Link>
    </main>
  );
}
