"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Module_04Page.module.css";

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

/* ─── Datos ─────────────────────────────────────────── */
const ACT1_OPCIONES: OpcionMC[] = [
  { emoji: "🎨", texto: "Colores, nombre, logo y slogan que hacen único a tu negocio", correcta: true },
  { emoji: "📦", texto: "El inventario de productos que tienes en bodega", correcta: false },
  { emoji: "💸", texto: "Cuánto dinero tienes para gastar", correcta: false },
];

const COLORES_DATOS = [
  { emoji: "🔴", nombre: "Rojo", sensacion: "Energía y urgencia", ejemplo: "Promociones, comida" },
  { emoji: "🔵", nombre: "Azul", sensacion: "Confianza y calma", ejemplo: "Tecnología, finanzas" },
  { emoji: "🟢", nombre: "Verde", sensacion: "Naturaleza y salud", ejemplo: "Ecológico, bienestar" },
  { emoji: "🟡", nombre: "Amarillo", sensacion: "Alegría y creatividad", ejemplo: "Infantil, diversión" },
  { emoji: "🟣", nombre: "Morado", sensacion: "Misterio y lujo", ejemplo: "Joyería, spa" },
  { emoji: "🟠", nombre: "Naranja", sensacion: "Aventura y entusiasmo", ejemplo: "Deportes, juventud" },
];

const SLOGANS_PARES = [
  { negocio: "🍪 Galletas artesanales", slogan: '"Hechas con amor, saboreadas con alegría"' },
  { negocio: "🎨 Camisetas pintadas", slogan: '"Viste tu personalidad"' },
  { negocio: "🌱 Plantas en macetas", slogan: '"Un pedacito de naturaleza para ti"' },
];

const ACT4_OPCIONES: OpcionMC[] = [
  { emoji: "✅", texto: "Corta, fácil de recordar y que refleja la esencia del negocio", correcta: true },
  { emoji: "📝", texto: "Larga y con muchos detalles técnicos del producto", correcta: false },
  { emoji: "🤫", texto: "Secreta, para que nadie la copie", correcta: false },
];

