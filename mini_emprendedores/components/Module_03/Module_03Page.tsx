"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Module_03Page.module.css";

/* ─── Tipos ─────────────────────────────────────────── */
type Step =
  | "intro"
  | "act1"
  | "act2"
  | "act3"
  | "act4"
  | "complete";

interface OpcionMC {
  emoji: string;
  texto: string;
  correcta: boolean;
}

/* ─── Datos de actividades ──────────────────────────── */
const ACT1_OPCIONES: OpcionMC[] = [
  { emoji: "👶", texto: "Niños de 6 a 10 años que aman los dulces", correcta: true },
  { emoji: "👴", texto: "Abuelos de 80 años con dieta estricta", correcta: false },
  { emoji: "🐶", texto: "Mascotas del vecindario", correcta: false },
];

const ACT2_PARES = [
  { negocio: "🍪 Venta de galletas caseras", cliente: "👦 Niños y papás en recreo escolar" },
  { negocio: "🎨 Pintura de camisetas", cliente: "👗 Jóvenes que quieren ropa única" },
  { negocio: "🌱 Plantas en macetitas", cliente: "🏠 Personas que decoran su hogar" },
  { negocio: "📚 Separadores artesanales", cliente: "📖 Estudiantes que aman leer" },
];

const ACT3_PREGUNTAS = [
  "¿Cuántos años tiene tu cliente ideal?",
  "¿Qué problema o necesidad tiene tu cliente?",
  "¿Dónde puedes encontrar a tus clientes?",
];

const ACT4_OPCIONES: OpcionMC[] = [
  { emoji: "📣", texto: "Conocerlos bien para ofrecerles exactamente lo que necesitan", correcta: true },
  { emoji: "😴", texto: "No importa, cualquiera comprará tu producto", correcta: false },
  { emoji: "🤷", texto: "Para hablar con ellos y ya", correcta: false },
];

