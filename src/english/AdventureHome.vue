<script setup>
// Trang chủ English Adventure: nhân vật, tiến độ, nhiệm vụ hôm nay, bản đồ thế giới
import { computed } from 'vue'
import { store, go } from '../store'
import { WORLDS, worldById } from './curriculum'
import { progress, levelOf, levelPct, nextLesson, isWorldUnlocked, worldProgress, dailyMissions, wordStats } from './progress'
import { sfx } from '../utils/sound'
import Mascot from '../components/Mascot.vue'

const next = computed(() => nextLesson())
const missions = computed(() => dailyMissions())
const stats = computed(() => wordStats())

function openWorld(w) {
  if (!isWorldUnlocked(w)) {
    sfx.wrong()
    return
  }
  sfx.click()
  store.worldId = w.id
  go('world')
}

function continueLearning() {
  sfx.click()
  if (!next.value) return go('words')
  store.lessonId = next.value.id
  go('lesson')
}
</script>

<template>
  <section class="adv">
    <div class="head">
      <button class="btn white small" @click="sfx.click(); go('menu')">⬅ Menu</button>
      <h1 class="title">🗺️ English Adventure</h1>
      <button class="btn purple small" @click="sfx.click(); go('words')">📚 Từ của tôi</button>
    </div>

    <div class="top">
      <!-- Nhân vật & tiến độ -->
      <div class="card me">
        <div class="ava">{{ store.player.avatar }}<span class="pet">🦊</span></div>
        <div class="info">
          <b>{{ store.player.name }}</b>
          <div class="lv">Cấp {{ levelOf(progress.xp) }} · {{ progress.xp }} XP</div>
          <div class="xpbar"><div :style="{ width: levelPct(progress.xp) + '%' }" /></div>
          <div class="ws">📖 {{ stats.total }} từ đã học · 👑 {{ stats.mastered }} thành thạo</div>
        </div>
      </div>

      <!-- Nhiệm vụ hôm nay -->
      <div class="card missions">
        <b>🎯 Nhiệm vụ hôm nay</b>
        <div v-for="m in missions" :key="m.text" class="mission" :class="{ done: m.value >= m.goal }">
          <span>{{ m.icon }} {{ m.text }}</span>
          <span class="mbar"><i :style="{ width: (m.value / m.goal) * 100 + '%' }" /></span>
          <small>{{ m.value >= m.goal ? '✔' : `${m.value}/${m.goal}` }}</small>
        </div>
      </div>
    </div>

    <!-- Bài học tiếp theo -->
    <button class="next card" @click="continueLearning">
      <span class="big">{{ next ? worldById(next.worldId).icon : '📚' }}</span>
      <span class="txt">
        <small>{{ next ? 'Bài học tiếp theo' : 'Bạn đã đi hết bản đồ!' }}</small>
        <b>{{ next ? next.title : 'Ôn tập từ vựng' }}</b>
        <span v-if="next">{{ worldById(next.worldId).name }}</span>
      </span>
      <span class="go">▶</span>
    </button>

    <Mascot face="🦊" mood="cheer" text="Mình là Foxy! Cùng tìm lại những viên đá ngôn ngữ nhé! 💎" />

    <!-- Bản đồ thế giới -->
    <div class="map">
      <button
        v-for="(w, i) in WORLDS"
        :key="w.id"
        class="island pop-in"
        :class="{ locked: !isWorldUnlocked(w), left: i % 2 === 0 }"
        :style="{ '--w': w.color, animationDelay: i * 0.04 + 's' }"
        @click="openWorld(w)"
      >
        <span class="icon">{{ isWorldUnlocked(w) ? w.icon : '🔒' }}</span>
        <span class="name">{{ w.name }}</span>
        <span class="vi">{{ w.vi }}</span>
        <span class="prog">
          <i :style="{ width: worldProgress(w).pct + '%' }" />
        </span>
        <small>{{ worldProgress(w).done }}/{{ worldProgress(w).total }} bài<template v-if="worldProgress(w).pct === 100"> · 💎</template></small>
      </button>
    </div>
  </section>
</template>

<style scoped>
.adv { display: flex; flex-direction: column; gap: 16px; }
.head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.title { font-size: clamp(1.6rem, 5vw, 2.6rem); }
.top { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.me { display: flex; gap: 16px; align-items: center; }
.ava { position: relative; font-size: 72px; line-height: 1; }
.pet { position: absolute; right: -14px; bottom: -6px; font-size: 36px; animation: bounce 2s infinite; }
.info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.info b { font-size: 1.5rem; }
.lv { font-weight: 800; color: #8854d0; }
.xpbar { height: 14px; background: #f1f2f6; border-radius: 99px; overflow: hidden; }
.xpbar div { height: 100%; background: linear-gradient(90deg, #a55eea, #ffd93d); transition: width 0.5s; }
.ws { font-weight: 700; color: #57606f; font-size: 0.95rem; }
.missions { display: flex; flex-direction: column; gap: 8px; }
.missions > b { font-size: 1.2rem; }
.mission { display: grid; grid-template-columns: 1fr 80px 40px; align-items: center; gap: 8px; font-weight: 700; }
.mbar { height: 10px; background: #f1f2f6; border-radius: 99px; overflow: hidden; }
.mbar i { display: block; height: 100%; background: var(--orange); }
.mission.done { color: #1e8e4a; }
.mission.done .mbar i { background: var(--green); }
.mission small { text-align: right; font-weight: 800; }

.next {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  background: linear-gradient(135deg, #58cc02, #2ed573);
  color: #fff;
  border-bottom: 6px solid #3a9a00;
}
.next .big { font-size: 3.4rem; }
.next .txt { flex: 1; display: flex; flex-direction: column; }
.next small { font-weight: 800; opacity: 0.9; font-size: 1rem; }
.next b { font-size: 1.7rem; }
.next .go { font-size: 2rem; background: rgba(255, 255, 255, 0.25); border-radius: 50%; width: 56px; height: 56px; display: grid; place-items: center; }
.next:hover { filter: brightness(1.05); }

.map { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.island {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 16px 12px;
  border-radius: 28px;
  background: #fff;
  border-bottom: 7px solid var(--w);
  box-shadow: var(--shadow);
  transition: transform 0.15s;
}
.island:hover { transform: translateY(-5px); }
.island .icon { font-size: 3.4rem; line-height: 1.2; }
.island .name { font-size: 1.25rem; font-weight: 800; color: var(--w); filter: brightness(0.85); }
.island .vi { font-size: 0.95rem; color: #57606f; font-weight: 600; }
.island .prog { width: 80%; height: 10px; background: #f1f2f6; border-radius: 99px; overflow: hidden; margin-top: 6px; }
.island .prog i { display: block; height: 100%; background: var(--w); }
.island small { font-weight: 700; color: #747d8c; }
.island.locked { filter: grayscale(0.9); opacity: 0.65; }
@media (max-width: 700px) {
  .top { grid-template-columns: 1fr; }
  .map { grid-template-columns: repeat(2, 1fr); }
}
</style>
