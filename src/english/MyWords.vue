<script setup>
// My Learning: từ đã học, từ cần ôn tập, mức độ thành thạo
import { ref, computed } from 'vue'
import { store, go } from '../store'
import { WORD } from './curriculum'
import { progress, wordStats, weakWords } from './progress'
import { speak } from '../utils/speech'
import { sfx } from '../utils/sound'

const STATUS = {
  learning: { label: 'Đang học', color: '#ffa502' },
  familiar: { label: 'Đã nhận biết', color: '#1e90ff' },
  mastered: { label: 'Thành thạo', color: '#2ed573' }
}

const tab = ref('all')
const stats = computed(() => wordStats())
const weak = computed(() => weakWords(30))
const list = computed(() => {
  const all = Object.entries(progress.words).filter(([en]) => WORD[en])
  if (tab.value === 'review') return weak.value.map((en) => [en, progress.words[en]])
  if (tab.value === 'all') return all
  return all.filter(([, w]) => w.status === tab.value)
})

function practice() {
  sfx.click()
  store.lessonId = 'practice'
  go('lesson')
}
</script>

<template>
  <section class="words">
    <div class="head">
      <button class="btn white small" @click="sfx.click(); go('adventure')">⬅ Bản đồ</button>
      <h1 class="title">📚 Từ của tôi</h1>
      <span />
    </div>

    <div class="stats">
      <div class="card s"><b>{{ stats.total }}</b><span>Đã học</span></div>
      <div class="card s" style="--c: #ffa502"><b>{{ stats.learning }}</b><span>Đang học</span></div>
      <div class="card s" style="--c: #1e90ff"><b>{{ stats.familiar }}</b><span>Đã nhận biết</span></div>
      <div class="card s" style="--c: #2ed573"><b>{{ stats.mastered }}</b><span>Thành thạo</span></div>
    </div>

    <button class="btn green practice" :disabled="stats.total === 0" @click="practice">
      🔁 Ôn tập từ cần nhớ ({{ Math.min(weak.length, 8) || 'từ mới' }})
    </button>

    <div class="tabs">
      <button :class="{ on: tab === 'all' }" @click="tab = 'all'">Tất cả</button>
      <button :class="{ on: tab === 'review' }" @click="tab = 'review'">Cần ôn tập</button>
      <button v-for="(s, k) in STATUS" :key="k" :class="{ on: tab === k }" @click="tab = k">{{ s.label }}</button>
    </div>

    <p v-if="!list.length" class="empty card">Chưa có từ nào ở đây. Vào bản đồ học bài đầu tiên nhé! 🚀</p>
    <div v-else class="grid">
      <button
        v-for="[en, w] in list"
        :key="en"
        class="word card"
        :style="{ '--c': STATUS[w.status].color }"
        @click="speak(en, { force: true })"
      >
        <span class="e">{{ WORD[en].emoji }}</span>
        <b>{{ en }}</b>
        <span class="vi">{{ WORD[en].vi }}</span>
        <small>{{ STATUS[w.status].label }} · ✔{{ w.c }} ✖{{ w.w }}</small>
      </button>
    </div>
  </section>
</template>

<style scoped>
.words { display: flex; flex-direction: column; gap: 14px; }
.head { display: grid; grid-template-columns: auto 1fr auto; align-items: center; text-align: center; }
.title { font-size: clamp(1.8rem, 5vw, 2.6rem); }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.s { --c: #8854d0; padding: 12px; text-align: center; display: flex; flex-direction: column; border-bottom: 6px solid var(--c); }
.s b { font-size: 2rem; color: var(--c); }
.s span { font-weight: 700; color: #57606f; }
.practice { align-self: center; font-size: 1.3rem; }
.tabs { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.tabs button { background: rgba(255, 255, 255, 0.7); border-radius: 14px; padding: 6px 14px; font-weight: 800; font-size: 1rem; }
.tabs button.on { background: var(--ink); color: #fff; }
.empty { text-align: center; font-weight: 700; font-size: 1.2rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.word { padding: 12px; display: flex; flex-direction: column; align-items: center; border-bottom: 6px solid var(--c); }
.word .e { font-size: 2.6rem; }
.word b { font-size: 1.3rem; }
.word .vi { color: #57606f; font-weight: 600; }
.word small { color: var(--c); font-weight: 800; margin-top: 4px; }
@media (max-width: 600px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
