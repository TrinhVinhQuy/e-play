// Khen và động viên bằng tiếng Anh cho các trò chơi tiếng Anh
import { speak } from './speech'
import { sfx } from './sound'
import { fireworks } from './fx'
import { pick } from './questions'

export const PRAISE_EN = [
  'Bravo!',
  'Excellent!',
  'Good job!',
  'Well done!',
  'Great job!',
  'Awesome!',
  'Perfect!',
  'Fantastic!',
  'Super!',
  'You did it!'
]

export const ENCOURAGE_EN = ["That's OK! Try one more time!", "That's OK! Try again!", "Don't worry! Try one more time!"]

/**
 * Trả lời đúng: đọc lời khen (rồi đọc lại từ vừa học), vỗ tay và bắn pháo hoa.
 * Trả về câu khen để hiển thị trên màn hình.
 */
export function cheer(word, { bursts = 2 } = {}) {
  const phrase = pick(PRAISE_EN)
  sfx.applause()
  fireworks(bursts, sfx.boom)
  speak(phrase, { pitch: 1.15, rate: 0.95 })
  if (word) speak(word, { queue: true })
  return phrase
}

let lastEncourage = 0
/** Trả lời sai: nhẹ nhàng động viên thử lại (không nói lặp liên tục) */
export function encourage({ force = false } = {}) {
  const phrase = pick(ENCOURAGE_EN)
  const now = Date.now()
  if (force || now - lastEncourage > 2500) {
    lastEncourage = now
    speak(phrase, { rate: 0.9 })
  }
  return phrase
}
