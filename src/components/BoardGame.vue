<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { store, go } from '../store'
import { gameById } from '../games'
import { makeQuiz, pick } from '../utils/questions'
import { sfx } from '../utils/sound'
import { finishGame, PRAISE } from '../utils/finish'
import Mascot from './Mascot.vue'

const TOTAL = 10
const game = gameById(store.gameId)
const questions = makeQuiz('board', store.player.grade, TOTAL)

const GROUP_COLORS = ['#2ed573', '#1e90ff', '#ffa502', '#ff6b81', '#a55eea', '#eccc68']
const TILE_COLORS = ['#7bed9f', '#ff6b81', '#70a1ff']
const HINTS = ['Đếm lại từng hộp quà xem nào! 🔎', 'Gần đúng rồi, thử số khác nhé! 🍀', 'Không sao, cố lên! 💪']

const idx = ref(0)
const score = ref(0)
const correct = ref(0)
const mistakes = ref(0)
const solved = ref(false)
const counting = ref(false)
const say = ref('')
const mood = ref('happy')
const tiles = ref([])
const slotEl = ref(null)
const drag = ref(null)
const overSlot = ref(false)
let nextTimer = null

const q = computed(() => questions[idx.value])

// Các nhóm hộp quà minh họa cho phép tính
const panels = computed(() => {
  const { a, op, b } = q.value
  let n = 0
  const group = (count, color, crossFrom = Infinity) => ({
    color,
    items: Array.from({ length: count }, (_, i) => {
      const crossed = i >= crossFrom
      return { crossed, num: crossed ? null : ++n }
    })
  })
  if (op === '+') return [group(a, GROUP_COLORS[0]), group(b, GROUP_COLORS[1])]
  if (op === '−') return [group(a, GROUP_COLORS[0], a - b)]
  return Array.from({ length: a }, (_, i) => group(b, GROUP_COLORS[i % GROUP_COLORS.length]))
})

const totalItems = computed(() => panels.value.reduce((s, p) => s + p.items.length, 0))
const sizeClass = computed(() => (totalItems.value > 24 ? 'xs' : totalItems.value > 12 ? 'sm' : ''))

function setup() {
  solved.value = false
  counting.value = false
  mistakes.value = 0
  mood.value = 'happy'
  say.value = q.value.prompt
  tiles.value = q.value.choices.map((v, i) => ({ id: idx.value + '-' + i, value: v, color: TILE_COLORS[i], wrong: false }))
}

// ---------- Kéo thả (chuột + cảm ứng) ----------
function inSlot(x, y) {
  if (!slotEl.value) return false
  const r = slotEl.value.getBoundingClientRect()
  const pad = 30
  return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad
}

function onDown(e, t) {
  if (solved.value) return
  e.preventDefault()
  sfx.click()
  drag.value = { tile: t, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false }
}

function onMove(e) {
  const d = drag.value
  if (!d) return
  d.x = e.clientX
  d.y = e.clientY
  if (Math.hypot(d.x - d.sx, d.y - d.sy) > 8) d.moved = true
  overSlot.value = inSlot(d.x, d.y)
}

function onUp(e) {
  const d = drag.value
  if (!d) return
  drag.value = null
  overSlot.value = false
  // Chạm nhẹ (không kéo) cũng đặt số vào ô
  if (!d.moved || inSlot(e.clientX, e.clientY)) place(d.tile)
}

function dragStyle(t) {
  const d = drag.value
  if (!d || d.tile !== t) return {}
  return {
    transform: `translate(${d.x - d.sx}px, ${d.y - d.sy}px) scale(1.12) rotate(-4deg)`,
    transition: 'none',
    zIndex: 30
  }
}

// ---------- Kiểm tra đáp án ----------
function place(t) {
  if (solved.value) return
  if (t.value === q.value.answer) {
    solved.value = true
    sfx.correct()
    if (mistakes.value === 0) correct.value++
    score.value += mistakes.value === 0 ? 10 : 5
    mood.value = 'cheer'
    say.value = `${pick(PRAISE)} ${q.value.explain}`
    setTimeout(() => (counting.value = true), 300)
    const countTime = Math.min(totalItems.value, 30) * 120
    nextTimer = setTimeout(next, 1600 + countTime)
  } else {
    mistakes.value++
    t.wrong = true
    sfx.wrong()
    mood.value = 'sad'
    say.value = pick(HINTS)
    setTimeout(() => (t.wrong = false), 500)
  }
}

