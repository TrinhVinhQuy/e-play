import { store } from '../store'

let ctx
function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, start, dur, type = 'sine', vol = 0.2) {
  const c = ac()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0.0001, c.currentTime + start)
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + start)
  o.stop(c.currentTime + start + dur + 0.05)
}

const play = (fn) => {
  if (!store.sound) return
  try {
    fn()
  } catch {
    /* trình duyệt không hỗ trợ âm thanh */
  }
}

export const sfx = {
  click: () => play(() => tone(660, 0, 0.08, 'triangle', 0.15)),
  correct: () =>
    play(() => {
      tone(523, 0, 0.15, 'triangle')
      tone(659, 0.1, 0.15, 'triangle')
      tone(784, 0.2, 0.25, 'triangle')
    }),
  wrong: () =>
    play(() => {
      tone(220, 0, 0.2, 'sawtooth', 0.08)
      tone(180, 0.15, 0.25, 'sawtooth', 0.08)
    }),
  pop: () => play(() => tone(900, 0, 0.06, 'square', 0.1)),
  win: () =>
    play(() => {
      ;[523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.2, 'triangle'))
    })
}
