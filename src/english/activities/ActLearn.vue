<script setup>
// Warm-up + Learn: thẻ từ có hình, nghĩa và phát âm
import { ref, computed, onMounted } from 'vue'
import { WORD } from '../curriculum'
import { markSeen } from '../progress'
import { speak } from '../../utils/speech'
import { sfx } from '../../utils/sound'

const props = defineProps({ step: Object })
const emit = defineEmits(['done'])

const i = ref(0)
const w = computed(() => WORD[props.step.words[i.value]])
const last = computed(() => i.value === props.step.words.length - 1)

function say(force = false) {
  speak(w.value.en, { force })
}
function show(n) {
  i.value = n
  markSeen(w.value.en)
  sfx.click()
  setTimeout(() => say(), 250)
}
function nextCard() {
  if (last.value) emit('done')
  else show(i.value + 1)
}
onMounted(() => show(0))
</script>

<template>
  <div class="learn">
    <div class="dots">
      <span v-for="(_, k) in step.words" :key="k" :class="{ on: k === i, seen: k < i }" />
    </div>

    <button :key="i" class="card flash pop-in" @click="say(true)">
      <span class="emoji">{{ w.emoji }}</span>
      <span class="en">{{ w.en }}</span>
      <span class="vi">{{ w.vi }}</span>
      <span class="tap">🔊 Chạm để nghe</span>
    </button>

    <div class="nav">
      <button class="btn white" :disabled="i === 0" @click="show(i - 1)">◀</button>
      <button class="btn green big" @click="nextCard">{{ last ? 'Mình nhớ rồi! ✔' : 'Từ tiếp theo ▶' }}</button>
    </div>
  </div>
</template>

<style scoped>
.learn { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.dots { display: flex; gap: 8px; }
.dots span { width: 14px; height: 14px; border-radius: 50%; background: rgba(255, 255, 255, 0.6); }
.dots .seen { background: var(--green); }
.dots .on { background: #fff; box-shadow: 0 0 0 3px var(--green); }
.flash {
  width: min(100%, 360px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 5px solid #fff;
  outline: 4px dashed var(--wc, #2ed573);
  outline-offset: -14px;
  padding: 28px 18px;
}
.emoji { font-size: clamp(6rem, 22vw, 8.5rem); line-height: 1.1; }
.en { font-size: clamp(2.6rem, 9vw, 3.4rem); font-weight: 800; color: var(--ink); }
.vi { font-size: 1.4rem; font-weight: 700; color: #57606f; }
.tap { margin-top: 6px; color: #a4b0be; font-weight: 700; }
.nav { display: flex; gap: 12px; }
.big { font-size: 1.4rem; padding: 14px 30px; }
</style>
