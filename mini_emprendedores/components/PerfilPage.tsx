import React from 'react';
import styles from './PerfilPage.module.css';

export default function PerfilPage() {
  return (
    <div className={styles.root}>
      {/* Capa del patrón de puntos */}
      <div className={styles.dotGrid} />

      <div className={styles.contentWrapper}>
        
        {/* TÍTULO PRINCIPAL */}
        <h1 className={styles.title}>¡Mis Logros! 🏆</h1>

        {/* PROGRESO DE NIVEL */}
        <div className={styles.card}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-[#1e1465]">Nivel 3 – Mini Emprendedor</span>
            <span className="text-lg font-bold text-[#f59e0b] flex items-center gap-1">
              320 ⭐
            </span>
          </div>
          <div className="w-full bg-[#e8e8f0] h-4 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#6d5ddb] to-[#4da6ff] h-full w-[64%] rounded-full" />
          </div>
          <p className="text-gray-400 text-xs mt-2 font-semibold">180 puntos para el siguiente nivel</p>
        </div>

        {/* PANEL DE RACHAS */}
        <div className={styles.card}>
          <h3 className={styles.subtitulo}>📅 Racha esta semana — 3 días 🔥</h3>
          <div className={styles.gridDias}>
            {[
              { dia: 'L', activo: true },
              { dia: 'M', activo: true },
              { dia: 'M', activo: true },
              { dia: 'J', activo: false },
              { dia: 'V', activo: false },
              { dia: 'S', activo: false },
              { dia: 'D', activo: false },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-gray-400 font-bold text-xs">{item.dia}</span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                    item.activo
                      ? 'bg-[#fcd34d] text-white shadow-sm ring-4 ring-[#fef3c7]'
                      : 'bg-[#f3f4f6] text-gray-300'
                  }`}
                >
                  {item.activo ? '⭐' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN SUPERPODERES */}
        <div className="mb-6">
          <h3 className={styles.subtitulo}>⚡ Mis Superpoderes</h3>
          <div className="flex gap-3">
            <span className="bg-[#fff0f6] text-[#db2777] border-2 border-[#f472b6] px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm">
              🎨 Creatividad
            </span>
            <span className="bg-[#fff7ed] text-[#ea580c] border-2 border-[#fb923c] px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm">
              ⚡ Iniciativa
            </span>
          </div>
        </div>

        {/* SECCIÓN INSIGNIAS */}
        <div>
          <h3 className={styles.subtitulo}>🏅 Insignias</h3>
          <div className={styles.gridInsignias}>
            
            <div className={styles.card}>
              <div className="flex flex-col items-center text-center justify-between min-h-[160px] h-full">
                <span className="text-4xl mb-1">💡</span>
                <h4 className="font-bold text-[#1e1465] text-sm">¡Primera idea!</h4>
                <p className="text-gray-400 text-xs px-1 mb-2">Módulo 2 listo</p>
                <button className={styles.submitBtn}>Obtenida ✓</button>
              </div>
            </div>

            <div className={styles.card}>
              <div className="flex flex-col items-center text-center justify-between min-h-[160px] h-full">
                <span className="text-4xl mb-1">🔥</span>
                <h4 className="font-bold text-[#1e1465] text-sm">Racha de 3 días</h4>
                <p className="text-gray-400 text-xs px-1 mb-2">3 días seguidos</p>
                <button className={styles.submitBtn}>Obtenida ✓</button>
              </div>
            </div>

            <div className={styles.card}>
              <div className="flex flex-col items-center text-center justify-between min-h-[160px] h-full opacity-50">
                <span className="text-4xl mb-1 grayscale">🦁</span>
                <h4 className="font-bold text-[#1e1465] text-sm">Emprendedor</h4>
                <p className="text-gray-400 text-xs px-1 mb-2">Faltan 3 módulos</p>
                <div className="h-8" />
              </div>
            </div>

            <div className={styles.card}>
              <div className="flex flex-col items-center text-center justify-between min-h-[160px] h-full opacity-50">
                <span className="text-4xl mb-1 grayscale">🏆</span>
                <h4 className="font-bold text-[#1e1465] text-sm">Gran Líder</h4>
                <p className="text-gray-400 text-xs px-1 mb-2">Finaliza el curso</p>
                <div className="h-8" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MASCOTA ANIMADA INTEGRADA (Estilo Login) */}
      <div className={styles.mascotArea}>
        <div className={styles.bubble}>¡Estás haciendo un gran trabajo! Sigue así 🚀</div>
        <div className={styles.mascot}>🦄</div>
      </div>

    </div>
  );
}