import { Howl } from "howler";

// Sonidos de fondo
export const bgm = {
  home: new Howl({
    src: ["/audio/home.mp3"],
    loop: true,
    volume: 0.005,
  }),

  dashboard: new Howl({
    src: ["/audio/dashboard.mp3"],
    loop: true,
    volume: 0.005,
  }),

  levels: new Howl({
    src: ["/audio/levels.mp3"],
    loop: true,
    volume: 0.005,
  }),

  evaluacion: new Howl({
    src: ["/audio/evaluacion.mp3"],
    loop: true,
    volume: 0.005,
  }),

  profile: new Howl({
    src: ["/audio/profile.mp3"],
    loop: true,
    volume: 0.005,
  }),

  achievements: new Howl({
    src: ["/audio/achievements.mp3"],
    loop: true,
    volume: 0.005,
  }),

  module_complete: new Howl({
    src: ["/audio/victory.mp3"],
    loop: true,
    volume: 0.005,
  }),
};

// Sonidos de efectos
export const sfx = {
  click: new Howl({
    src: ["/audio/click.mp3"],
    volume: 0.05,
  }),

  urururu: new Howl({
    src: ["/audio/freedy.mp3"],
    volume: 0.1,
  }),

  opciones: new Howl({
    src: ["/audio/opciones.mp3"],
    volume: 0.05,
  }),
};
