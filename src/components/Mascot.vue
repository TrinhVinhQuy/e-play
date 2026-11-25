<script setup>
defineProps({
  text: { type: String, default: '' },
  mood: { type: String, default: 'happy' }, // happy | sad | cheer
  face: { type: String, default: '🦉' }
})
</script>

<template>
  <div class="mascot" :class="mood">
    <div class="face" :key="text">{{ face }}</div>
    <Transition name="bubble" mode="out-in">
      <div v-if="text" :key="text" class="bubble">{{ text }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.mascot { display: flex; align-items: center; gap: 10px; }
.face {
  font-size: 64px;
  line-height: 1;
  animation: bounce 1.8s ease-in-out infinite;
  filter: drop-shadow(0 6px 0 rgba(0, 0, 0, 0.12));
}
.cheer .face { animation: wiggle 0.5s ease-in-out 2, bounce 1.8s ease-in-out 1s infinite; }
.sad .face { animation: shake 0.45s; filter: grayscale(0.3) drop-shadow(0 6px 0 rgba(0, 0, 0, 0.12)); }
.bubble {
  position: relative;
  background: var(--white);
  border-radius: 20px;
  padding: 10px 18px;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: var(--shadow);
  max-width: 320px;
}
.bubble::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  border: 8px solid transparent;
  border-right: 12px solid var(--white);
}
.bubble-enter-active { animation: pop-in 0.35s ease-out; }
.bubble-leave-active { transition: opacity 0.1s; }
.bubble-leave-to { opacity: 0; }
</style>
