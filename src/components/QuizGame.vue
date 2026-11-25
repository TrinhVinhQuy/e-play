<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { store, go } from '../store'
import { gameById } from '../games'
import { makeQuiz, pick, formatNum } from '../utils/questions'
import { isEnglishGame, makeEnglishQuiz } from '../utils/english'
import { speak, canSpeak, stopSpeaking } from '../utils/speech'
import { sfx } from '../utils/sound'
import { finishGame, PRAISE, ENCOURAGE } from '../utils/finish'
import Mascot from './Mascot.vue'

const TOTAL = 10
const game = gameById(store.gameId)
const grade = store.player.grade
const english = isEnglishGame(store.gameId)
const questions = english ? makeEnglishQuiz(store.gameId, grade, TOTAL) : makeQuiz(store.gameId, grade, TOTAL)
const TIME = english ? 25 : grade <= 2 ? 20 : grade === 3 ? 25 : 30

const idx = ref(0)
const score = ref(0)
const correct = ref(0)
const streak = ref(0)
const picked = ref(null)
const status = ref(null) // 'right' | 'wrong' | null
const timeLeft = ref(TIME)
const say = ref(game.desc)
const mood = ref('happy')
const floating = ref(null)

const q = computed(() => questions[idx.value])
const timePct = computed(() => (timeLeft.value / TIME) * 100)

const SIGN_LABEL = { '<': 'bé hơn', '=': 'bằng', '>': 'lớn hơn' }
const CHOICE_COLORS = ['#ff6b81', '#1e90ff', '#2ed573', '#ffa502']

let timer = null
let nextTimer = null

function startTimer() {
  clearInterval(timer)
  timeLeft.value = TIME
  timer = setInterval(() => {
    timeLeft.value = Math.max(0, timeLeft.value - 0.1)
    if (timeLeft.value <= 0) choose(null)
  }, 100)
}

function choose(c) {
  if (status.value) return
  clearInterval(timer)
  picked.value = c
  const ok = c === q.value.answer
  status.value = ok ? 'right' : 'wrong'
  if (ok) {
    correct.value++
    streak.value++
    const gain = 10 + Math.ceil((timeLeft.value / TIME) * 5) + Math.min(streak.value - 1, 5) * 2
    score.value += gain
    floating.value = '+' + gain
    sfx.correct()
    if (english) setTimeout(() => speak(q.value.word), 350)
    say.value = streak.value >= 3 ? `${streak.value} câu liên tiếp! 🔥` : pick(PRAISE)
    mood.value = 'cheer'
  } else {
    streak.value = 0
    sfx.wrong()
    const ans = english ? q.value.explain : typeof q.value.answer === 'number' ? formatNum(q.value.answer) : q.value.answer
    say.value = (c === null ? 'Hết giờ rồi! ' : '') + `Đáp án là ${ans}. ${pick(ENCOURAGE)}`
    if (english) setTimeout(() => speak(q.value.word), 500)
    mood.value = 'sad'
  }
  nextTimer = setTimeout(next, ok ? 1200 : 2400)
}

function next() {
  floating.value = null
  if (idx.value + 1 >= questions.length) {
    finishGame({ score: score.value, correct: correct.value, total: questions.length })
    return
  }
  idx.value++
  picked.value = null
  status.value = null
  mood.value = 'happy'
  say.value = q.value.prompt
  startTimer()
  autoSpeak()
}

// Trò "Nghe & Chọn": tự đọc từ khi hiện câu hỏi mới
function autoSpeak() {
  if (q.value.kind === 'listen') setTimeout(() => speak(q.value.word), 500)
}
function replay() {
  sfx.click()
  speak(q.value.word, { force: true })
}

function quit() {
  sfx.click()
  go('menu')
}

function choiceClass(c) {
  if (!status.value) return ''
  if (c === q.value.answer) return 'is-answer'
  if (c === picked.value) return 'is-wrong'
  return 'is-dim'
}

onMounted(() => {
  say.value = q.value.prompt
  startTimer()
  autoSpeak()
})
onBeforeUnmount(() => {
  stopSpeaking()
  clearInterval(timer)
  clearTimeout(nextTimer)
})
</script>

