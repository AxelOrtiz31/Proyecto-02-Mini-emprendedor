import { bgm, sfx } from "./sounds";

let currentMusic: any = null;
let currentTrack: keyof typeof bgm | null = null;
let musicMuted = false;

export function playMusic(track: keyof typeof bgm) {
  if (musicMuted) return;

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

export function toggleMusic() {
  if (!currentMusic) return;

  if (currentMusic.playing()) {
    currentMusic.pause();
    musicMuted = true;
  } else {
    currentMusic.play();
    musicMuted = false;
  }
}

export function isMusicMuted() {
  return musicMuted;
}

export function playSfx(sound: keyof typeof sfx) {
  sfx[sound].play();
}