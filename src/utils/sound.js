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
    }),
  // Tiếng vỗ tay: nhiều tiếng "bốp" ngắn từ nhiễu trắng, dày rồi thưa dần
  applause: (seconds = 1.6) => play(() => applause(seconds)),
  // Tiếng pháo hoa nổ "bụp"
  boom: () =>
    play(() => {
      const c = ac()
      const t = c.currentTime
      const src = c.createBufferSource()
      src.buffer = noiseBuffer(c)
      const f = c.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.setValueAtTime(1800, t)
      f.frequency.exponentialRampToValueAtTime(200, t + 0.4)
      const g = c.createGain()
      g.gain.setValueAtTime(0.25, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
      src.connect(f).connect(g).connect(c.destination)
      src.start(t)
      src.stop(t + 0.5)
    })
}

let noise = null
function noiseBuffer(c) {
  if (noise) return noise
  noise = c.createBuffer(1, c.sampleRate * 1, c.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return noise
}

function applause(seconds) {
  const c = ac()
  const t0 = c.currentTime
  const claps = Math.round(seconds * 22)
  for (let i = 0; i < claps; i++) {
    const p = i / claps
    const t = t0 + p * seconds + Math.random() * 0.05
    const vol = 0.22 * (1 - p * 0.75) * (0.6 + Math.random() * 0.4)
    const src = c.createBufferSource()
    src.buffer = noiseBuffer(c)
    const f = c.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 900 + Math.random() * 1400
    f.Q.value = 1.2
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    src.connect(f).connect(g).connect(c.destination)
    src.start(t, Math.random() * 0.8, 0.09)
  }
}
