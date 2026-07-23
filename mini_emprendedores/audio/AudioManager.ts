import { Howl } from "howler";
import { bgm, sfx } from "./sounds";

let currentMusic: Howl | null = null;
let currentTrack: keyof typeof bgm | null = null;
let musicMuted = false;

export function playMusic(track: keyof typeof bgm) {
  if (currentTrack === track) {
    // Si ya está sonando, no volver a llamar a play(): Howler solo reanuda
    // una instancia si la encuentra pausada; si no, crea una nueva y queda
    // sonando encimada con la anterior (la música se "duplica"). Esto pasaba
    // al navegar entre rutas que comparten pista (p. ej. "/" y "/login", las
    // dos con "home") o en desarrollo por el doble efecto de StrictMode.
    if (!musicMuted && !currentMusic?.playing()) {
      currentMusic?.play();
    }
    return;
  }

  currentMusic?.stop();

  currentMusic = bgm[track];
  currentTrack = track;

  if (!musicMuted) {
    currentMusic.play();
  }
}

export function stopMusic() {
  currentMusic?.stop();
  currentTrack = null;
}

// Silencia/activa la música sin importar si ya hay una pista cargada: el
// botón siempre debe reflejar y aplicar el estado correctamente, incluso
// antes de que playMusic() se haya llamado por primera vez.
export function toggleMusic() {
  musicMuted = !musicMuted;

  if (musicMuted) {
    currentMusic?.pause();
  } else {
    currentMusic?.play();
  }
}

export function isMusicMuted() {
  return musicMuted;
}

export function playSfx(sound: keyof typeof sfx) {
  sfx[sound].play();
}
