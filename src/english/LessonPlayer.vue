<script setup>
// Chạy một bài học: Warm-up/Learn → Practice → Challenge → Review (tổng kết)
import { ref, computed } from 'vue'
import { store, go } from '../store'
import { buildSession, countItems, STEP_INFO } from './engine'
import { recordAnswer, finishLesson, nextLesson, wordStatus } from './progress'
import { WORD } from './curriculum'
import { sfx } from '../utils/sound'
import Mascot from '../components/Mascot.vue'
import Confetti from '../components/Confetti.vue'
import ActLearn from './activities/ActLearn.vue'
import ActChoice from './activities/ActChoice.vue'
import ActMatch from './activities/ActMatch.vue'
import ActSpell from './activities/ActSpell.vue'

const COMPONENTS = { LEARN: ActLearn, LISTENING: ActChoice, QUIZ: ActChoice, MATCHING: ActMatch, SPELLING: ActSpell }
const STATUS = {
  new: ['Mới', '#a4b0be'],
  learning: ['Đang học', '#ffa502'],
  familiar: ['Đã nhận biết', '#1e90ff'],
  mastered: ['Thành thạo', '#2ed573']
}

const session = ref(null)
const stepIdx = ref(0)
const answers = ref([])
const result = ref(null)
const runKey = ref(0)

function start() {
  session.value = buildSession(store.lessonId, store.player.grade)
  stepIdx.value = 0
  answers.value = []
  result.value = null
  runKey.value++
}
start()

const steps = computed(() => session.value.steps)
const step = computed(() => steps.value[stepIdx.value])
const info = computed(() => STEP_INFO[step.value?.type] || {})
const total = computed(() => countItems(steps.value))
const pct = computed(() => {
  if (result.value) return 100
  const learnPart = steps.value[0]?.type === 'LEARN' && stepIdx.value > 0 ? 8 : 0
  return Math.min(100, learnPart + (answers.value.length / Math.max(1, total.value)) * (100 - learnPart))
})
const correct = computed(() => answers.value.filter((a) => a.ok).length)
const earned = computed(() => result.value?.rewards.reduce((s, r) => s + r.xp, 0) || 0)
const following = computed(() => (result.value?.passed ? nextLesson() : null))

function onAnswer(a) {
  recordAnswer(a.en, a.ok)
  answers.value.push(a)
}

function onDone() {
  if (stepIdx.value + 1 < steps.value.length) {
    stepIdx.value++
    return
  }
  result.value = finishLesson(session.value.lesson.id, correct.value, answers.value.length)
  if (result.value.stars >= 2) sfx.win()
  else sfx.correct()
}

function exit() {
  sfx.click()
  const l = session.value.lesson
  if (l.id === 'practice') go('words')
  else {
    store.worldId = l.worldId
    go('world')
  }
}

function goNext() {
  sfx.click()
  store.lessonId = following.value.id
  start()
}
</script>

<template>
  <section class="player" :style="{ '--wc': session.world.color }">
    <div class="topbar">
      <button class="close" title="Thoát" @click="exit">✖</button>
      <div class="bar"><div class="fill" :style="{ width: pct + '%' }" /></div>
      <span class="count">✅ {{ correct }}</span>
    </div>

    <!-- Đang học -->
    <template v-if="!result">
      <div class="step-head">
        <span class="chip">{{ info.icon }} {{ info.title }}</span>
        <span class="lesson-name">{{ session.world.icon }} {{ session.lesson.title }}</span>
      </div>

      <component
        :is="COMPONENTS[step.type]"
        :key="runKey + '-' + stepIdx"
        :step="step"
        @answer="onAnswer"
        @done="onDone"
      />

      <Mascot class="foxy" face="🦊" :text="info.hint" />
    </template>

    <!-- Tổng kết (Review & phần thưởng) -->
    <div v-else class="summary card pop-in">
      <Confetti v-if="result.stars >= 2" />
      <div class="stars">
        <span v-for="k in 3" :key="k" :class="{ on: k <= result.stars }" :style="{ animationDelay: k * 0.2 + 's' }">⭐</span>
      </div>
      <h2>{{ result.passed ? 'Hoàn thành bài học!' : 'Gần được rồi! Học lại nhé 💪' }}</h2>
      <p class="score">Đúng {{ correct }}/{{ answers.length }} câu</p>

      <ul v-if="result.rewards.length" class="rewards">
        <li v-for="r in result.rewards" :key="r.label"><span>{{ r.label }}</span><b>+{{ r.xp }} XP</b></li>
        <li class="total"><span>Tổng cộng</span><b>+{{ earned }} XP</b></li>
      </ul>
      <p v-else-if="result.passed" class="note">Hôm nay bạn đã nhận thưởng ôn tập cho bài này rồi. Học lại vẫn giúp nhớ từ lâu hơn!</p>

      <div class="learned">
        <span v-for="en in session.lesson.words" :key="en" class="w" :style="{ '--s': STATUS[wordStatus(en)][1] }">
          {{ WORD[en].emoji }} {{ en }}
          <small>{{ STATUS[wordStatus(en)][0] }}</small>
        </span>
      </div>

      <div class="actions">
        <button v-if="following" class="btn green" @click="goNext">Bài tiếp theo ▶</button>
        <button class="btn" :class="{ green: !following }" @click="sfx.click(); start()">🔁 Học lại</button>
        <button class="btn blue" @click="exit">🗺️ Về bản đồ</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.player { display: flex; flex-direction: column; gap: 14px; max-width: 900px; margin: 0 auto; }
.topbar { display: flex; align-items: center; gap: 12px; }
.close { width: 44px; height: 44px; border-radius: 50%; background: #fff; font-size: 1.2rem; box-shadow: var(--shadow); color: #747d8c; }
.bar { flex: 1; height: 20px; background: rgba(255, 255, 255, 0.7); border-radius: 99px; overflow: hidden; }
.fill { height: 100%; background: linear-gradient(90deg, var(--wc), #7bed9f); border-radius: 99px; transition: width 0.4s ease-out; }
.count { background: #fff; border-radius: 999px; padding: 4px 14px; font-weight: 800; box-shadow: var(--shadow); }
.step-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.chip { background: var(--wc); color: #fff; font-weight: 800; font-size: 1.3rem; padding: 6px 18px; border-radius: 999px; box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15); }
.lesson-name { font-weight: 800; color: #1b4f72; }
.foxy { align-self: flex-start; pointer-events: none; }

.summary { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.stars span { font-size: 64px; filter: grayscale(1) opacity(0.3); display: inline-block; animation: pop-in 0.5s both; }
.stars span.on { filter: none; }
.stars span:nth-child(2) { font-size: 80px; transform: translateY(-12px); }
h2 { margin: 0; font-size: 1.9rem; }
.score { margin: 0; font-weight: 700; color: #57606f; font-size: 1.2rem; }
.rewards { list-style: none; padding: 0; margin: 0; width: 100%; max-width: 380px; }
.rewards li { display: flex; justify-content: space-between; padding: 6px 12px; font-weight: 700; border-bottom: 2px dashed #f1f2f6; }
.rewards b { color: #e1a100; }
.rewards .total { font-size: 1.3rem; border: none; }
.note { color: #57606f; font-weight: 600; max-width: 420px; }
.learned { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.w { background: #f8f9fb; border-radius: 14px; padding: 6px 12px; font-weight: 800; font-size: 1.1rem; display: flex; flex-direction: column; border-bottom: 4px solid var(--s); }
.w small { color: var(--s); font-size: 0.8rem; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 6px; }
@media (max-width: 600px) {
  .foxy { display: none; }
}
</style>