/* ─── Componente ────────────────────────────────────── */
export default function Module03Page() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");

  /* Act 1 — opción múltiple */
  const [act1Sel, setAct1Sel] = useState<number | null>(null);
  const [act1Verificada, setAct1Verificada] = useState(false);

  /* Act 2 — emparejar */
  const [act2Sel, setAct2Sel] = useState<number | null>(null);
  const [act2Matched, setAct2Matched] = useState<number[]>([]);
  const [act2Correcto, setAct2Correcto] = useState(false);

  /* Act 3 — escritura libre */
  const [act3Respuestas, setAct3Respuestas] = useState(["", "", ""]);
  const act3Completa = act3Respuestas.every((r) => r.trim().length >= 3);

  /* Act 4 — opción múltiple final */
  const [act4Sel, setAct4Sel] = useState<number | null>(null);
  const [act4Verificada, setAct4Verificada] = useState(false);

  /* ── navegación ── */
  function goNext(nextStep: Step) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFinish() {
    router.push("/modules01_06_complete/modulecomplete?lesson=s3-u1-a1");
  }

  /* ── Act 2 lógica ── */
  function handleAct2Left(i: number) {
    if (act2Matched.includes(i)) return;
    setAct2Sel(i);
  }
  function handleAct2Right(i: number) {
    if (act2Sel === null) return;
    if (act2Sel === i && !act2Matched.includes(i)) {
      const next = [...act2Matched, i];
      setAct2Matched(next);
      setAct2Sel(null);
      if (next.length === ACT2_PARES.length) setAct2Correcto(true);
    } else {
      setAct2Sel(null);
    }
  }

  /* ── renders por step ── */

  if (step === "intro") {
    return (
      <main className={styles.root}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <div className={styles.card}>
          <div className={styles.moduleLabel}>Módulo 3</div>
          <div className={styles.heroEmoji} aria-hidden="true">👥</div>
          <h1 className={styles.title}>¿Quién es mi cliente?</h1>
          <p className={styles.subtitle}>
            Todo negocio exitoso empieza por conocer a las personas que van a
            comprar tu producto o servicio. ¡Descúbrelo aquí!
          </p>
          <ul className={styles.objectives}>
            <li>🎯 Identificar quién es tu cliente ideal</li>
            <li>🔍 Aprender a describir a tu cliente</li>
            <li>💡 Entender por qué conocer a tu cliente importa</li>
          </ul>
          <div className={styles.mascotRow}>
            <div className={styles.bubble}>
              ¡Conocer a tu cliente es tu superpoder de ventas! 🚀
            </div>
            <span className={styles.mascot} aria-hidden="true">🤖</span>
          </div>
          <button className={styles.btnPrimary} onClick={() => goNext("act1")}>
            ¡Empezar! →
          </button>
        </div>
      </main>
    );
  }

  if (step === "act1") {
    const sel = act1Sel;
    return (
      <main className={styles.root}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <div className={styles.card}>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Actividad 1 de 4</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "25%" }} />
            </div>
          </div>
          <div className={styles.activityTag}>Opción múltiple</div>
          <h2 className={styles.question}>
            🍬 Valentina vende postres artesanales en su escuela.
            ¿Cuál sería su <strong>cliente ideal</strong>?
          </h2>
          <div className={styles.optionsList}>
            {ACT1_OPCIONES.map((op, i) => {
              const selected = sel === i;
              const showResult = act1Verificada;
              return (
                <button
                  key={i}
                  className={`${styles.option} ${
                    showResult
                      ? op.correcta
                        ? styles.optionCorrect
                        : selected
                        ? styles.optionWrong
                        : ""
                      : selected
                      ? styles.optionSelected
                      : ""
                  }`}
                  onClick={() => !act1Verificada && setAct1Sel(i)}
                  disabled={act1Verificada}
                >
                  <span className={styles.optionEmoji}>{op.emoji}</span>
                  <span className={styles.optionText}>{op.texto}</span>
                  {showResult && op.correcta && (
                    <span className={styles.checkIcon}>✓</span>
                  )}
                  {showResult && selected && !op.correcta && (
                    <span className={styles.crossIcon}>✗</span>
                  )}
                </button>
              );
            })}
          </div>
          {act1Verificada ? (
            <div
              className={`${styles.feedback} ${
                ACT1_OPCIONES[sel!]?.correcta ? styles.feedbackOk : styles.feedbackFail
              }`}
            >
              <span className={styles.feedbackIcon} aria-hidden="true">
                {ACT1_OPCIONES[sel!]?.correcta ? "🎉" : "💡"}
              </span>
              <p>
                {ACT1_OPCIONES[sel!]?.correcta
                  ? "¡Exacto! Los niños y sus familias son los clientes perfectos para postres en la escuela."
                  : "¡Casi! El cliente ideal es quien más necesita o disfruta tu producto. Para postres escolares, ¡son los niños!"}
              </p>
            </div>
          ) : null}
          {!act1Verificada ? (
            <button
              className={styles.btnPrimary}
              disabled={sel === null}
              onClick={() => setAct1Verificada(true)}
            >
              Verificar ✓
            </button>
          ) : (
            <button className={styles.btnPrimary} onClick={() => goNext("act2")}>
              Continuar →
            </button>
          )}
        </div>
      </main>
    );
  }

  if (step === "act2") {
    return (
      <main className={styles.root}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <div className={styles.card}>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Actividad 2 de 4</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "50%" }} />
            </div>
          </div>
          <div className={styles.activityTag}>Empareja</div>
          <h2 className={styles.question}>
            🔗 Une cada negocio con su <strong>cliente ideal</strong>.
            Toca la izquierda y luego la derecha.
          </h2>
          <div className={styles.matchGrid}>
            <div className={styles.matchCol}>
              {ACT2_PARES.map((par, i) => (
                <button
                  key={i}
                  className={`${styles.matchItem} ${
                    act2Sel === i
                      ? styles.matchItemSelected
                      : act2Matched.includes(i)
                      ? styles.matchItemDone
                      : ""
                  }`}
                  onClick={() => !act2Correcto && handleAct2Left(i)}
                  disabled={act2Correcto}
                >
                  {par.negocio}
                  {act2Matched.includes(i) && (
                    <span className={styles.checkIcon}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className={styles.matchArrow} aria-hidden="true">⟷</div>
            <div className={styles.matchCol}>
              {ACT2_PARES.map((par, i) => (
                <button
                  key={i}
                  className={`${styles.matchItem} ${
                    act2Sel !== null && !act2Matched.includes(i)
                      ? styles.matchItemHighlight
                      : act2Matched.includes(i)
                      ? styles.matchItemDone
                      : ""
                  }`}
                  onClick={() => !act2Correcto && handleAct2Right(i)}
                  disabled={act2Correcto}
                >
                  {par.cliente}
                </button>
              ))}
            </div>
          </div>
          {act2Correcto && (
            <div className={`${styles.feedback} ${styles.feedbackOk}`}>
              <span className={styles.feedbackIcon} aria-hidden="true">🏆</span>
              <p>¡Perfecto! Cada negocio tiene un cliente especial. Conocerlo te ayuda a vender mejor.</p>
            </div>
          )}
          <button
            className={styles.btnPrimary}
            disabled={!act2Correcto}
            onClick={() => goNext("act3")}
          >
            {act2Correcto ? "Continuar →" : "Empareja todos los pares"}
          </button>
        </div>
      </main>
    );
  }

  if (step === "act3") {
    return (
      <main className={styles.root}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <div className={styles.card}>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Actividad 3 de 4</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "75%" }} />
            </div>
          </div>
          <div className={styles.activityTag}>¡Crea tu ficha!</div>
          <h2 className={styles.question}>
            🗂️ Completa la <strong>ficha de tu cliente ideal</strong>.
            Piensa en tu negocio y responde.
          </h2>
          <div className={styles.fichaBox}>
            <div className={styles.fichaHeader}>
              <span>👤</span> Mi cliente ideal
            </div>
            {ACT3_PREGUNTAS.map((pregunta, i) => (
              <div key={i} className={styles.fichaField}>
                <label className={styles.fichaLabel}>{pregunta}</label>
                <textarea
                  className={styles.fichaInput}
                  placeholder="Escribe aquí tu respuesta..."
                  value={act3Respuestas[i]}
                  onChange={(e) => {
                    const updated = [...act3Respuestas];
                    updated[i] = e.target.value.slice(0, 120);
                    setAct3Respuestas(updated);
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
          <div className={styles.mascotRow}>
            <div className={styles.bubble}>
              ¡Mientras más detalles pongas, mejor conoces a tu cliente! 🔍
            </div>
            <span className={styles.mascot} aria-hidden="true">🤖</span>
          </div>
          <button
            className={styles.btnPrimary}
            disabled={!act3Completa}
            onClick={() => goNext("act4")}
          >
            {act3Completa ? "Continuar →" : "Responde todas las preguntas"}
          </button>
        </div>
      </main>
    );
  }

  if (step === "act4") {
    const sel = act4Sel;
    return (
      <main className={styles.root}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <div className={styles.card}>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Actividad 4 de 4</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "100%" }} />
            </div>
          </div>
          <div className={styles.activityTag}>Pregunta final</div>
          <h2 className={styles.question}>
            🤔 ¿Por qué es importante conocer bien a tu cliente?
          </h2>
          <div className={styles.optionsList}>
            {ACT4_OPCIONES.map((op, i) => {
              const selected = sel === i;
              const showResult = act4Verificada;
              return (
                <button
                  key={i}
                  className={`${styles.option} ${
                    showResult
                      ? op.correcta
                        ? styles.optionCorrect
                        : selected
                        ? styles.optionWrong
                        : ""
                      : selected
                      ? styles.optionSelected
                      : ""
                  }`}
                  onClick={() => !act4Verificada && setAct4Sel(i)}
                  disabled={act4Verificada}
                >
                  <span className={styles.optionEmoji}>{op.emoji}</span>
                  <span className={styles.optionText}>{op.texto}</span>
                  {showResult && op.correcta && (
                    <span className={styles.checkIcon}>✓</span>
                  )}
                  {showResult && selected && !op.correcta && (
                    <span className={styles.crossIcon}>✗</span>
                  )}
                </button>
              );
            })}
          </div>
          {act4Verificada && (
            <div
              className={`${styles.feedback} ${
                ACT4_OPCIONES[sel!]?.correcta ? styles.feedbackOk : styles.feedbackFail
              }`}
            >
              <span className={styles.feedbackIcon} aria-hidden="true">
                {ACT4_OPCIONES[sel!]?.correcta ? "🌟" : "💡"}
              </span>
              <p>
                {ACT4_OPCIONES[sel!]?.correcta
                  ? "¡Brillante! Conocer a tu cliente te permite crear productos que realmente necesita y comunicarte mejor con él."
                  : "La respuesta correcta es: Conocerlos bien para ofrecerles exactamente lo que necesitan. ¡Así venden más los grandes emprendedores!"}
              </p>
            </div>
          )}
          {!act4Verificada ? (
            <button
              className={styles.btnPrimary}
              disabled={sel === null}
              onClick={() => setAct4Verificada(true)}
            >
              Verificar ✓
            </button>
          ) : (
            <button className={styles.btnPrimary} onClick={() => goNext("complete")}>
              Ver mi resultado 🏆
            </button>
          )}
        </div>
      </main>
    );
  }

  /* ── complete ── */
  return (
    <main className={styles.root}>
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={`${styles.card} ${styles.cardComplete}`}>
        <div className={styles.completeBadge} aria-hidden="true">🏅</div>
        <div className={styles.completeUnlocked}>INSIGNIA DESBLOQUEADA</div>
        <h1 className={styles.completeTitle}>¡Módulo 3 completado!</h1>
        <p className={styles.completeSubtitle}>¿Quién es mi cliente?</p>
        <div className={styles.xpBox}>
          <span className={styles.xpLabel}>¡Ganaste!</span>
          <span className={styles.xpAmount}>+150 ⭐</span>
        </div>
        <div className={styles.learnedBox}>
          <p className={styles.learnedTitle}>📚 Lo que aprendiste:</p>
          <ul className={styles.learnedList}>
            <li>Cómo identificar a tu cliente ideal</li>
            <li>A emparejar negocios con sus clientes</li>
            <li>A crear una ficha de cliente</li>
            <li>Por qué conocer al cliente es clave</li>
          </ul>
        </div>
        <div className={styles.mascotRow}>
          <span className={styles.mascot} aria-hidden="true">🤖</span>
          <div className={styles.bubble}>
            ¡Ya tienes el poder de conocer a tus clientes! 💪
          </div>
        </div>
        <button className={styles.btnPrimary} onClick={handleFinish}>
          Concluir lección 🎉
        </button>
      </div>
    </main>
  );
}
