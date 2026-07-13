import { Howl } from "howler";

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
};