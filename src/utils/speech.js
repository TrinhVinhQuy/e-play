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
 * queue: đọc nối tiếp câu đang đọc thay vì cắt ngang.
 */
export function speak(text, { force = false, rate = 0.8, pitch = 1, queue = false } = {}) {
  if (!canSpeak || (!store.sound && !force)) return
  if (!queue) speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  if (voice) u.voice = voice
  u.rate = rate
  u.pitch = pitch
  speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak) speechSynthesis.cancel()
}