function next() {
  if (idx.value + 1 >= questions.length) {
    finishGame({ score: score.value, correct: correct.value, total: questions.length })
    return
  }
  idx.value++
  setup()
}

function quit() {
  sfx.click()
  go('menu')
}

onMounted(() => {
  setup()
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
})
onBeforeUnmount(() => {
  clearTimeout(nextTimer)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)
})
</script>

<template>
  <section class="board-game">
    <div class="hud">
      <button class="btn white small" @click="quit">⬅ Thoát</button>
      <div class="banner">{{ game.icon }} {{ game.name }}</div>
      <div class="score">🏅 {{ score }}</div>
    </div>

    <div class="stage">
      <div class="frame">
        <div class="chalkboard" :key="idx">
          <span class="qno">{{ idx + 1 }}/{{ TOTAL }}</span>

          <div class="equation">
            <span class="chalk c-a">{{ q.a }}</span>
            <span class="chalk c-op">{{ q.op }}</span>
            <span class="chalk c-b">{{ q.b }}</span>
            <span class="chalk c-op">=</span>
            <div ref="slotEl" class="slot" :class="{ over: overSlot, filled: solved }">
              <span v-if="solved" class="placed pop-in">{{ q.answer }}</span>
              <span v-else class="qmark">?</span>
            </div>
          </div>

          <div class="panels" :class="[sizeClass, { many: panels.length > 2 }]">
            <div v-for="(p, pi) in panels" :key="pi" class="panel">
              <div
                v-for="(it, ii) in p.items"
                :key="ii"
                class="gift pop-in"
                :class="{ crossed: it.crossed, counted: counting && it.num }"
                :style="{
                  '--c': p.color,
                  animationDelay: counting && it.num ? (it.num - 1) * 0.12 + 's' : (pi * 4 + ii) * 0.04 + 's'
                }"
              >
                <span v-if="it.crossed" class="cross">✖</span>
                <span v-if="counting && it.num" class="badge" :style="{ animationDelay: (it.num - 1) * 0.12 + 's' }">{{ it.num }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tray">
        <p class="tray-hint">Kéo số<br />vào ô ❓</p>
        <button
          v-for="t in tiles"
          :key="t.id"
          class="tile"
          :class="{ wrong: t.wrong, used: solved && t.value === q.answer, dragging: drag && drag.tile === t }"
          :style="{ '--t': t.color, ...dragStyle(t) }"
          @pointerdown="onDown($event, t)"
        >
          {{ t.value }}
        </button>
      </div>
    </div>

    <Mascot :text="say" :mood="mood" />
  </section>
</template>

<style scoped>
.board-game { display: flex; flex-direction: column; gap: 14px; }
.hud { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.banner {
  background: linear-gradient(180deg, #c56cf0, #8854d0);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 800;
  padding: 4px 28px;
  border-radius: 999px;
  border: 4px solid #fff;
  box-shadow: var(--shadow);
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}
.score { background: var(--yellow); border-radius: 999px; padding: 6px 18px; font-size: 1.4rem; font-weight: 800; box-shadow: var(--shadow); }

.stage { display: flex; gap: 16px; align-items: stretch; }

/* Bảng đen viền gỗ */
.frame {
  flex: 1;
  padding: 14px;
  border-radius: 26px;
  background: linear-gradient(135deg, #b9774a, #8d5530);
  box-shadow: inset 0 0 0 4px #6e3f21, 0 10px 0 rgba(0, 0, 0, 0.15);
}
.chalkboard {
  position: relative;
  min-height: 380px;
  padding: 18px;
  border-radius: 14px;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.06), transparent 60%),
    #2d5a45;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: board-in 0.35s ease-out;
}
@keyframes board-in {
  from { opacity: 0; transform: scale(0.96); }
}
.qno { position: absolute; top: 10px; left: 16px; color: rgba(255, 255, 255, 0.5); font-weight: 700; }

.equation { display: flex; align-items: center; justify-content: center; gap: 14px; }
.chalk {
  font-size: clamp(3rem, 9vw, 5rem);
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.4);
}
.c-a { color: #7bed9f; }
.c-b { color: #70d6ff; }
.c-op { color: #f1f2f6; }
.slot {
  width: clamp(80px, 14vw, 120px);
  height: clamp(80px, 14vw, 110px);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.25);
  border: 4px dashed rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.slot.over { border-color: var(--yellow); background: rgba(255, 217, 61, 0.25); transform: scale(1.1); }
.slot.filled { border: none; background: transparent; }
.qmark { font-size: 3.6rem; font-weight: 800; color: rgba(255, 255, 255, 0.35); animation: bounce 1.4s infinite; }
.placed {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #ff6b81;
  color: #fff;
  font-size: clamp(2.6rem, 7vw, 4rem);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -8px 0 rgba(0, 0, 0, 0.15), 0 0 0 4px #fff;
}

/* Khung hình minh họa */
.panels { flex: 1; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.panels.many { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
.panel {
  background: rgba(0, 0, 0, 0.18);
  border: 3px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 18px 10px 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  gap: 18px 10px;
}

/* Hộp quà vẽ bằng CSS */
.gift {
  --s: 54px;
  position: relative;
  width: var(--s);
  height: calc(var(--s) * 0.85);
  margin-top: calc(var(--s) * 0.22);
  border-radius: 8px;
  background:
    linear-gradient(90deg, transparent 42%, rgba(255, 255, 255, 0.8) 42% 58%, transparent 58%),
    var(--c);
  box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.15);
}
.gift::before {
  content: '';
  position: absolute;
  left: -5%;
  right: -5%;
  top: -18%;
  height: 28%;
  border-radius: 6px;
  background:
    linear-gradient(90deg, transparent 42%, rgba(255, 255, 255, 0.9) 42% 58%, transparent 58%),
    var(--c);
  filter: brightness(1.12);
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.15);
}
.gift::after {
  content: '';
  position: absolute;
  left: 50%;
  top: -42%;
  width: 46%;
  height: 26%;
  transform: translateX(-50%);
  border: 4px solid rgba(255, 255, 255, 0.9);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  border-bottom: none;
}
.panels.sm .gift { --s: 40px; }
.panels.xs .gift { --s: 30px; }
.gift.crossed { filter: grayscale(0.8) opacity(0.35); }
.cross {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4757;
  font-size: calc(var(--s) * 0.8);
  font-weight: 800;
  filter: none;
}
.gift.counted { animation: hop 0.4s ease-out both; }
@keyframes hop {
  50% { transform: translateY(-10px) scale(1.1); }
}
.badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  color: #2d5a45;
  border-radius: 999px;
  min-width: 26px;
  padding: 0 6px;
  font-weight: 800;
  font-size: 1rem;
  text-align: center;
  animation: pop-in 0.3s ease-out both;
}

/* Khay số */
.tray {
  width: 130px;
  padding: 14px 10px;
  border-radius: 24px;
  background: #2f3542;
  border: 6px solid #57606f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 14px;
}
.tray-hint { margin: 0; color: #dfe4ea; font-weight: 700; text-align: center; line-height: 1.2; }
.tile {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 18px;
  background: var(--t);
  color: #fff;
  font-size: 3rem;
  font-weight: 800;
  text-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 -8px 0 rgba(0, 0, 0, 0.18), inset 0 0 0 4px rgba(255, 255, 255, 0.35), 0 6px 0 rgba(0, 0, 0, 0.3);
  touch-action: none;
  cursor: grab;
  transition: transform 0.25s cubic-bezier(0.3, 1.5, 0.6, 1), opacity 0.2s;
}
.tile:hover { transform: scale(1.06) rotate(-3deg); }
.tile.dragging { cursor: grabbing; box-shadow: 0 16px 24px rgba(0, 0, 0, 0.35); }
.tile.wrong { animation: shake 0.45s; background: #b2bec3; }
.tile.used { visibility: hidden; }

@media (max-width: 700px) {
  .stage { flex-direction: column; }
  .tray { width: auto; flex-direction: row; }
  .tray-hint br { display: none; }
  .tile { width: 80px; height: 80px; font-size: 2.4rem; }
  .banner { font-size: 1.1rem; padding: 4px 14px; }
}
</style>
