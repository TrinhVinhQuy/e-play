<script setup>
const COLORS = ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#a55eea', '#ffd93d']
const pieces = Array.from({ length: 70 }, (_, i) => ({
  i,
  left: Math.random() * 100,
  delay: Math.random() * 1.5,
  dur: 2.5 + Math.random() * 2,
  color: COLORS[i % COLORS.length],
  size: 8 + Math.random() * 8,
  round: Math.random() < 0.4
}))
</script>

<template>
  <div class="confetti">
    <span
      v-for="p in pieces"
      :key="p.i"
      :style="{
        left: p.left + '%',
        width: p.size + 'px',
        height: p.size * (p.round ? 1 : 1.6) + 'px',
        background: p.color,
        borderRadius: p.round ? '50%' : '3px',
        animationDelay: p.delay + 's',
        animationDuration: p.dur + 's'
      }"
    />
  </div>
</template>

<style scoped>
.confetti { position: fixed; inset: 0; pointer-events: none; z-index: 50; overflow: hidden; }
span {
  position: absolute;
  top: -20px;
  animation: fall linear 2;
}
@keyframes fall {
  to { transform: translateY(110vh) rotate(720deg); }
}
</style>
