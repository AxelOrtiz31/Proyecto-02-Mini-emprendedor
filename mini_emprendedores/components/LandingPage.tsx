import Link from "next/link";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <main className={styles.root}>
      <div className={styles.dotGrid} aria-hidden="true" />

      <span className={`${styles.floatEmoji} ${styles.star}`} aria-hidden="true">⭐</span>
      <span className={`${styles.floatEmoji} ${styles.bulb}`} aria-hidden="true">💡</span>
      <span className={`${styles.floatEmoji} ${styles.money}`} aria-hidden="true">💰</span>
      <span className={`${styles.floatEmoji} ${styles.palette}`} aria-hidden="true">🎨</span>
      <span className={`${styles.floatEmoji} ${styles.fire}`} aria-hidden="true">🔥</span>
      <span className={`${styles.floatEmoji} ${styles.rocketSmall}`} aria-hidden="true">🚀</span>

      <div className={styles.contentWrapper}>
        {/* Sección izquierda */}
        <div className={styles.heroLeft}>
          <div className={styles.appIcon}>
            <span>🚀</span>
          </div>

          <h1 className={styles.brandTitle}>EmprendeKids</h1>

          <div className={styles.badgeRow}>
            <span className={styles.badgeIa}>IA</span>
            <span className={styles.badgeNuevo}>¡NUEVO!</span>
          </div>

          <p className={styles.tagline}>¡Aprende a emprender y cambia el mundo! 🌍</p>

          <div className={styles.ctaGroup}>
            <Link href="/login" className={`${styles.btn} ${styles.btnPrimary}`}>
              Iniciar sesión
            </Link>
            <Link href="/register" className={`${styles.btn} ${styles.btnSecondary}`}>
              Registrarse
            </Link>
          </div>
        </div>

        {/* Sección derecha — mascota */}
        <div className={styles.heroRight} aria-hidden="true">
          <div className={styles.mascotContainer}>
            <span className={styles.mascotEmoji}>🤖</span>
            <div className={styles.mascotGlow} />
          </div>

          <div className={`${styles.featureCard} ${styles.card1}`}>
            <span>💡</span><span>Ideas de negocio</span>
          </div>
          <div className={`${styles.featureCard} ${styles.card2}`}>
            <span>📈</span><span>Aprende finanzas</span>
          </div>
          <div className={`${styles.featureCard} ${styles.card3}`}>
            <span>🏆</span><span>Gana retos</span>
          </div>
        </div>
      </div>
    </main>
  );
}