<template>
  <section class="quiz" :style="{ '--c': game.color }">
    <div class="hud">
      <button class="btn white small" @click="quit">⬅ Thoát</button>
      <div class="game-name">{{ game.icon }} {{ game.name }}</div>
      <div class="score">🏅 {{ score }}</div>
    </div>

    <div class="progress">
      <span
        v-for="(_, i) in questions"
        :key="i"
        class="dot"
        :class="{ done: i < idx, now: i === idx }"
      />
    </div>

    <div class="card board" :class="{ shake: status === 'wrong' }">
      <div class="timebar"><div class="fill" :style="{ width: timePct + '%' }" :class="{ low: timePct < 30 }" /></div>

      <Transition name="screen" mode="out-in">
        <div :key="idx" class="question">
          <p class="prompt">{{ q.prompt }}</p>

          <!-- Đếm hình -->
          <div v-if="q.kind === 'count'" class="count-area">
            <div v-for="(n, gi) in q.groups" :key="gi" class="group" :class="{ single: q.groups.length === 1 }">
              <span
                v-for="k in n"
                :key="k"
                class="thing pop-in"
                :style="{ animationDelay: (gi * n + k) * 0.03 + 's' }"
              >{{ q.emoji }}</span>
            </div>
          </div>

          <!-- Tiếng Anh: nghe và chọn hình -->
          <div v-else-if="q.kind === 'listen'" class="listen-area">
            <button class="speaker" :class="{ playing: !status }" @click="replay">🔊</button>
            <p v-if="!canSpeak || status" class="word-reveal">{{ q.word }}</p>
            <p v-else class="tap-hint">Bấm loa để nghe lại</p>
          </div>

          <!-- Tiếng Anh: nhìn hình đoán từ -->
          <div v-else-if="q.kind === 'picture'" class="picture-area">
            <span class="big-emoji pop-in">{{ q.emoji }}</span>
            <button v-if="status" class="mini-speaker" @click="replay">🔊</button>
          </div>

          <!-- Phép tính / so sánh / số bí ẩn -->
          <div v-else class="equation" :class="q.kind">
            <template v-for="(t, ti) in q.parts" :key="ti">
              <span v-if="t === '?'" class="slot" :class="[status, { gift: q.kind === 'missing' && !status }]">
                <template v-if="status">{{ typeof q.answer === 'number' ? formatNum(q.answer) : q.answer }}</template>
                <template v-else-if="q.kind === 'missing'">🎁</template>
                <template v-else>?</template>
              </span>
              <span v-else-if="['+', '−', '×', '÷', '='].includes(t)" class="op">{{ t }}</span>
              <span v-else class="num">{{ t }}</span>
            </template>
          </div>
        </div>
      </Transition>

      <span v-if="floating" class="floating">{{ floating }}</span>
    </div>

    <div class="choices" :class="{ signs: q.kind === 'compare', pics: q.kind === 'listen', words: q.kind === 'picture' }">
      <button
        v-for="(c, ci) in q.choices"
        :key="idx + '-' + c"
        class="choice pop-in"
        :class="choiceClass(c)"
        :style="{ '--bg': CHOICE_COLORS[ci % 4], animationDelay: ci * 0.06 + 's' }"
        :disabled="!!status"
        @click="choose(c)"
      >
        <span class="val">{{ typeof c === 'number' ? formatNum(c) : c }}</span>
        <small v-if="q.kind === 'compare'">{{ SIGN_LABEL[c] }}</small>
      </button>
    </div>

    <Mascot :text="say" :mood="mood" class="mascot" />
  </section>
</template>

