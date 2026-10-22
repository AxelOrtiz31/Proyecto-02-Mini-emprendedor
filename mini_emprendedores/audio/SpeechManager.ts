export function speak(text: string) {
  const synth = window.speechSynthesis;

  // Cancela cualquier voz que se este reproduciendo para reproducir la nueva
  synth.cancel();

  // Funcion para agregar voces, de momento hay dos y la predeterminada si fallan
  function reproducirConVoz() {
    const voices = synth.getVoices();

    const vozJorge = voices.find((voice) => voice.name.includes("Jorge"));
    const vozGonzalo = voices.find((voice) => voice.name.includes("Gonzalo"));
    const vozRaul = voices.find((voice) => voice.name.includes("Raul"));

    const utterance = new SpeechSynthesisUtterance(text);

    if (vozJorge) {
      utterance.voice = vozJorge;
    } else if (vozGonzalo) {
      utterance.voice = vozGonzalo;
    } else if (vozRaul) {
      utterance.voice = vozRaul;
    }

    utterance.lang = "es-MX";

    if (vozJorge || vozGonzalo) {
      utterance.rate = 0.9;
      utterance.volume = 0.5;
    } else if (vozRaul) {
      utterance.rate = 0.9;
      utterance.volume = 1.2;
    }

    synth.speak(utterance);
  }

  const voces = synth.getVoices();

  // Esto es para evitar que se reproduzca la voz antes de que se carguen las voces disponibles
  if (voces.length > 0) {
    reproducirConVoz();
  } else {
    const cargarVoces = () => {
      if (synth.getVoices().length > 0) {
        synth.removeEventListener("voiceschanged", cargarVoces);

        reproducirConVoz();
      }
    };

    synth.addEventListener("voiceschanged", cargarVoces);
  }
}
