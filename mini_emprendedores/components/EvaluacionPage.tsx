'use client';

import React, { useState } from 'react';
import styles from './EvaluacionPage.module.css'; 
// 📝 Esto simulará de forma exacta la respuesta que traerás de Supabase más adelante
const PREGUNTAS_DESDE_BD = [
  {
    id: 1,
    pregunta: '¿Sabes qué es el emprendimiento?',
    burbujaMascota: '¡Lo lograste! Ahora dime cómo te fue 🗺️ ¡Sin miedo!',
    opciones: [
      { texto: 'Sí / Mucho', emoji: '😀', clase: styles.opcionVerde, claseLabel: styles.labelVerde },
      { texto: 'Un poco', emoji: '😐', clase: styles.opcionAmarilla, claseLabel: styles.labelAmarillo },
      { texto: 'No / Nada', emoji: '😔', clase: styles.opcionRoja, claseLabel: styles.labelRojo }
    ]
  },
  {
    id: 2,
    pregunta: '¿Te gustaría iniciar tu propio negocio o proyecto?',
    burbujaMascota: '¡Excelente! Vamos con la siguiente pregunta 🚀',
    opciones: [
      { texto: '¡Me encanta!', emoji: '🚀', clase: styles.opcionVerde, claseLabel: styles.labelVerde },
      { texto: 'Tal vez', emoji: '🤔', clase: styles.opcionAmarilla, claseLabel: styles.labelAmarillo },
      { texto: 'No me llama', emoji: '😴', clase: styles.opcionRoja, claseLabel: styles.labelRojo }
    ]
  }
];

export default function EvaluacionPage() {
  // Estados para manejar dinámicamente la pregunta actual
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = PREGUNTAS_DESDE_BD[currentIndex];

  const handleSeleccion = () => {
    // Si quedan más preguntas, avanzamos. Si no, podríamos redirigir al Dashboard final.
    if (currentIndex < PREGUNTAS_DESDE_BD.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('¡Felicidades, completaste tu evaluación final! 🎉');
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.dotGrid} />

      <div className={styles.contentWrapper}>
        
        {/* MASCOTA Y BURBUJA DINÁMICA */}
        <div className={styles.mascotArea}>
          <div className={styles.bubble}>{currentQuestion.burbujaMascota}</div>
          <div className={styles.mascot}>🤖</div>
        </div>

        <h1 className="text-2xl font-black text-[#1e1465] tracking-wide mb-1">
          ¡Ya eres un mini emprendedor!
        </h1>

        {/* BARRA DE PROGRESO POR PASOS */}
        <div className={styles.progressContainer}>
          {PREGUNTAS_DESDE_BD.map((_, idx) => (
            <div 
              key={idx} 
              className={`${styles.progressStep} ${idx <= currentIndex ? styles.progressStepActive : ''}`} 
            />
          ))}
        </div>

        {/* TARJETA DE PREGUNTA */}
        <div className={styles.preguntaCard}>
          <h2 className={styles.preguntaTexto}>{currentQuestion.pregunta}</h2>
        </div>

        {/* CUADRÍCULA DE OPCIONES */}
        <div className={styles.opcionesGrid}>
          {currentQuestion.opciones.map((opcion, index) => (
            <button 
              key={index} 
              className={`${styles.opcionBtn} ${opcion.clase}`}
              onClick={handleSeleccion}
            >
              <span className={styles.emoji}>{opcion.emoji}</span>
              <span className={`${styles.opcionLabel} ${opcion.claseLabel}`}>
                {opcion.texto}
              </span>
            </button>
          ))}
        </div>

        {/* PIE DE PÁGINA */}
        <span className={styles.footerText}>
          Pregunta {currentIndex + 1} de {PREGUNTAS_DESDE_BD.length}
        </span>

      </div>
    </div>
  );
}