<script setup>
import { ref } from 'vue'
import { store, go, AVATARS } from '../store'
import { GRADES } from '../games'
import { sfx } from '../utils/sound'

const name = ref(store.player.name)
const avatar = ref(store.player.avatar)
const grade = ref(store.player.grade)
const shake = ref(false)

function pickAvatar(a) {
  avatar.value = a
  sfx.pop()
}
function pickGrade(g) {
  grade.value = g
  sfx.click()
}

function start() {
  const n = name.value.trim()
  if (!n) {
    shake.value = true
    sfx.wrong()
    setTimeout(() => (shake.value = false), 500)
    return
  }
  // Đổi người chơi thì bắt đầu lại số sao
  const samePlayer = n === store.player.name && avatar.value === store.player.avatar
  store.player = {
    name: n.slice(0, 20),
    avatar: avatar.value,
    grade: grade.value,
    stars: samePlayer ? store.player.stars : 0
  }
  sfx.correct()
  go('menu')
}
</script>

<template>
  <section class="home">
    <div class="hero">
      <div class="big-owl bounce">🦉</div>
      <h1 class="title">Toán Vui</h1>
      <p class="subtitle">Vừa chơi vừa học toán cùng bạn Cú nhé!</p>
    </div>

    <div class="card form pop-in">
      <label class="label">👋 Bạn tên là gì?</label>
      <input
        v-model="name"
        class="name-input"
        :class="{ shake }"
        maxlength="20"
        placeholder="Nhập tên của bạn..."
        @keyup.enter="start"
      />

      <label class="label">🎭 Chọn bạn đồng hành</label>
      <div class="avatars">
        <button
          v-for="a in AVATARS"
          :key="a"
          class="ava"
          :class="{ active: a === avatar }"
          @click="pickAvatar(a)"
        >
          {{ a }}
        </button>
      </div>

      <label class="label">🎒 Bạn học lớp mấy?</label>
      <div class="grades">
        <button
          v-for="g in GRADES"
          :key="g"
          class="grade"
          :class="['g' + g, { active: g === grade }]"
          @click="pickGrade(g)"
        >
          Lớp {{ g }}
        </button>
      </div>

      <button class="btn green start" @click="start">🚀 Bắt đầu chơi!</button>
    </div>
  </section>
</template>

<style scoped>
.home { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.hero { text-align: center; }
.big-owl { font-size: 110px; line-height: 1; filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.12)); }
.form { width: 100%; max-width: 620px; display: flex; flex-direction: column; gap: 12px; }
.label { font-size: 1.35rem; font-weight: 800; margin-top: 6px; }
.name-input {
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 12px 20px;
  border: 4px solid #dfe4ea;
  border-radius: 20px;
  outline: none;
  transition: border-color 0.2s;
  user-select: text;
}
.name-input:focus { border-color: var(--blue); }
.avatars { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
.ava {
  font-size: 2.4rem;
  aspect-ratio: 1;
  border-radius: 20px;
  background: #f1f2f6;
  transition: transform 0.15s, background 0.2s;
}
.ava:hover { transform: scale(1.1) rotate(-5deg); }
.ava.active { background: var(--yellow); transform: scale(1.12); box-shadow: 0 0 0 4px var(--orange); }
.grades { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.grade {
  font-size: 1.2rem;
  font-weight: 800;
  padding: 12px 4px;
  border-radius: 18px;
  color: #fff;
  opacity: 0.55;
  transition: transform 0.15s, opacity 0.2s;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.15);
}
.grade.active { opacity: 1; transform: scale(1.08); }
.g1 { background: var(--pink); }
.g2 { background: var(--orange); }
.g3 { background: var(--green); }
.g4 { background: var(--blue); }
.g5 { background: var(--purple); }
.start { margin-top: 14px; font-size: 1.6rem; padding: 16px; }
@media (max-width: 520px) {
  .avatars { grid-template-columns: repeat(4, 1fr); }
  .grades { grid-template-columns: repeat(3, 1fr); }
}
</style>
