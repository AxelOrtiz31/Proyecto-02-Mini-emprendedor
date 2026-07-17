import { bgm, sfx } from "./sounds";

let currentMusic: any = null;
let currentTrack: keyof typeof bgm | null = null;

export function playMusic(track: keyof typeof bgm) {
  if (currentTrack === track) return;

  currentMusic?.stop();

  currentMusic = bgm[track];
  currentTrack = track;

  currentMusic.play();
}

export function stopMusic() {
  currentMusic?.stop();
  currentTrack = null;
}

export function playSfx(sound: keyof typeof sfx) {
  sfx[sound].play();
}