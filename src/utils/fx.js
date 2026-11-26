// Hiệu ứng pháo hoa toàn màn hình (component Fireworks.vue hiển thị)
import { reactive } from 'vue'

const COLORS = ['#ff4757', '#ffa502', '#ffd93d', '#2ed573', '#1e90ff', '#a55eea', '#ff6b81', '#ffffff']

export const fx = reactive({ bursts: [] })

let nextId = 1

function burst() {
  const id = nextId++
  const base = Math.floor(Math.random() * COLORS.length)
  const n = 34
  const particles = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.15
    const r = 110 + Math.random() * 70
    return {
      dx: Math.cos(angle) * r,
      dy: Math.sin(angle) * r + 25, // hơi rơi xuống như có trọng lực
      angle: (angle * 180) / Math.PI, // tia hướng ra ngoài
      color: COLORS[(base + (i % 3)) % COLORS.length],
      size: 7 + Math.random() * 5
    }
  })
  fx.bursts.push({
    id,
    x: 15 + Math.random() * 70, // % chiều ngang
    y: 12 + Math.random() * 40, // % chiều dọc
    particles
  })
  setTimeout(() => {
    const i = fx.bursts.findIndex((b) => b.id === id)
    if (i >= 0) fx.bursts.splice(i, 1)
  }, 1400)
}

/** Bắn n chùm pháo hoa, cách nhau một chút */
export function fireworks(n = 3, onBurst) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      burst()
      onBurst?.()
    }, i * 260)
  }
}
