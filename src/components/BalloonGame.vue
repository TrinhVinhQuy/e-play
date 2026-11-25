<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { store, go } from '../store'
import { gameById } from '../games'
import { makeQuiz, pick, shuffle, rnd, formatNum } from '../utils/questions'
import { sfx } from '../utils/sound'
import { finishGame, PRAISE, ENCOURAGE } from '../utils/finish'
import Mascot from './Mascot.vue'

const TOTAL = 10
const LIVES = 3
const game = gameById(store.gameId)
const grade = store.player.grade
const questions = makeQuiz('balloon', grade, TOTAL)
// Bóng bay chậm hơn khi số lớn để bé kịp tính
const RISE = { 1: 9, 2: 10, 3: 11, 4: 13, 5: 14 }[grade]

const COLORS = ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#a55eea', '#ff4757', '#eccc68']
const SLOTS = [4, 28, 52, 76]

const idx = ref(0)
const score = ref(0)
const correct = ref(0)
const lives = ref(LIVES)
const done = ref(false) // câu hiện tại đã xong
const say = ref('Chạm vào bóng có đáp án đúng nhé!')
const mood = ref('happy')
const balloons = ref([])
let roundTimer = null
let nextTimer = null
let roundStart = 0
let missed = false

const q = computed(() => questions[idx.value])

function setupRound() {
  done.value = false
  missed = false
  const slots = shuffle(SLOTS)
  const colors = shuffle(COLORS)
  balloons.value = q.value.choices.map((v, i) => ({
    id: idx.value + '-' + i,
    value: v,
    left: slots[i] + rnd(0, 6),
    color: colors[i],
    delay: rnd(0, 8) / 10,
    state: 'fly' // fly | pop | wrong
  }))
  roundStart = Date.now()
  clearTimeout(roundTimer)
  roundTimer = setTimeout(timeout, (RISE + 0.9) * 1000)
}

function tap(b) {
  if (done.value || b.state !== 'fly') return
  if (b.value === q.value.answer) {
    b.state = 'pop'
    done.value = true
    clearTimeout(roundTimer)
    sfx.pop()
    sfx.correct()
    if (!missed) correct.value++
    const speed = Math.max(0, 1 - (Date.now() - roundStart) / (RISE * 1000))
    score.value += (missed ? 5 : 10) + Math.round(speed * 10)
    say.value = pick(PRAISE)
    mood.value = 'cheer'
    nextTimer = setTimeout(next, 1100)
  } else {
    b.state = 'wrong'
    missed = true
    sfx.wrong()
    loseLife(`Ồ, không phải ${formatNum(b.value)}. ${pick(ENCOURAGE)}`)
  }
}

function timeout() {
  if (done.value) return
  done.value = true
  sfx.wrong()
  loseLife(`Bóng bay mất rồi! Đáp án là ${formatNum(q.value.answer)}.`)
  if (lives.value > 0) nextTimer = setTimeout(next, 1800)
}

function loseLife(msg) {
  lives.value--
  say.value = msg
  mood.value = 'sad'
  if (lives.value <= 0) {
    done.value = true
    clearTimeout(roundTimer)
    say.value = 'Hết tim rồi! Cùng xem kết quả nhé.'
    nextTimer = setTimeout(end, 1600)
  }
}

function next() {
  if (lives.value <= 0 || idx.value + 1 >= questions.length) return end()
  idx.value++
  mood.value = 'happy'
  say.value = 'Tiếp tục nào!'
  setupRound()
}

function end() {
  clearTimeout(roundTimer)
  finishGame({ score: score.value, correct: correct.value, total: questions.length })
}

function quit() {
  sfx.click()
  go('menu')
}

onMounted(setupRound)
onBeforeUnmount(() => {
  clearTimeout(roundTimer)
  clearTimeout(nextTimer)
})
</script>