<style scoped>
.quiz { display: flex; flex-direction: column; gap: 16px; }
.hud { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.game-name { font-size: 1.7rem; font-weight: 800; color: #fff; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.18); }
.score {
  background: var(--yellow);
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 1.4rem;
  font-weight: 800;
  box-shadow: var(--shadow);
}
.progress { display: flex; gap: 8px; justify-content: center; }
.dot { width: 18px; height: 18px; border-radius: 50%; background: rgba(255, 255, 255, 0.6); transition: all 0.3s; }
.dot.done { background: var(--c); }
.dot.now { background: #fff; transform: scale(1.35); box-shadow: 0 0 0 3px var(--c); }

.board { position: relative; padding-top: 34px; min-height: 230px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.timebar { position: absolute; top: 14px; left: 24px; right: 24px; height: 10px; background: #f1f2f6; border-radius: 99px; overflow: hidden; }
.fill { height: 100%; background: var(--c); transition: width 0.1s linear, background 0.3s; }
.fill.low { background: var(--red); }
.question { width: 100%; text-align: center; }
.prompt { font-size: 1.4rem; font-weight: 700; margin: 4px 0 14px; color: #57606f; }

.equation { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 12px; }
.num { font-size: clamp(2.4rem, 8vw, 4.2rem); font-weight: 800; color: var(--ink); }
.op { font-size: clamp(2.2rem, 7vw, 3.8rem); font-weight: 800; color: var(--c); }
.compare .num { font-size: clamp(2rem, 6.5vw, 3.6rem); }
.slot {
  min-width: 1.6em;
  padding: 0 14px;
  font-size: clamp(2.4rem, 8vw, 4.2rem);
  font-weight: 800;
  border: 5px dashed var(--c);
  border-radius: 22px;
  color: var(--c);
  animation: bounce 1.4s ease-in-out infinite;
}
.slot.gift { border-style: solid; background: #f3e8ff; }
.slot.right { border-style: solid; border-color: var(--green); background: #e8fbef; color: #1e8e4a; animation: pop-in 0.4s; }
.slot.wrong { border-style: solid; border-color: var(--red); background: #ffecee; color: var(--red); animation: pop-in 0.4s; }

.count-area { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
.group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  max-width: 220px;
  padding: 8px 12px;
  border: 3px dashed #dfe4ea;
  border-radius: 18px;
}
.group.single { max-width: 520px; border: none; }
.thing { font-size: 2.6rem; line-height: 1.1; }
.group:not(.single) .thing { font-size: 1.9rem; }

.floating {
  position: absolute;
  right: 30px;
  top: 30px;
  font-size: 2rem;
  font-weight: 800;
  color: var(--green);
  animation: float-up 1s ease-out forwards;
}
@keyframes float-up {
  from { transform: translateY(20px); opacity: 0; }
  30% { opacity: 1; }
  to { transform: translateY(-40px); opacity: 0; }
}

.choices { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.choices.signs { grid-template-columns: repeat(3, 1fr); }
.choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 6px;
  background: var(--bg);
  color: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.18);
  transition: transform 0.12s, opacity 0.25s, filter 0.25s;
  text-shadow: 0 3px 0 rgba(0, 0, 0, 0.15);
}
.choice .val { font-size: clamp(1.8rem, 5.5vw, 2.8rem); font-weight: 800; line-height: 1.1; }
.choice small { font-size: 1rem; font-weight: 700; }
.choice:not(:disabled):hover { transform: translateY(-4px) scale(1.03); }
.choice:not(:disabled):active { transform: translateY(4px); box-shadow: 0 3px 0 rgba(0, 0, 0, 0.18); }
.choice:disabled { cursor: default; }
.choice.is-answer { background: var(--green); transform: scale(1.08); box-shadow: 0 0 0 5px #fff, 0 8px 0 rgba(0, 0, 0, 0.18); }
.choice.is-wrong { background: #b2bec3; animation: shake 0.45s; }
.choice.is-dim { opacity: 0.4; filter: grayscale(0.6); }

.mascot { align-self: flex-start; }

/* Tiếng Anh */
.listen-area, .picture-area { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.speaker {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  font-size: 4rem;
  background: var(--c);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.18);
  transition: transform 0.1s;
}
.speaker:active { transform: translateY(4px); }
.speaker.playing { animation: pulse 1.6s ease-in-out infinite; }
@keyframes pulse {
  0%, 100% { box-shadow: 0 8px 0 rgba(0, 0, 0, 0.18), 0 0 0 0 rgba(255, 255, 255, 0); }
  50% { box-shadow: 0 8px 0 rgba(0, 0, 0, 0.18), 0 0 0 14px rgba(30, 144, 255, 0.25); }
}
.tap-hint { margin: 4px 0 0; color: #a4b0be; font-weight: 700; }
.word-reveal { margin: 4px 0 0; font-size: 2.4rem; font-weight: 800; color: var(--c); }
.big-emoji { font-size: clamp(6rem, 18vw, 9rem); line-height: 1.1; }
.mini-speaker { background: #f1f2f6; border-radius: 999px; font-size: 1.6rem; padding: 4px 16px; }
.choices.pics .val { font-size: clamp(3rem, 9vw, 4.4rem); }
.choices.pics .choice { background: #fff; box-shadow: 0 8px 0 rgba(0, 0, 0, 0.12), inset 0 0 0 5px var(--bg); }
.choices.pics .choice.is-answer { background: #e8fbef; }
.choices.words .val { font-size: clamp(1.3rem, 3.6vw, 2rem); word-break: break-word; }
@media (max-width: 600px) {
  .choices { grid-template-columns: repeat(2, 1fr); }
  .game-name { font-size: 1.2rem; }
}
</style>
