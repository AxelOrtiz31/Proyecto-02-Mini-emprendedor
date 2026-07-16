import styles from './PerfilPage.module.css';
import { formatStreakDays } from '@/lib/streak';

const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface StreakWeekPanelProps {
  streak: number;
  weekActivity: boolean[];
}

// Panel de racha del perfil: racha actual y días activos de la semana.
export function StreakWeekPanel({ streak, weekActivity }: StreakWeekPanelProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.subtitulo}>
        📅 Racha actual — {formatStreakDays(streak)} 🔥
      </h3>
      <div className={styles.gridDias}>
        {dayLabels.map((label, index) => {
          const active = weekActivity[index] === true;

          return (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <span className="text-gray-400 font-bold text-xs">{label}</span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                  active
                    ? 'bg-[#fcd34d] text-white shadow-sm ring-4 ring-[#fef3c7]'
                    : 'bg-[#f3f4f6] text-gray-300'
                }`}
              >
                {active ? '⭐' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
