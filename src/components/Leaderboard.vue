<script setup>
import { ref, watch, onMounted } from 'vue'
import { store, go } from '../store'
import { GAMES, GRADES } from '../games'
import { getLeaderboard } from '../services/db'
import { sfx } from '../utils/sound'

const game = ref(store.result?.gameId || 'balloon')
const grade = ref(store.player.grade)
const rows = ref([])
const source = ref('local')
const loading = ref(false)

const MEDALS = ['🥇', '🥈', '🥉']

async function load() {
  loading.value = true
  const res = await getLeaderboard(game.value, grade.value)
  rows.value = res.rows
  source.value = res.source
  loading.value = false
}

watch([game, grade], load)
onMounted(load)

const isMe = (r) => r.name === store.player.name && r.avatar === store.player.avatar
</script>

<template>
  <section class="board">
    <div class="head">
      <button class="btn white small" @click="sfx.click(); go('menu')">⬅ Quay lại</button>
      <h1 class="title">🏆 Bảng Vàng</h1>
      <span />
    </div>

    <div class="tabs">
      <button
        v-for="g in GAMES"
        :key="g.id"
        class="tab"
        :class="{ active: g.id === game }"
        :style="{ '--c': g.color }"
        @click="sfx.click(); game = g.id"
      >
        {{ g.icon }} <span>{{ g.name }}</span>
      </button>
    </div>

    <div class="grades">
      <button v-for="g in GRADES" :key="g" :class="{ active: g === grade }" @click="sfx.click(); grade = g">Lớp {{ g }}</button>
    </div>

    <div class="card list">
      <p v-if="loading" class="empty">⏳ Đang tải...</p>
      <p v-else-if="!rows.length" class="empty">Chưa có ai chơi. Bạn hãy là người đầu tiên nhé! 🚀</p>
      <ol v-else>
        <li v-for="(r, i) in rows" :key="i" :class="{ me: isMe(r), top: i < 3 }" class="pop-in" :style="{ animationDelay: i * 0.05 + 's' }">
          <span class="rank">{{ MEDALS[i] || i + 1 }}</span>
          <span class="ava">{{ r.avatar }}</span>
          <span class="name">{{ r.name }}</span>
          <span class="stars">{{ '⭐'.repeat(Number(r.stars) || 0) }}</span>
          <span class="pts">{{ r.score }}</span>
        </li>
      </ol>
      <p class="src">{{ source === 'cloud' ? '☁️ Dữ liệu từ Google Drive' : '📱 Dữ liệu trên máy này' }}</p>
    </div>
  </section>
</template>

<style scoped>
.board { display: flex; flex-direction: column; gap: 14px; }
.head { display: grid; grid-template-columns: auto 1fr auto; align-items: center; text-align: center; }
.title { font-size: clamp(1.8rem, 5vw, 2.8rem); }
.tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.tab {
  background: #fff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--c);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  border: 3px solid transparent;
}
.tab.active { background: var(--c); color: #fff; }
.grades { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
.grades button {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  padding: 6px 14px;
  font-weight: 800;
  font-size: 1.05rem;
}
.grades button.active { background: var(--ink); color: #fff; }
.list ol { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
li {
  display: grid;
  grid-template-columns: 50px 50px 1fr auto 80px;
  align-items: center;
  gap: 8px;
  background: #f8f9fb;
  border-radius: 18px;
  padding: 8px 14px;
  font-size: 1.25rem;
  font-weight: 700;
}
li.top { background: #fff8db; }
li.me { box-shadow: 0 0 0 3px var(--blue); }
.rank { font-size: 1.7rem; text-align: center; }
.ava { font-size: 2rem; }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pts { text-align: right; color: var(--orange); font-size: 1.5rem; font-weight: 800; }
.empty { text-align: center; font-size: 1.3rem; font-weight: 700; color: #57606f; }
.src { text-align: center; color: #a4b0be; margin: 12px 0 0; font-weight: 600; }
@media (max-width: 600px) {
  .tab span { display: none; }
  li { grid-template-columns: 36px 40px 1fr 60px; font-size: 1.05rem; }
  li .stars { display: none; }
}
</style>
