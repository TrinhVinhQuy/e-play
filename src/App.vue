<script setup>
import { computed } from 'vue'
import { store, go } from './store'
import { sfx } from './utils/sound'
import HomeScreen from './components/HomeScreen.vue'
import GameMenu from './components/GameMenu.vue'
import QuizGame from './components/QuizGame.vue'
import BalloonGame from './components/BalloonGame.vue'
import BoardGame from './components/BoardGame.vue'
import SpellGame from './components/SpellGame.vue'
import ResultScreen from './components/ResultScreen.vue'
import Leaderboard from './components/Leaderboard.vue'
import Fireworks from './components/Fireworks.vue'
import AdventureHome from './english/AdventureHome.vue'
import WorldScreen from './english/WorldScreen.vue'
import LessonPlayer from './english/LessonPlayer.vue'
import MyWords from './english/MyWords.vue'

const current = computed(() => {
  if (store.screen === 'home') return HomeScreen
  if (store.screen === 'menu') return GameMenu
  if (store.screen === 'play') {
    if (store.gameId === 'balloon') return BalloonGame
    if (store.gameId === 'board') return BoardGame
    if (store.gameId === 'spell') return SpellGame
    return QuizGame
  }
  if (store.screen === 'result') return ResultScreen
  if (store.screen === 'leaderboard') return Leaderboard
  if (store.screen === 'adventure') return AdventureHome
  if (store.screen === 'world') return WorldScreen
  if (store.screen === 'lesson') return LessonPlayer
  if (store.screen === 'words') return MyWords
  return HomeScreen
})

function toggleSound() {
  store.sound = !store.sound
  sfx.click()
}
</script>

<template>
  <div class="cloud" style="top: 6%; animation-duration: 70s">☁️</div>
  <div class="cloud" style="top: 18%; animation-duration: 95s; animation-delay: -40s; font-size: 60px">☁️</div>
  <div class="cloud" style="top: 32%; animation-duration: 120s; animation-delay: -80s; font-size: 50px">☁️</div>

  <header class="topbar">
    <button class="logo" @click="go(store.player.name ? 'menu' : 'home')">
      <span class="owl">🦉</span> Toán Vui
    </button>
    <div class="right">
      <div v-if="store.player.name && store.screen !== 'home'" class="me" @click="go('home')" title="Đổi người chơi">
        <span class="ava">{{ store.player.avatar }}</span>
        <span class="name">{{ store.player.name }}</span>
        <span class="grade">Lớp {{ store.player.grade }}</span>
        <span class="stars">⭐ {{ store.player.stars }}</span>
      </div>
      <button class="sound" :title="store.sound ? 'Tắt tiếng' : 'Bật tiếng'" @click="toggleSound">
        {{ store.sound ? '🔊' : '🔇' }}
      </button>
    </div>
  </header>

  <main class="main">
    <Transition name="screen" mode="out-in">
      <component :is="current" :key="store.screen + store.gameId" />
    </Transition>
  </main>

  <div class="sun">🌞</div>
  <Fireworks />
</template>

<style scoped>
.topbar {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
  flex-wrap: wrap;
}
.logo {
  background: var(--white);
  border-radius: 999px;
  padding: 6px 18px 6px 8px;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--orange);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 6px;
}
.owl { font-size: 2rem; display: inline-block; animation: wiggle 2s ease-in-out infinite; }
.right { display: flex; gap: 10px; align-items: center; }
.me {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--white);
  border-radius: 999px;
  padding: 4px 14px 4px 6px;
  box-shadow: var(--shadow);
  font-weight: 700;
  cursor: pointer;
}
.ava { font-size: 1.8rem; }
.grade { background: var(--blue); color: #fff; border-radius: 999px; padding: 0 10px; font-size: 0.9rem; }
.stars { color: #e1a100; }
.sound {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--white);
  font-size: 1.5rem;
  box-shadow: var(--shadow);
}
.main {
  position: relative;
  z-index: 2;
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 16px 60px;
}
.sun {
  position: fixed;
  top: -10px;
  right: -10px;
  font-size: 120px;
  z-index: 0;
  opacity: 0.85;
  pointer-events: none;
  animation: wiggle 6s ease-in-out infinite;
}
@media (max-width: 600px) {
  .me .name { display: none; }
  .sun { font-size: 80px; }
}
</style>
