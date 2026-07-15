import styles from './PerfilPage.module.css';

const STREAK_GOAL_DAYS = 3;

interface StreakBadgeCardProps {
  streak: number;
}

// Insignia "Racha de 3 días": se desbloquea al alcanzar la meta.
export function StreakBadgeCard({ streak }: StreakBadgeCardProps) {
  const obtained = streak >= STREAK_GOAL_DAYS;
  const missingDays = STREAK_GOAL_DAYS - streak;

  return (
    <div className={styles.card}>
      <div
        className={`flex flex-col items-center text-center justify-between min-h-[160px] h-full ${
          obtained ? '' : 'opacity-50'
        }`}
      >
        <span className={`text-4xl mb-1 ${obtained ? '' : 'grayscale'}`}>🔥</span>
        <h4 className="font-bold text-[#1e1465] text-sm">Racha de {STREAK_GOAL_DAYS} días</h4>
        <p className="text-gray-400 text-xs px-1 mb-2">
          {obtained
            ? `${STREAK_GOAL_DAYS} días seguidos`
            : `Te ${missingDays === 1 ? 'falta' : 'faltan'} ${missingDays} ${missingDays === 1 ? 'día' : 'días'}`}
        </p>
        {obtained ? (
          <button className={styles.submitBtn}>Obtenida ✓</button>
        ) : (
          <div className="h-8" />
        )}
      </div>
    </div>
  );
}
