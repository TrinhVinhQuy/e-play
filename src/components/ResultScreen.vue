<script setup>
import { computed } from 'vue'
import { store, go, startGame } from '../store'
import { gameById } from '../games'
import { isCloud } from '../services/db'
import { sfx } from '../utils/sound'
import Confetti from './Confetti.vue'

const r = store.result || { gameId: 'calc', score: 0, correct: 0, total: 10, stars: 0 }
const game = gameById(r.gameId)

const MESSAGES = [
  'Đừng buồn nhé, mình luyện thêm là giỏi ngay! 🌱',
  'Khá lắm! Cố thêm chút nữa nào! 💪',
  'Giỏi lắm! Bạn làm tốt quá! 🌟',
  'Xuất sắc! Bạn là thiên tài toán học! 🏆'
]
const message = computed(() => MESSAGES[r.stars])

function again() {
  sfx.click()
  startGame(r.gameId)
}
</script>

<template>
  <section class="result">
    <Confetti v-if="r.stars >= 2" />

    <div class="card box pop-in">
      <div class="avatar bounce">{{ store.player.avatar }}</div>
      <h2>{{ game.icon }} {{ game.name }}</h2>

      <div class="stars">
        <span
          v-for="i in 3"
          :key="i"
          class="star"
          :class="{ on: i <= r.stars }"
          :style="{ animationDelay: 0.3 + i * 0.25 + 's' }"
        >⭐</span>
      </div>

      <p class="msg">{{ message }}</p>

      <div class="stats">
        <div class="stat"><b>{{ r.score }}</b><span>Điểm</span></div>
        <div class="stat"><b>{{ r.correct }}/{{ r.total }}</b><span>Câu đúng</span></div>
        <div class="stat"><b>+{{ r.stars }}</b><span>Sao</span></div>
      </div>

      <p class="save">
        <template v-if="r.saving">⏳ Đang lưu điểm...</template>
        <template v-else-if="r.cloud">☁️ Đã lưu điểm lên Google Drive</template>
        <template v-else-if="isCloud">📱 Đã lưu trên máy (chưa kết nối được Google Drive)</template>
        <template v-else>📱 Đã lưu điểm trên máy này</template>
      </p>

      <div class="actions">
        <button class="btn green" @click="again">🔁 Chơi lại</button>
        <button class="btn blue" @click="sfx.click(); go('menu')">🎮 Trò khác</button>
        <button class="btn" @click="sfx.click(); go('leaderboard')">🏆 Bảng vàng</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.result { display: flex; justify-content: center; }
.box { width: 100%; max-width: 560px; text-align: center; padding-top: 10px; }
.avatar { font-size: 90px; line-height: 1.2; }
h2 { margin: 0; font-size: 1.8rem; }
.stars { display: flex; justify-content: center; gap: 10px; margin: 8px 0; }
.star { font-size: 64px; filter: grayscale(1) opacity(0.3); animation: pop-in 0.5s ease-out both; }
.star.on { filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.12)); }
.star:nth-child(2) { transform: translateY(-14px); font-size: 78px; }
.msg { font-size: 1.4rem; font-weight: 700; margin: 4px 0 14px; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.stat { background: #f1f2f6; border-radius: 20px; padding: 10px; display: flex; flex-direction: column; }
.stat b { font-size: 2rem; color: var(--orange); }
.stat span { font-weight: 700; color: #57606f; }
.save { color: #57606f; font-weight: 600; }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 6px; }
</style>
