<script setup>
import { fx } from '../utils/fx'
</script>

<template>
  <div class="fireworks" aria-hidden="true">
    <div v-for="b in fx.bursts" :key="b.id" class="burst" :style="{ left: b.x + '%', top: b.y + '%' }">
      <span class="flash" />
      <span
        v-for="(p, i) in b.particles"
        :key="i"
        class="spark"
        :style="{
          '--dx': p.dx + 'px',
          '--dy': p.dy + 'px',
          '--a': p.angle + 'deg',
          width: p.size * 3 + 'px',
          height: p.size + 'px',
          background: `linear-gradient(90deg, transparent, ${p.color} 40%, #fff)`,
          boxShadow: `0 0 10px 2px ${p.color}`
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.fireworks { position: fixed; inset: 0; pointer-events: none; z-index: 60; overflow: hidden; }
.burst { position: absolute; width: 0; height: 0; }
.flash {
  position: absolute;
  left: -40px;
  top: -40px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95), rgba(255, 217, 61, 0.4) 40%, transparent 70%);
  animation: flash 0.5s ease-out forwards;
}
@keyframes flash {
  from { transform: scale(0.2); opacity: 1; }
  to { transform: scale(1.6); opacity: 0; }
}
.spark {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 999px;
  animation: fly 1.25s cubic-bezier(0.12, 0.75, 0.3, 1) forwards;
}
@keyframes fly {
  0% { transform: translate(-50%, -50%) rotate(var(--a)) scale(0.4); opacity: 1; }
  65% { opacity: 1; }
  100% { transform: translate(calc(var(--dx) - 50%), calc(var(--dy) - 50%)) rotate(var(--a)) scale(0.7); opacity: 0; }
}
</style>
