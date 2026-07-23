export function speak(text: string) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // const voices = window.speechSynthesis.getVoices();

  // const vozMujer = voices.find(
    // (voice) =>
      // voice.name.includes("Sabina") ||
      // voice.name.includes("Dalia")
  // );

  // if (vozMujer) {
    // utterance.voice = vozMujer;
  // }

  utterance.lang = "es-MX";
  utterance.rate = 0.9;
  utterance.volume = 0.4;

  window.speechSynthesis.speak(utterance);
}