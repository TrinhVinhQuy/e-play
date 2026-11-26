<script setup>
// LISTENING: nghe từ → chọn hình.  QUIZ: nhìn hình → chọn từ.
// Sai lần đầu: "That's OK! Try one more time!" và được chọn lại.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { WORD } from '../curriculum'
import { speak, canSpeak, stopSpeaking } from '../../utils/speech'
import { sfx } from '../../utils/sound'
import { cheer, encourage } from '../../utils/cheer'
import FeedbackBar from './FeedbackBar.vue'

const props = defineProps({ step: Object })
const emit = defineEmits(['answer', 'done'])

const listening = props.step.type === 'LISTENING'
const COLORS = ['#ff6b81', '#1e90ff', '#2ed573', '#ffa502']

const i = ref(0)
const picked = ref(null) // lựa chọn cuối cùng (đúng, hoặc sai lần 2)
const tried = ref([]) // các lựa chọn sai
const phrase = ref('')
const retryMsg = ref('')
const q = computed(() => props.step.questions[i.value])
const w = computed(() => WORD[q.value.word])
const ok = computed(() => picked.value === q.value.word)

function play(force = false) {
  speak(w.value.en, { force })
}

function choose(en) {
  if (picked.value || tried.value.includes(en)) return
  if (en === q.value.word) {
    picked.value = en
    phrase.value = cheer(w.value.en)
    emit('answer', { en: q.value.word, ok: tried.value.length === 0 })
    return
  }
  tried.value.push(en)
  sfx.wrong()
  if (tried.value.length === 1) {
    // Cho thử lại một lần
    retryMsg.value = encourage({ force: true })
    if (listening) speak(w.value.en, { queue: true })
    return
  }
  // Sai lần thứ hai: hiện đáp án đúng
  picked.value = en
  setTimeout(() => play(), 300)
  emit('answer', { en: q.value.word, ok: false })
}

function next() {
  sfx.click()
  if (i.value + 1 >= props.step.questions.length) return emit('done')
  i.value++
  picked.value = null
  tried.value = []
  retryMsg.value = ''
  if (listening) setTimeout(() => play(), 300)
}

function cls(en) {
  if (tried.value.includes(en)) return 'wrong'
  if (!picked.value) return ''
  if (en === q.value.word) return 'right'
  return 'dim'
}

onMounted(() => listening && setTimeout(() => play(), 400))
onBeforeUnmount(stopSpeaking)
</script>

<template>
  <div class="choice-act">
    <div :key="i" class="prompt pop-in">
      <template v-if="listening">
        <button class="speaker" @click="play(true)">🔊</button>
        <p v-if="!canSpeak || picked" class="word">{{ w.en }}</p>
      </template>
      <template v-else>
        <span class="emoji">{{ w.emoji }}</span>
      </template>
    </div>

    <p v-if="retryMsg && !picked" :key="'r' + tried.length" class="retry pop-in">💪 {{ retryMsg }}</p>

    <div class="grid" :class="listening ? 'pics' : 'words'">
      <button
        v-for="(en, k) in q.choices"
        :key="i + en"
        class="opt pop-in"
        :class="cls(en)"
        :style="{ '--o': COLORS[k], animationDelay: k * 0.05 + 's' }"
        :disabled="!!picked || tried.includes(en)"
        @click="choose(en)"
      >
        <template v-if="listening">{{ WORD[en].emoji }}</template>
        <template v-else>{{ en }}</template>
      </button>
    </div>

    <FeedbackBar
      v-if="picked"
      :ok="ok"
      :title="ok ? `${phrase} 🎉` : 'Đáp án đúng là:'"
      :text="`${w.emoji} ${w.en} – ${w.vi}`"
      @next="next"
    />
  </div>
</template>

<style scoped>
.choice-act { display: flex; flex-direction: column; align-items: center; gap: 18px; padding-bottom: 90px; }
.prompt { display: flex; flex-direction: column; align-items: center; min-height: 150px; justify-content: center; }
.speaker {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  font-size: 4rem;
  background: var(--blue);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.18);
  animation: bounce 1.8s ease-in-out infinite;
}
.word { margin: 8px 0 0; font-size: 2.2rem; font-weight: 800; color: #fff; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.2); }
.emoji {
  font-size: clamp(6rem, 22vw, 8rem);
  line-height: 1.1;
  background: #fff;
  border-radius: 32px;
  padding: 10px 34px;
  box-shadow: var(--shadow);
}
.retry {
  margin: -6px 0 0;
  background: #fff4e5;
  color: #b35c00;
  border: 3px solid #ffa502;
  border-radius: 999px;
  padding: 6px 20px;
  font-size: 1.3rem;
  font-weight: 800;
}
.grid { width: 100%; max-width: 640px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.opt {
  min-height: 96px;
  border-radius: 24px;
  background: #fff;
  font-weight: 800;
  box-shadow: 0 7px 0 rgba(0, 0, 0, 0.12), inset 0 0 0 5px var(--o);
  transition: transform 0.12s, opacity 0.2s;
}
.pics .opt { font-size: clamp(3.4rem, 12vw, 4.6rem); }
.words .opt { font-size: clamp(1.5rem, 5vw, 2.1rem); color: var(--ink); }
.opt:not(:disabled):hover { transform: translateY(-3px); }
.opt:not(:disabled):active { transform: translateY(4px); }
.opt.right { background: #e8fbef; box-shadow: 0 7px 0 rgba(0, 0, 0, 0.12), inset 0 0 0 6px var(--green); transform: scale(1.04); }
.opt.wrong { background: #f1f2f6; box-shadow: inset 0 0 0 5px #ced6e0; opacity: 0.45; animation: shake 0.45s; filter: grayscale(0.7); }
.opt.dim { opacity: 0.45; }
</style>
