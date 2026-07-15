export function speak(text: string) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "es-MX";
  utterance.rate = 0.9;

  window.speechSynthesis.speak(utterance);
}