/* ─── Componente ────────────────────────────────────── */
export default function Module04Page() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");

  /* Act 1 */
  const [act1Sel, setAct1Sel] = useState<number | null>(null);
  const [act1Verificada, setAct1Verificada] = useState(false);

  /* Act 2 — elige colores */
  const [coloresElegidos, setColoresElegidos] = useState<number[]>([]);
  const [act2Listo, setAct2Listo] = useState(false);

  function toggleColor(i: number) {
    setColoresElegidos((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      if (prev.length >= 2) return prev;
      return [...prev, i];
    });
  }

  /* Act 3 — emparejar slogans */
  const [act3Sel, setAct3Sel] = useState<number | null>(null);
  const [act3Matched, setAct3Matched] = useState<number[]>([]);
  const [act3Correcto, setAct3Correcto] = useState(false);

  function handleAct3Left(i: number) {
    if (act3Matched.includes(i)) return;
    setAct3Sel(i);
  }
  function handleAct3Right(i: number) {
    if (act3Sel === null) return;
    if (act3Sel === i && !act3Matched.includes(i)) {
      const next = [...act3Matched, i];
      setAct3Matched(next);
      setAct3Sel(null);
      if (next.length === SLOGANS_PARES.length) setAct3Correcto(true);
    } else {
      setAct3Sel(null);
    }
  }

  /* Act 4 */
  const [act4Sel, setAct4Sel] = useState<number | null>(null);
  const [act4Verificada, setAct4Verificada] = useState(false);

  function goNext(nextStep: Step) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFinish() {
    router.push("/modules01_06_complete/modulecomplete?lesson=module04");
  }

  /* ── Intro ── */
  if (step === "intro") {
    return (
      <main className={styles.root}>
        <div className={styles.dotGrid} aria-hidden="true" />
        <div className={styles.card}>
          <div className={styles.moduleLabel}>Módulo 4</div>
          <div className={styles.heroEmoji} aria-hidden="true">🎨</div>
          <h1 className={styles.title}>¡Le doy color a mi negocio!</h1>
          <p className={styles.subtitle}>
            El nombre, los colores y el slogan son la <strong>identidad</strong> de tu negocio.
            ¡Hacen que las personas te recuerden y confíen en ti!
          </p>
          <ul className={styles.objectives}>
            <li>🎨 Descubrir qué es la identidad de marca</li>
            <li>🌈 Aprender qué transmiten los colores</li>
            <li>✨ Crear el slogan de tu negocio</li>
          </ul>
          <div className={styles.mascotRow}>
            <div className={styles.bubble}>
              ¡Una marca poderosa hace que todos te recuerden! 🌟
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

  /* ── Act 1 ── */
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
            🤔 ¿Qué es la <strong>identidad de marca</strong> de un negocio?
          </h2>
          <div className={styles.optionsList}>
            {ACT1_OPCIONES.map((op, i) => {
              const selected = sel === i;
              const show = act1Verificada;
              return (
                <button
                  key={i}
                  className={`${styles.option} ${
                    show
                      ? op.correcta ? styles.optionCorrect : selected ? styles.optionWrong : ""
                      : selected ? styles.optionSelected : ""
                  }`}
                  onClick={() => !act1Verificada && setAct1Sel(i)}
                  disabled={act1Verificada}
                >
                  <span className={styles.optionEmoji}>{op.emoji}</span>
                  <span className={styles.optionText}>{op.texto}</span>
                  {show && op.correcta && <span className={styles.checkIcon}>✓</span>}
                  {show && selected && !op.correcta && <span className={styles.crossIcon}>✗</span>}
                </button>
              );
            })}
          </div>
          {act1Verificada && (
            <div className={`${styles.feedback} ${ACT1_OPCIONES[sel!]?.correcta ? styles.feedbackOk : styles.feedbackFail}`}>
              <span className={styles.feedbackIcon} aria-hidden="true">
                {ACT1_OPCIONES[sel!]?.correcta ? "🎉" : "💡"}
              </span>
              <p>
                {ACT1_OPCIONES[sel!]?.correcta
                  ? "¡Correcto! La identidad de marca es todo lo visual y verbal que hace reconocible a tu negocio."
                  : "La identidad de marca incluye los elementos visuales y comunicativos que hacen único a tu negocio, ¡no el inventario!"}
              </p>
            </div>
          )}
          {!act1Verificada ? (
            <button className={styles.btnPrimary} disabled={sel === null} onClick={() => setAct1Verificada(true)}>
              Verificar ✓
            </button>
          ) : (
            <button className={styles.btnPrimary} onClick={() => goNext("act2")}>Continuar →</button>
          )}
        </div>
      </main>
    );
  }

  /* ── Act 2 — El mundo de los colores ── */
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
          <div className={styles.activityTag}>¡Elige tu paleta!</div>
          <h2 className={styles.question}>
            🌈 Cada color transmite algo diferente. Explora el significado
            de cada uno y <strong>elige hasta 2 colores</strong> para tu negocio.
          </h2>
          <div className={styles.coloresGrid}>
            {COLORES_DATOS.map((col, i) => {
              const selected = coloresElegidos.includes(i);
              return (
                <button
                  key={i}
                  className={`${styles.colorCard} ${selected ? styles.colorCardSelected : ""}`}
                  onClick={() => !act2Listo && toggleColor(i)}
                  disabled={act2Listo}
                >
                  <span className={styles.colorEmoji}>{col.emoji}</span>
                  <span className={styles.colorNombre}>{col.nombre}</span>
                  <span className={styles.colorSensacion}>{col.sensacion}</span>
                  <span className={styles.colorEjemplo}>Ej: {col.ejemplo}</span>
                  {selected && <span className={styles.colorCheck}>✓</span>}
                </button>
              );
            })}
          </div>
          {coloresElegidos.length > 0 && (
            <div className={styles.seleccionBox}>
              <p className={styles.seleccionLabel}>🎨 Tus colores elegidos:</p>
              <div className={styles.seleccionRow}>
                {coloresElegidos.map((i) => (
                  <span key={i} className={styles.seleccionChip}>
                    {COLORES_DATOS[i].emoji} {COLORES_DATOS[i].nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
          {act2Listo && (
            <div className={`${styles.feedback} ${styles.feedbackOk}`}>
              <span className={styles.feedbackIcon} aria-hidden="true">🌈</span>
              <p>
                ¡Excelente elección! Los colores que eliges comunican la personalidad de tu negocio a tus clientes.
              </p>
            </div>
          )}
          {!act2Listo ? (
            <button
              className={styles.btnPrimary}
              disabled={coloresElegidos.length === 0}
              onClick={() => setAct2Listo(true)}
            >
              {coloresElegidos.length > 0 ? `¡Estos son mis colores! (${coloresElegidos.length}/2)` : "Elige al menos 1 color"}
            </button>
          ) : (
            <button className={styles.btnPrimary} onClick={() => goNext("act3")}>Continuar →</button>
          )}
        </div>
      </main>
    );
  }

  /* ── Act 3 — Emparejar slogans ── */
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
          <div className={styles.activityTag}>Empareja</div>
          <h2 className={styles.question}>
            ✨ Une cada negocio con su <strong>slogan</strong>.
            Toca el negocio y luego su slogan.
          </h2>
          <div className={styles.matchGrid}>
            <div className={styles.matchCol}>
              {SLOGANS_PARES.map((par, i) => (
                <button
                  key={i}
                  className={`${styles.matchItem} ${
                    act3Sel === i ? styles.matchItemSelected :
                    act3Matched.includes(i) ? styles.matchItemDone : ""
                  }`}
                  onClick={() => !act3Correcto && handleAct3Left(i)}
                  disabled={act3Correcto}
                >
                  {par.negocio}
                  {act3Matched.includes(i) && <span className={styles.checkIcon}>✓</span>}
                </button>
              ))}
            </div>
            <div className={styles.matchArrow} aria-hidden="true">⟷</div>
            <div className={styles.matchCol}>
              {SLOGANS_PARES.map((par, i) => (
                <button
                  key={i}
                  className={`${styles.matchItem} ${styles.matchItemSlogan} ${
                    act3Sel !== null && !act3Matched.includes(i) ? styles.matchItemHighlight :
                    act3Matched.includes(i) ? styles.matchItemDone : ""
                  }`}
                  onClick={() => !act3Correcto && handleAct3Right(i)}
                  disabled={act3Correcto}
                >
                  {par.slogan}
                </button>
              ))}
            </div>
          </div>
          {act3Correcto && (
            <div className={`${styles.feedback} ${styles.feedbackOk}`}>
              <span className={styles.feedbackIcon} aria-hidden="true">🏆</span>
              <p>¡Increíble! Un buen slogan describe perfectamente lo que hace especial a cada negocio.</p>
            </div>
          )}
          <button className={styles.btnPrimary} disabled={!act3Correcto} onClick={() => goNext("act4")}>
            {act3Correcto ? "Continuar →" : "Empareja todos los slogans"}
          </button>
        </div>
      </main>
    );
  }

  /* ── Act 4 ── */
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
            🤔 ¿Cómo debe ser un buen <strong>slogan</strong>?
          </h2>
          <div className={styles.optionsList}>
            {ACT4_OPCIONES.map((op, i) => {
              const selected = sel === i;
              const show = act4Verificada;
              return (
                <button
                  key={i}
                  className={`${styles.option} ${
                    show
                      ? op.correcta ? styles.optionCorrect : selected ? styles.optionWrong : ""
                      : selected ? styles.optionSelected : ""
                  }`}
                  onClick={() => !act4Verificada && setAct4Sel(i)}
                  disabled={act4Verificada}
                >
                  <span className={styles.optionEmoji}>{op.emoji}</span>
                  <span className={styles.optionText}>{op.texto}</span>
                  {show && op.correcta && <span className={styles.checkIcon}>✓</span>}
                  {show && selected && !op.correcta && <span className={styles.crossIcon}>✗</span>}
                </button>
              );
            })}
          </div>
          {act4Verificada && (
            <div className={`${styles.feedback} ${ACT4_OPCIONES[sel!]?.correcta ? styles.feedbackOk : styles.feedbackFail}`}>
              <span className={styles.feedbackIcon} aria-hidden="true">
                {ACT4_OPCIONES[sel!]?.correcta ? "🌟" : "💡"}
              </span>
              <p>
                {ACT4_OPCIONES[sel!]?.correcta
                  ? "¡Perfecto! Un slogan corto, memorable y con la esencia de tu negocio es la clave para que todos te recuerden."
                  : "Un buen slogan es corto, fácil de recordar y captura la esencia de tu negocio. ¡Así lo recuerda todo el mundo!"}
              </p>
            </div>
          )}
          {!act4Verificada ? (
            <button className={styles.btnPrimary} disabled={sel === null} onClick={() => setAct4Verificada(true)}>
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

  /* ── Complete ── */
  return (
    <main className={styles.root}>
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={`${styles.card} ${styles.cardComplete}`}>
        <div className={styles.completeBadge} aria-hidden="true">🎨</div>
        <div className={styles.completeUnlocked}>INSIGNIA DESBLOQUEADA</div>
        <h1 className={styles.completeTitle}>¡Módulo 4 completado!</h1>
        <p className={styles.completeSubtitle}>¡Le doy color a mi negocio!</p>
        <div className={styles.xpBox}>
          <span className={styles.xpLabel}>¡Ganaste!</span>
          <span className={styles.xpAmount}>+150 ⭐</span>
        </div>
        <div className={styles.learnedBox}>
          <p className={styles.learnedTitle}>📚 Lo que aprendiste:</p>
          <ul className={styles.learnedList}>
            <li>Qué es la identidad de marca</li>
            <li>El significado de los colores en los negocios</li>
            <li>Cómo emparejar slogans con negocios</li>
            <li>Las características de un buen slogan</li>
          </ul>
        </div>
        <div className={styles.mascotRow}>
          <span className={styles.mascot} aria-hidden="true">🤖</span>
          <div className={styles.bubble}>
            ¡Tu negocio ahora tiene cara, colores y una frase para siempre! 🌟
          </div>
        </div>
        <button className={styles.btnPrimary} onClick={handleFinish}>
          Concluir lección 🎉
        </button>
      </div>
    </main>
  );
}
