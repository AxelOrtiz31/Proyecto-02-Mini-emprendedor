import { Howl } from "howler";

// Sonidos de fondo
export const bgm = {
  home: new Howl({
    src: ["/audio/home.mp3"],
    loop: true,
    volume: 0.01,
  }),

  dashboard: new Howl({
    src: ["/audio/dashboard.mp3"],
    loop: true,
    volume: 0.01,
  }),

  levels: new Howl({
    src: ["/audio/levels.mp3"],
    loop: true,
    volume: 0.01,
  })
};

// Sonidos de efectos
export const sfx = {
  click: new Howl({
    src: ["/audio/click.mp3"],
    volume: 0.1,
  }),

  urururu: new Howl({
    src: ["/audio/freedy.mp3"],
    volume: 0.1,
  }),
}