import { reactive, watch } from 'vue'

const KEY = 'toanvui.player'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}

const saved = load()

export const AVATARS = ['🐶', '🐱', '🐰', '🐼', '🦊', '🐯', '🐸', '🐵', '🦄', '🐧', '🐨', '🦁']

export const store = reactive({
  screen: saved?.name ? 'menu' : 'home',
  player: saved || { name: '', avatar: '🐶', grade: 1, stars: 0 },
  gameId: null,
  result: null,
  sound: localStorage.getItem('toanvui.sound') !== 'off'
})

watch(
  () => store.player,
  (p) => localStorage.setItem(KEY, JSON.stringify(p)),
  { deep: true }
)
watch(
  () => store.sound,
  (s) => localStorage.setItem('toanvui.sound', s ? 'on' : 'off')
)

export function go(screen) {
  store.screen = screen
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function startGame(id) {
  store.gameId = id
  go('play')
}
