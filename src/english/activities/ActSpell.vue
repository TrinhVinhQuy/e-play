<script setup>
// SPELLING: chạm các chữ cái theo đúng thứ tự (có gợi ý hình + âm thanh)
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { WORD } from '../curriculum'
import { shuffle, pick } from '../../utils/questions'
import { speak, stopSpeaking } from '../../utils/speech'
import { sfx } from '../../utils/sound'
import { cheer, encourage } from '../../utils/cheer'
import FeedbackBar from './FeedbackBar.vue'

const props = defineProps({ step: Object })
const emit = defineEmits(['answer', 'done'])

const COLORS = ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#a55eea', '#20bf6b']
const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('')

const i = ref(0)
const filled = ref([])
const tiles = ref([])
const mistakes = ref(0)
const solved = ref(false)
const phrase = ref('')
const retryMsg = ref('')
const w =computed(() => WORD[props.step.words[i.value]])

function setup() {
  filled.value = []
  mistakes.value = 0
  solved.value = false
  retryMsg.value = ''
  const letters = w.value.en.split('')
  for (let k = 0; k < (props.step.extra || 0); k++) letters.push(pick(ABC.filter((c) => !w.value.en.includes(c))))
  tiles.value = shuffle(letters).map((ch, k) => ({ id: i.value + '-' + k, ch, used: false, wrong: false, color: COLORS[k % COLORS.length] }))
  setTimeout(() => speak(w.value.en), 400)
}

function tap(t) {
  if (solved.value || t.used) return
  if (t.ch === w.value.en[filled.value.length]) {
    t.used = true
    filled.value.push(t.ch)
    sfx.pop()
    if (filled.value.length === w.value.en.length) {
      solved.value = true
      phrase.value = cheer(w.value.en)
      emit('answer', { en: w.value.en, ok: mistakes.value <= 1 })
    }
  } else {
    t.wrong = true
    mistakes.value++
    sfx.wrong()
    retryMsg.value = encourage()
    setTimeout(() => (t.wrong = false), 450)
  }
}

function next() {
  sfx.click()
  if (i.value + 1 >= props.step.words.length) return emit('done')
  i.value++
  setup()
}

onMounted(setup)
onBeforeUnmount(stopSpeaking)
</script>

<template>
  <div class="spell">
    <div :key="i" class="card top pop-in">
      <span class="emoji">{{ w.emoji }}</span>
      <div class="meta">
        <span class="vi">{{ w.vi }}</span>
        <button class="listen" @click="speak(w.en, { force: true, rate: 0.7 })">🔊 Nghe</button>
      </div>
    </div>

    <div class="slots">
      <span
        v-for="(ch, k) in w.en"
        :key="k"
        class="slot"
        :class="{ filled: k < filled.length, next: k === filled.length && !solved, hint: mistakes >= 2 && k === filled.length }"
      >
        <template v-if="k < filled.length">{{ filled[k] }}</template>
        <template v-else-if="mistakes >= 2 && k === filled.length">{{ ch }}</template>
      </span>
    </div>

    <p v-if="retryMsg && !solved" :key="'r' + mistakes" class="retry pop-in">💪 {{ retryMsg }}</p>

    <div class="tiles">
      <button
        v-for="t in tiles"
        :key="t.id"
        class="tile"
        :class="{ used: t.used, wrong: t.wrong }"
        :style="{ '--t': t.color }"
        :disabled="t.used || solved"
        @click="tap(t)"
      >
        {{ t.ch }}
      </button>
    </div>

    <FeedbackBar
      v-if="solved"
      ok
      :title="`${phrase} 🎉`"
      :text="`${w.emoji} ${w.en} – ${w.vi}`"
      @next="next"
    />
  </div>
</template>

<style scoped>
.spell { display: flex; flex-direction: column; align-items: center; gap: 18px; padding-bottom: 90px; }
.top { display: flex; align-items: center; gap: 18px; padding: 16px 26px; }
.emoji { font-size: clamp(4.5rem, 16vw, 6rem); line-height: 1.1; }
.meta { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.vi { font-size: 1.5rem; font-weight: 800; color: #57606f; }
.listen { background: var(--purple); color: #fff; font-weight: 800; font-size: 1.2rem; border-radius: 999px; padding: 6px 18px; box-shadow: 0 4px 0 rgba(0, 0, 0, 0.18); }
.slots { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.slot {
  width: clamp(40px, 9vw, 60px);
  height: clamp(50px, 11vw, 70px);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 4px dashed #c8d6e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.7rem, 6vw, 2.6rem);
  font-weight: 800;
}
.slot.next { border-color: var(--purple); animation: bounce 1.2s infinite; }
.slot.hint { color: #c8d6e5; }
.slot.filled { background: #fff; border: 4px solid var(--purple); animation: pop-in 0.3s; }
.retry { margin: 0; background: #fff4e5; color: #b35c00; border: 3px solid #ffa502; border-radius: 999px; padding: 6px 20px; font-size: 1.2rem; font-weight: 800; }
.tiles { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 620px; }
.tile {
  width: clamp(54px, 12vw, 74px);
  height: clamp(54px, 12vw, 74px);
  border-radius: 16px;
  background: var(--t);
  color: #fff;
  font-size: clamp(1.9rem, 6vw, 2.6rem);
  font-weight: 800;
  box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.18), 0 5px 0 rgba(0, 0, 0, 0.15);
  transition: transform 0.12s, opacity 0.2s;
}
.tile:not(:disabled):active { transform: translateY(3px); }
.tile.used { opacity: 0.15; }
.tile.wrong { background: #b2bec3; animation: shake 0.45s; }
</style>
