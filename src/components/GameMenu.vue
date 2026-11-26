<script setup>
import { store, go, startGame } from '../store'
import { computed } from 'vue'
import { gamesOf } from '../games'
import { sfx } from '../utils/sound'
import Mascot from './Mascot.vue'
import SubjectSwitch from './SubjectSwitch.vue'
import { WORLDS } from '../english/curriculum'

const games = computed(() => gamesOf(store.subject))
const greeting = computed(() =>
  store.subject === 'english'
    ? `Hello ${store.player.name}! Cùng học tiếng Anh nhé! ✨`
    : `Chào ${store.player.name}! Hôm nay mình chơi trò gì nhỉ?`
)

function play(id) {
  sfx.click()
  startGame(id)
}
</script>

<template>
  <section class="menu">
    <Mascot :text="greeting" mood="cheer" />

    <SubjectSwitch />

    <button v-if="store.subject === 'english'" class="adventure pop-in" @click="sfx.click(); go('adventure')">
      <span class="map">🗺️</span>
      <span class="txt">
        <b>English Adventure</b>
        <span>Phiêu lưu qua {{ WORLDS.length }} thế giới · học từ mới · nhận XP và viên đá ngôn ngữ 💎</span>
      </span>
      <span class="go">Vào ▶</span>
    </button>
    <h3 v-if="store.subject === 'english'" class="sub">⚡ Mini game luyện nhanh</h3>

    <div class="grid" :key="store.subject">
      <button
        v-for="(g, i) in games"
        :key="g.id"
        class="game pop-in"
        :style="{ '--c': g.color, animationDelay: i * 0.07 + 's' }"
        @click="play(g.id)"
      >
        <span class="icon">{{ g.icon }}</span>
        <span class="name">{{ g.name }}</span>
        <span class="desc">{{ g.desc }}</span>
        <span class="play">Chơi ▶</span>
      </button>

      <button class="game pop-in rank" :style="{ '--c': '#ffd93d', animationDelay: games.length * 0.07 + 's' }" @click="sfx.click(); go('leaderboard')">
        <span class="icon">🏆</span>
        <span class="name">Bảng Vàng</span>
        <span class="desc">Xem ai là nhà vô địch toán học!</span>
        <span class="play">Xem ▶</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.menu { display: flex; flex-direction: column; gap: 22px; }
.adventure {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, #58cc02, #1e90ff);
  color: #fff;
  text-align: left;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.15);
  transition: transform 0.15s;
}
.adventure:hover { transform: translateY(-4px); }
.adventure .map { font-size: 4rem; animation: wiggle 2.5s infinite; }
.adventure .txt { flex: 1; display: flex; flex-direction: column; }
.adventure b { font-size: clamp(1.6rem, 5vw, 2.2rem); text-shadow: 0 3px 0 rgba(0, 0, 0, 0.15); }
.adventure .txt span { font-weight: 700; font-size: 1.05rem; }
.adventure .go { background: #fff; color: #1e90ff; font-weight: 800; font-size: 1.3rem; padding: 8px 20px; border-radius: 999px; }
.sub { margin: 0; color: #fff; font-size: 1.4rem; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.15); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.game {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 22px 18px 18px;
  background: var(--white);
  border-radius: var(--radius);
  border-bottom: 8px solid var(--c);
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.18s;
  overflow: hidden;
}
.game::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 90px;
  background: var(--c);
  opacity: 0.18;
  border-radius: 0 0 50% 50%;
}
.game:hover { transform: translateY(-6px) rotate(-1deg); }
.game:hover .icon { animation: wiggle 0.5s ease-in-out; }
.icon { position: relative; font-size: 72px; line-height: 1.1; }
.name { font-size: 1.6rem; font-weight: 800; color: var(--c); filter: brightness(0.85); }
.desc { font-size: 1.05rem; color: #57606f; min-height: 3em; }
.play {
  margin-top: 6px;
  background: var(--c);
  color: #fff;
  font-weight: 800;
  font-size: 1.15rem;
  padding: 6px 22px;
  border-radius: 999px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
}
.rank .name, .rank .play { color: #b8860b; }
.rank .play { color: #6b4e00; }
</style>
