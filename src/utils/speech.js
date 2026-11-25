// Đọc từ tiếng Anh bằng giọng nói có sẵn của trình duyệt (Web Speech API)
import { store } from '../store'

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

let voice = null
function pickVoice() {
  const vs = speechSynthesis.getVoices()
  voice =
    vs.find((v) => /^en[-_]US/i.test(v.lang) && /Google|Samantha|Aria|Jenny|Ava/i.test(v.name)) ||
    vs.find((v) => /^en[-_]US/i.test(v.lang)) ||
    vs.find((v) => /^en/i.test(v.lang)) ||
    null
}
if (canSpeak) {
  pickVoice()
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice)
}

/**
 * Đọc to một từ. Tự động đọc thì tôn trọng nút tắt tiếng;
 * bé bấm nút loa (force) thì luôn đọc.
 */
export function speak(text, { force = false, rate = 0.8 } = {}) {
  if (!canSpeak || (!store.sound && !force)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  if (voice) u.voice = voice
  u.rate = rate
  speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak) speechSynthesis.cancel()
}
