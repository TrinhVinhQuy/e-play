<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { store, go } from '../store'
import { gameById } from '../games'
import { pick } from '../utils/questions'
import { makeEnglishQuiz } from '../utils/english'
import { speak, stopSpeaking } from '../utils/speech'
import { sfx } from '../utils/sound'
import { finishGame, PRAISE } from '../utils/finish'
import Mascot from './Mascot.vue'

const TOTAL = 10
const game = gameById(store.gameId)
const questions = makeEnglishQuiz('spell', store.player.grade, TOTAL)
const TILE_COLORS = ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#a55eea', '#ff4757', '#3742fa', '#20bf6b']
const HINTS = ['Chưa đúng rồi, nghe lại xem nào! 👂', 'Thử chữ khác nhé! 🍀', 'Gần được rồi! 💪']

const idx = ref(0)
const score = ref(0)
const correct = ref(0)
const mistakes = ref(0)
const filled = ref([]) // các chữ đã ghép đúng
const tiles = ref([])
const solved = ref(false)
const showHint = ref(false)
const say = ref('')
const mood = ref('happy')
let nextTimer = null

const q = computed(() => questions[idx.value])

function setup() {
  filled.value = []
  solved.value = false
  showHint.value = false
  mistakes.value = 0
  mood.value = 'happy'
  say.value = `"${q.value.vi}" trong tiếng Anh viết thế nào?`
  tiles.value = q.value.letters.map((ch, i) => ({
    id: idx.value + '-' + i,
    ch,
    used: false,
    wrong: false,
    color: TILE_COLORS[i % TILE_COLORS.length]
  }))
  setTimeout(() => speak(q.value.word), 500)
}

function tap(t) {
  if (solved.value || t.used) return
  const need = q.value.word[filled.value.length]
  if (t.ch === need) {
    t.used = true
    filled.value.push(t.ch)
    sfx.pop()
    if (filled.value.length === q.value.word.length) win()
  } else {
    t.wrong = true
    mistakes.value++
    sfx.wrong()
    mood.value = 'sad'
    say.value = pick(HINTS)
    // Sai 2 lần thì hiện chữ cái tiếp theo làm gợi ý
    if (mistakes.value >= 2) showHint.value = true
    setTimeout(() => (t.wrong = false), 450)
  }
}

function win() {
  solved.value = true
  sfx.correct()
  setTimeout(() => speak(q.value.word), 300)
  if (mistakes.value <= 1) correct.value++
  score.value += Math.max(3, 10 - mistakes.value * 2)
  mood.value = 'cheer'
  say.value = `${pick(PRAISE)} ${q.value.explain}`
  nextTimer = setTimeout(next, 2200)
}

function next() {
  if (idx.value + 1 >= questions.length) {
    finishGame({ score: score.value, correct: correct.value, total: questions.length })
    return
  }
  idx.value++
  setup()
}

function listen() {
  sfx.click()
  speak(q.value.word, { force: true, rate: 0.7 })
}

function quit() {
  sfx.click()
  go('menu')
}

onMounted(setup)
onBeforeUnmount(() => {
  clearTimeout(nextTimer)
  stopSpeaking()
})
</script>

<template>
  <section class="spell" :style="{ '--c': game.color }">
    <div class="hud">
      <button class="btn white small" @click="quit">⬅ Thoát</button>
      <div class="game-name">{{ game.icon }} {{ game.name }}</div>
      <div class="score">🏅 {{ score }}</div>
    </div>

    <div class="progress">
      <span v-for="(_, i) in questions" :key="i" class="dot" :class="{ done: i < idx, now: i === idx }" />
    </div>

    <div class="card stage" :key="idx">
      <div class="picture">
        <span class="emoji pop-in">{{ q.emoji }}</span>
        <div class="meta">
          <span class="vi">{{ q.vi }}</span>
          <button class="listen" @click="listen">🔊 Nghe</button>
        </div>
      </div>

      <div class="slots" :class="{ done: solved }">
        <span
          v-for="(ch, i) in q.word"
          :key="i"
          class="slot"
          :class="{ filled: i < filled.length, next: i === filled.length && !solved, hint: showHint && i === filled.length }"
          :style="{ animationDelay: solved ? i * 0.08 + 's' : '0s' }"
        >
          <template v-if="i < filled.length">{{ filled[i] }}</template>
          <template v-else-if="showHint && i === filled.length">{{ ch }}</template>
        </span>
      </div>
    </div>

    <div class="tiles">
      <button
        v-for="(t, ti) in tiles"
        :key="t.id"
        class="tile pop-in"
        :class="{ used: t.used, wrong: t.wrong }"
        :style="{ '--t': t.color, animationDelay: ti * 0.05 + 's' }"
        :disabled="t.used || solved"
        @click="tap(t)"
      >
        {{ t.ch }}
      </button>
    </div>

    <Mascot :text="say" :mood="mood" />
  </section>
</template>

<style scoped>
.spell { display: flex; flex-direction: column; gap: 16px; }
.hud { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.game-name { font-size: 1.7rem; font-weight: 800; color: #fff; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.18); }
.score { background: var(--yellow); border-radius: 999px; padding: 6px 18px; font-size: 1.4rem; font-weight: 800; box-shadow: var(--shadow); }
.progress { display: flex; gap: 8px; justify-content: center; }
.dot { width: 18px; height: 18px; border-radius: 50%; background: rgba(255, 255, 255, 0.6); transition: all 0.3s; }
.dot.done { background: var(--c); }
.dot.now { background: #fff; transform: scale(1.35); box-shadow: 0 0 0 3px var(--c); }

.stage { display: flex; flex-direction: column; align-items: center; gap: 18px; animation: pop-in 0.35s ease-out; }
.picture { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: center; }
.emoji { font-size: clamp(5rem, 15vw, 7.5rem); line-height: 1.1; }
.meta { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.vi { font-size: 1.6rem; font-weight: 800; color: #57606f; }
.listen {
  background: var(--c);
  color: #fff;
  font-size: 1.3rem;
  font-weight: 800;
  border-radius: 999px;
  padding: 6px 20px;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.18);
}
.listen:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0, 0, 0, 0.18); }

.slots { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.slot {
  width: clamp(44px, 9vw, 64px);
  height: clamp(54px, 11vw, 76px);
  border-radius: 14px;
  border: 4px dashed #dfe4ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  font-weight: 800;
  color: var(--ink);
  text-transform: lowercase;
}
.slot.next { border-color: var(--c); animation: bounce 1.2s ease-in-out infinite; }
.slot.hint { color: #c8d6e5; }
.slot.filled { border: 4px solid var(--c); background: #f3ecff; animation: pop-in 0.3s ease-out; }
.slots.done .slot { background: #e8fbef; border-color: var(--green); color: #1e8e4a; animation: bounce 0.6s ease-in-out both; }

.tiles { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.tile {
  width: clamp(58px, 12vw, 80px);
  height: clamp(58px, 12vw, 80px);
  border-radius: 18px;
  background: var(--t);
  color: #fff;
  font-size: clamp(2rem, 6vw, 2.8rem);
  font-weight: 800;
  text-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 -7px 0 rgba(0, 0, 0, 0.18), 0 6px 0 rgba(0, 0, 0, 0.15);
  transition: transform 0.12s, opacity 0.2s;
}
.tile:not(:disabled):hover { transform: translateY(-4px) rotate(-4deg); }
.tile:not(:disabled):active { transform: translateY(3px); }
.tile.used { opacity: 0.15; transform: scale(0.85); }
.tile.wrong { animation: shake 0.45s; background: #b2bec3; }
.tile:disabled { cursor: default; }
</style>
