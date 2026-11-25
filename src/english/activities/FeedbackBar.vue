<script setup>
// Thanh phản hồi sau mỗi câu trả lời: xanh khi đúng, cam khi sai (không trừ điểm)
defineProps({
  ok: Boolean,
  title: String,
  text: String
})
defineEmits(['next'])
</script>

<template>
  <Transition name="slide-up">
    <div class="feedback" :class="ok ? 'good' : 'bad'">
      <div class="msg">
        <b>{{ title }}</b>
        <span v-if="text">{{ text }}</span>
      </div>
      <button class="btn" :class="ok ? 'green' : ''" @click="$emit('next')">Tiếp tục ▶</button>
    </div>
  </Transition>
</template>

<style scoped>
.feedback {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px max(16px, calc((100vw - 900px) / 2)) calc(16px + env(safe-area-inset-bottom));
  border-top: 4px solid;
  animation: rise 0.25s ease-out;
}
@keyframes rise {
  from { transform: translateY(100%); }
}
.good { background: #e8fbef; border-color: #2ed573; color: #1e8e4a; }
.bad { background: #fff4e5; border-color: #ffa502; color: #b35c00; }
.msg { display: flex; flex-direction: column; }
.msg b { font-size: 1.5rem; }
.msg span { font-size: 1.2rem; font-weight: 700; color: var(--ink); }
</style>
