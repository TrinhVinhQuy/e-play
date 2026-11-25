<script setup>
// MATCHING: chạm một hình rồi chạm từ tương ứng (hoặc ngược lại)
import { ref, reactive, onBeforeUnmount } from 'vue'
import { WORD } from '../curriculum'
import { shuffle } from '../../utils/questions'
import { speak, stopSpeaking } from '../../utils/speech'
import { sfx } from '../../utils/sound'
import FeedbackBar from './FeedbackBar.vue'

const props = defineProps({ step: Object })
const emit = defineEmits(['answer', 'done'])

const pics = shuffle(props.step.words)
const words = shuffle(props.step.words)
const matched = reactive(new Set())
const mistakes = reactive({})
const sel = ref(null) // { side: 'pic'|'word', en }
const shake = ref(null)
const finished = ref(false)

function tap(side, en) {
  if (matched.has(en) || finished.value) return
  if (!sel.value || sel.value.side === side) {
    sel.value = { side, en }
    sfx.click()
    if (side === 'pic') speak(en)
    return
  }
  // Đã chọn một bên, giờ chọn bên còn lại
  const a = sel.value.en
  sel.value = null
  if (a === en) {
    matched.add(en)
    sfx.correct()
    speak(en)
    emit('answer', { en, ok: !mistakes[en] })
    if (matched.size === props.step.words.length) finished.value = true
  } else {
    const picEn = side === 'pic' ? en : a
    mistakes[picEn] = (mistakes[picEn] || 0) + 1
    sfx.wrong()
    shake.value = [a, en]
    setTimeout(() => (shake.value = null), 450)
  }
}

const isSel = (side, en) => sel.value?.side === side && sel.value.en === en
const isShake = (en) => shake.value?.includes(en)

onBeforeUnmount(stopSpeaking)
</script>

<template>
  <div class="match">
    <div class="cols">
      <div class="col">
        <button
          v-for="en in pics"
          :key="'p' + en"
          class="item pic"
          :class="{ done: matched.has(en), sel: isSel('pic', en), shake: isShake(en) }"
          @click="tap('pic', en)"
        >
          {{ WORD[en].emoji }}
        </button>
      </div>
      <div class="col">
        <button
          v-for="en in words"
          :key="'w' + en"
          class="item word"
          :class="{ done: matched.has(en), sel: isSel('word', en), shake: isShake(en) }"
          @click="tap('word', en)"
        >
          {{ en }}
        </button>
      </div>
    </div>

    <FeedbackBar v-if="finished" ok title="Ghép đúng hết rồi! 🎉" text="Bạn giỏi quá!" @next="emit('done')" />
  </div>
</template>

<style scoped>
.match { padding-bottom: 90px; display: flex; justify-content: center; }
.cols { width: 100%; max-width: 560px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.col { display: flex; flex-direction: column; gap: 12px; }
.item {
  min-height: 72px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.12), inset 0 0 0 4px #dfe4ea;
  font-weight: 800;
  transition: transform 0.12s, opacity 0.3s, box-shadow 0.15s;
}
.pic { font-size: 2.8rem; }
.word { font-size: clamp(1.2rem, 4.5vw, 1.7rem); color: var(--ink); }
.item.sel { box-shadow: 0 6px 0 rgba(0, 0, 0, 0.12), inset 0 0 0 5px var(--blue); background: #eaf4ff; transform: scale(1.04); }
.item.done { background: #e8fbef; box-shadow: inset 0 0 0 4px var(--green); opacity: 0.55; transform: scale(0.96); }
.item.shake { box-shadow: inset 0 0 0 5px var(--red); }
</style>
