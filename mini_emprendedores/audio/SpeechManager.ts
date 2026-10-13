export function speak(text: string) {
  const synth = window.speechSynthesis;

  // Cancela cualquier voz que se este reproduciendo para reproducir la nueva
  synth.cancel();

  // Funcion para agregar voces, de momento hay dos y la predeterminada si fallan
  function reproducirConVoz() {
    const voices = synth.getVoices();

    const vozMujer = voices.find(
      (voice) => voice.name.includes("Dalia")
    );

    const vozDavid = voices.find(
      (voice) => voice.name.includes("David")
    );

    const utterance = new SpeechSynthesisUtterance(text);

    if (vozMujer) {
      utterance.voice = vozMujer;
    } else if (vozDavid) {
      utterance.voice = vozDavid;
    }

    utterance.lang = "es-MX";
    utterance.rate = 0.9;
    utterance.volume = 0.4;

    synth.speak(utterance);
  }

  const voces = synth.getVoices();

  // Esto es para evitar que se reproduzca la voz antes de que se carguen las voces disponibles
  if (voces.length > 0) {
    reproducirConVoz();
  } else {
    const cargarVoces = () => {
      if (synth.getVoices().length > 0) {
        synth.removeEventListener(
          "voiceschanged",
          cargarVoces
        );

        reproducirConVoz();
      }
    };

    synth.addEventListener("voiceschanged", cargarVoces);
  }
}