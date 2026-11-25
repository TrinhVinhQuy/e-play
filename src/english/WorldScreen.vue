<script setup>
// Một thế giới: các Unit, mỗi Unit là một con đường nhiều chặng bài học, cuối cùng là Boss
import { computed } from 'vue'
import { store, go } from '../store'
import { worldById, WORD } from './curriculum'
import { progress, lessonState, worldProgress } from './progress'
import { sfx } from '../utils/sound'

const world = computed(() => worldById(store.worldId) || worldById('animal'))
const prog = computed(() => worldProgress(world.value))

// Nhóm bài theo unit
const units = computed(() =>
  world.value.units.map((u) => ({ ...u, lessons: world.value.lessons.filter((l) => l.unitId === u.id) }))
)
const boss = computed(() => world.value.lessons.find((l) => l.kind === 'boss'))

// Xếp nút theo đường zig-zag
const OFFSETS = [0, 60, 90, 60, 0, -60, -90, -60]

function open(l) {
  if (lessonState(l) === 'locked') {
    sfx.wrong()
    return
  }
  sfx.click()
  store.lessonId = l.id
  go('lesson')
}

const stars = (l) => progress.lessons[l.id]?.stars || 0
const icon = (l) => (l.kind === 'review' ? '🔁' : WORD[l.words[0]].emoji)
</script>

<template>
  <section class="world" :style="{ '--w': world.color }">
    <div class="head">
      <button class="btn white small" @click="sfx.click(); go('adventure')">⬅ Bản đồ</button>
      <div class="banner">
        <span class="ic">{{ world.icon }}</span>
        <div>
          <b>{{ world.name }}</b>
          <small>{{ world.vi }} · {{ prog.done }}/{{ prog.total }} bài</small>
        </div>
      </div>
      <span />
    </div>

    <div v-for="(u, ui) in units" :key="u.id" class="unit">
      <div class="unit-head card">
        <small>UNIT {{ ui + 1 }}</small>
        <b>{{ u.name }}</b>
        <span>{{ u.vi }} · {{ u.words.map((en) => WORD[en].emoji).join(' ') }}</span>
      </div>

      <div class="path">
        <div
          v-for="(l, li) in u.lessons"
          :key="l.id"
          class="node-wrap"
          :style="{ transform: `translateX(${OFFSETS[li % OFFSETS.length]}px)` }"
        >
          <div v-if="lessonState(l) === 'available'" class="start">BẮT ĐẦU</div>
          <button class="node" :class="[lessonState(l), l.kind]" :title="l.title" @click="open(l)">
            <span class="emo">{{ lessonState(l) === 'locked' ? '🔒' : lessonState(l) === 'mastered' ? '👑' : icon(l) }}</span>
          </button>
          <div class="label">{{ l.kind === 'review' ? 'Ôn tập' : l.title }}</div>
          <div class="st">
            <span v-for="k in 3" :key="k" :class="{ on: k <= stars(l) }">★</span>
          </div>
        </div>
      </div>
    </div>

    <div class="boss-wrap">
      <div v-if="lessonState(boss) === 'available'" class="start">THỬ THÁCH CUỐI</div>
      <button class="boss" :class="lessonState(boss)" @click="open(boss)">
        <span>{{ lessonState(boss) === 'locked' ? '🔒' : world.boss }}</span>
      </button>
      <b>Boss Challenge</b>
      <small v-if="lessonState(boss) === 'locked'">Hoàn thành mọi bài để mở khóa</small>
      <small v-else-if="stars(boss)">💎 Đã tìm thấy viên đá ngôn ngữ!</small>
      <small v-else>Thắng Boss để mở thế giới tiếp theo</small>
    </div>
  </section>
</template>

<style scoped>
.world { display: flex; flex-direction: column; gap: 18px; align-items: center; }
.head { width: 100%; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; }
.banner { justify-self: center; display: flex; align-items: center; gap: 12px; background: var(--w); color: #fff; padding: 8px 24px 8px 12px; border-radius: 999px; box-shadow: var(--shadow); }
.banner .ic { font-size: 2.6rem; }
.banner b { display: block; font-size: 1.5rem; }
.banner small { font-weight: 700; opacity: 0.95; }
.unit { width: 100%; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.unit-head { width: 100%; display: flex; flex-direction: column; padding: 14px 20px; border-left: 10px solid var(--w); }
.unit-head small { font-weight: 800; color: var(--w); filter: brightness(0.85); }
.unit-head b { font-size: 1.5rem; }
.unit-head span { color: #57606f; font-weight: 600; }
.path { display: flex; flex-direction: column; align-items: center; gap: 26px; padding: 22px 0 6px; }
.node-wrap { position: relative; display: flex; flex-direction: column; align-items: center; }
.node {
  width: 86px;
  height: 80px;
  border-radius: 50%;
  background: var(--w);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2), inset 0 -6px 0 rgba(0, 0, 0, 0.12);
  display: grid;
  place-items: center;
  transition: transform 0.12s;
}
.node .emo { font-size: 2.4rem; }
.node:active { transform: translateY(5px); box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2); }
.node.review { border-radius: 24px; }
.node.locked { background: #ced6e0; }
.node.locked .emo { opacity: 0.7; font-size: 1.8rem; }
.node.available { box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2), 0 0 0 8px rgba(255, 255, 255, 0.8); animation: bounce 1.6s infinite; }
.node.mastered { background: linear-gradient(135deg, #ffd93d, #ffa502); }
.label { margin-top: 6px; font-weight: 800; font-size: 0.95rem; color: #1b4f72; background: rgba(255, 255, 255, 0.85); border-radius: 10px; padding: 0 8px; max-width: 170px; text-align: center; }
.st { font-size: 1.1rem; letter-spacing: 1px; color: rgba(0, 0, 0, 0.15); }
.st .on { color: #ffc312; }
.start {
  position: absolute;
  top: -34px;
  white-space: nowrap;
  background: #fff;
  color: var(--w);
  font-weight: 800;
  padding: 2px 12px;
  border-radius: 10px;
  box-shadow: var(--shadow);
  z-index: 2;
}
.boss-wrap { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 20px; }
.boss {
  width: 130px;
  height: 130px;
  border-radius: 36px;
  font-size: 4.4rem;
  background: linear-gradient(135deg, #2f3542, #57606f);
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.3);
}
.boss.available { background: linear-gradient(135deg, #ff4757, #a55eea); animation: wiggle 1.5s infinite; }
.boss.completed, .boss.mastered { background: linear-gradient(135deg, #ffd93d, #ffa502); }
.boss-wrap b { font-size: 1.4rem; color: #fff; text-shadow: 0 3px 0 rgba(0, 0, 0, 0.2); }
.boss-wrap small { font-weight: 700; background: rgba(255, 255, 255, 0.85); border-radius: 10px; padding: 2px 10px; }
@media (max-width: 500px) {
  .node-wrap { transform: none !important; }
}
</style>