<template>
  <section class="balloon-game">
    <div class="hud">
      <button class="btn white small" @click="quit">⬅ Thoát</button>
      <div class="lives">
        <span v-for="i in LIVES" :key="i" :class="{ lost: i > lives }">❤️</span>
      </div>
      <div class="score">🏅 {{ score }}</div>
    </div>

    <div class="card question">
      <span class="qno">Câu {{ idx + 1 }}/{{ TOTAL }}</span>
      <div class="eq">
        <template v-for="(t, i) in q.parts" :key="i">
          <span :class="{ op: ['+', '−', '×', '÷', '='].includes(t), slot: t === '?' }">{{ t === '?' && done ? formatNum(q.answer) : t }}</span>
        </template>
      </div>
    </div>

    <div class="sky">
      <div
        v-for="b in balloons"
        :key="b.id"
        class="balloon-wrap"
        :class="b.state"
        :style="{ left: b.left + '%', animationDuration: RISE + 's', animationDelay: b.delay + 's' }"
      >
        <button
          class="balloon"
          :style="{ '--b': b.color }"
          :class="{ reveal: done && b.value === q.answer && b.state === 'fly', long: formatNum(b.value).length > 4 }"
          @pointerdown.prevent="tap(b)"
        >
          {{ formatNum(b.value) }}
        </button>
        <span v-if="b.state === 'pop'" class="boom">💥</span>
      </div>
      <div class="grass">🌷🌼🌱🌻🌷🌱🌼🌸🌱🌻🌷🌼</div>
    </div>

    <Mascot :text="say" :mood="mood" />
  </section>
</template>

<style scoped>
.balloon-game { display: flex; flex-direction: column; gap: 14px; }
.hud { display: flex; justify-content: space-between; align-items: center; }
.lives { font-size: 2rem; display: flex; gap: 4px; }
.lives .lost { filter: grayscale(1); opacity: 0.35; transform: scale(0.8); transition: all 0.3s; }
.score { background: var(--yellow); border-radius: 999px; padding: 6px 18px; font-size: 1.4rem; font-weight: 800; box-shadow: var(--shadow); }

.question { position: relative; text-align: center; padding: 14px; }
.qno { position: absolute; left: 18px; top: 10px; font-weight: 800; color: #a4b0be; }
.eq { display: flex; justify-content: center; align-items: center; gap: 12px; font-size: clamp(2.2rem, 7vw, 3.6rem); font-weight: 800; flex-wrap: wrap; }
.eq .op { color: var(--pink); }
.eq .slot { color: var(--pink); border: 4px dashed var(--pink); border-radius: 18px; padding: 0 16px; min-width: 1.5em; }

.sky {
  position: relative;
  height: 480px;
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.05));
  border: 4px solid rgba(255, 255, 255, 0.7);
  overflow: hidden;
}
.grass { position: absolute; bottom: 0; left: 0; right: 0; text-align: center; font-size: 2rem; letter-spacing: 4px; pointer-events: none; }

.balloon-wrap {
  position: absolute;
  bottom: -170px;
  width: 20%;
  display: flex;
  justify-content: center;
  animation-name: rise;
  animation-timing-function: linear;
  animation-fill-mode: both;
}
@keyframes rise {
  from { transform: translateY(0); }
  to { transform: translateY(-680px); }
}
.balloon-wrap.pop, .balloon-wrap.wrong { animation-play-state: paused; }

.balloon {
  position: relative;
  width: 110px;
  height: 135px;
  border-radius: 50% 50% 48% 52% / 42% 42% 58% 58%;
  background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.75) 0 10%, transparent 11%), var(--b);
  color: #fff;
  font-size: 1.8rem;
  font-weight: 800;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
  box-shadow: inset -10px -12px 0 rgba(0, 0, 0, 0.12);
  animation: sway 2.2s ease-in-out infinite;
  touch-action: manipulation;
}
.balloon::before {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-bottom: 10px solid var(--b);
  rotate: 180deg;
}
.balloon::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  width: 2px;
  height: 60px;
  margin-top: 8px;
  background: rgba(47, 53, 66, 0.45);
}
@keyframes sway {
  0%, 100% { transform: rotate(-4deg) translateX(-4px); }
  50% { transform: rotate(4deg) translateX(4px); }
}
.balloon.long { font-size: 1.25rem; }
.balloon.reveal { box-shadow: 0 0 0 6px #fff, 0 0 30px 10px var(--yellow); }
.pop .balloon { animation: burst 0.3s forwards; }
.wrong .balloon { animation: shrink 0.6s forwards; }
@keyframes burst {
  to { transform: scale(1.6); opacity: 0; }
}
@keyframes shrink {
  30% { transform: translateX(-10px); }
  60% { transform: translateX(10px); }
  to { transform: scale(0.2); opacity: 0; }
}
.boom { position: absolute; top: 20px; font-size: 4rem; animation: pop-in 0.3s ease-out, fade 0.8s 0.3s forwards; }
@keyframes fade { to { opacity: 0; } }

@media (max-width: 600px) {
  .sky { height: 420px; }
  .balloon { width: 76px; height: 96px; font-size: 1.25rem; }
}
</style>
