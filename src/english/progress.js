// Tiến độ học English Adventure của từng bạn (lưu trong trình duyệt).
// - XP có "sổ ghi" (ledger) để không cộng trùng khi chơi lại.
// - Theo dõi mức độ thuộc từng từ: new → learning → familiar → mastered.
import { reactive, watch } from 'vue'
import { store } from '../store'
import { WORLDS, ALL_LESSONS, lessonById, worldById } from './curriculum'
import { starsFor } from '../utils/finish'

// Điểm thưởng theo tài liệu thiết kế (mục 5.4)
export const XP = {
  LESSON: 10,
  CORRECT: 2,
  CHALLENGE: 15,
  UNIT: 30,
  WORLD: 100,
  REVIEW: 5
}

const storageKey = () => `toanvui.eng.${store.player.name || 'guest'}|${store.player.avatar}`
const blank = () => ({ xp: 0, lessons: {}, words: {}, ledger: {}, days: {} })

function load() {
  try {
    return { ...blank(), ...JSON.parse(localStorage.getItem(storageKey()) || '{}') }
  } catch {
    return blank()
  }
}

export const progress = reactive(load())

watch(progress, (p) => localStorage.setItem(storageKey(), JSON.stringify(p)), { deep: true })

// Đổi người chơi thì nạp tiến độ của bạn đó
watch(storageKey, () => {
  const data = load()
  for (const k of Object.keys(blank())) progress[k] = data[k]
})

export const today = () => new Date().toLocaleDateString('sv') // yyyy-mm-dd theo giờ máy

function day() {
  const d = today()
  return (progress.days[d] ||= { lessons: 0, correct: 0, xp: 0 })
}

/** Cộng XP đúng 1 lần cho mỗi key */
function award(key, amount, label, out) {
  if (progress.ledger[key]) return
  progress.ledger[key] = today()
  progress.xp += amount
  day().xp += amount
  out.push({ label, xp: amount })
}

// ---------- Cấp độ ----------
export const levelOf = (xp) => Math.floor(xp / 100) + 1
export const levelPct = (xp) => xp % 100

// ---------- Từ vựng ----------
export function wordStatus(en) {
  return progress.words[en]?.status || 'new'
}

export function markSeen(en) {
  progress.words[en] ||= { c: 0, w: 0, status: 'learning', last: today() }
}

export function recordAnswer(en, ok) {
  const w = (progress.words[en] ||= { c: 0, w: 0, status: 'learning', last: today() })
  w.last = today()
  if (ok) {
    w.c++
    day().correct++
    // Đếm số ngày khác nhau trả lời đúng: thành thạo cần nhớ được qua ít nhất 2 ngày
    if (w.okDay !== today()) {
      w.okDay = today()
      w.d = (w.d || 0) + 1
    }
    if (w.c >= 4 && w.d >= 2 && w.c >= w.w * 2) w.status = 'mastered'
    else if (w.c >= 2) w.status = 'familiar'
  } else {
    w.w++
    // Sai thì lùi một bậc để được ôn lại
    w.status = w.status === 'mastered' ? 'familiar' : 'learning'
  }
}

/** Từ cần ôn: hay sai hoặc lâu chưa gặp (ôn tập ngắt quãng đơn giản) */
export function weakWords(limit = 8) {
  const now = Date.now()
  return Object.entries(progress.words)
    .filter(([, w]) => w.status !== 'mastered')
    .map(([en, w]) => {
      const daysAgo = (now - new Date(w.last).getTime()) / 86400000
      return { en, score: w.w * 2 - w.c + daysAgo }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.en)
}

// ---------- Bài học & mở khóa ----------
export const isDone = (id) => (progress.lessons[id]?.stars || 0) >= 1

export function isWorldUnlocked(world) {
  return !world.after || isDone(`${world.after}.boss`)
}

export function isLessonUnlocked(lesson) {
  const world = worldById(lesson.worldId)
  if (!isWorldUnlocked(world)) return false
  const i = world.lessons.indexOf(lesson)
  return i === 0 || isDone(world.lessons[i - 1].id)
}

/** locked | available | completed | mastered */
export function lessonState(lesson) {
  const s = progress.lessons[lesson.id]?.stars || 0
  if (s >= 3) return 'mastered'
  if (s >= 1) return 'completed'
  return isLessonUnlocked(lesson) ? 'available' : 'locked'
}

export function worldProgress(world) {
  const done = world.lessons.filter((l) => isDone(l.id)).length
  return { done, total: world.lessons.length, pct: Math.round((done / world.lessons.length) * 100) }
}

/** Bài nên học tiếp theo */
export function nextLesson() {
  return ALL_LESSONS.find((l) => !isDone(l.id) && isLessonUnlocked(l)) || null
}

/**
 * Hoàn thành một bài. Trả về { stars, passed, rewards: [{label, xp}] }.
 * Không trừ điểm khi sai; chơi lại chỉ nhận XP ôn tập 1 lần/ngày.
 */
export function finishLesson(lessonId, correct, total) {
  const stars = starsFor(correct, total)
  const passed = stars >= 1
  const rewards = []

  if (lessonId === 'practice') {
    if (passed) award(`practice:${today()}`, XP.REVIEW, 'Ôn tập từ cũ', rewards)
    return { stars, passed, rewards }
  }

  const lesson = lessonById(lessonId)
  const prev = progress.lessons[lessonId]
  const firstTime = !prev || prev.stars < 1
  progress.lessons[lessonId] = {
    stars: Math.max(prev?.stars || 0, stars),
    plays: (prev?.plays || 0) + 1,
    best: Math.max(prev?.best || 0, total ? Math.round((correct / total) * 100) : 0),
    last: today()
  }
  if (!passed) return { stars, passed, rewards }

  day().lessons++
  if (firstTime) {
    award(`lesson:${lessonId}`, XP.LESSON, 'Hoàn thành bài học', rewards)
    award(`correct:${lessonId}`, correct * XP.CORRECT, `${correct} câu trả lời đúng`, rewards)
    if (lesson.kind !== 'lesson') award(`challenge:${lessonId}`, XP.CHALLENGE, 'Hoàn thành thử thách', rewards)
  } else {
    award(`replay:${lessonId}:${today()}`, XP.REVIEW, 'Ôn tập bài cũ', rewards)
  }

  // Xong bài ôn tập của unit (và mọi bài trong unit) → thưởng Unit
  if (lesson.kind === 'review') {
    const world = worldById(lesson.worldId)
    const unitDone = world.lessons.filter((l) => l.unitId === lesson.unitId).every((l) => isDone(l.id))
    if (unitDone) award(`unit:${lesson.unitId}`, XP.UNIT, 'Hoàn thành Unit', rewards)
  }
  // Thắng Boss → hoàn thành World
  if (lesson.kind === 'boss') award(`world:${lesson.worldId}`, XP.WORLD, 'Hoàn thành thế giới', rewards)

  return { stars, passed, rewards }
}

// ---------- Nhiệm vụ hôm nay ----------
export function dailyMissions() {
  const d = progress.days[today()] || { lessons: 0, correct: 0, xp: 0 }
  return [
    { icon: '📘', text: 'Hoàn thành 1 bài học', value: Math.min(d.lessons, 1), goal: 1 },
    { icon: '✅', text: 'Trả lời đúng 15 câu', value: Math.min(d.correct, 15), goal: 15 },
    { icon: '⚡', text: 'Nhận 30 XP', value: Math.min(d.xp, 30), goal: 30 }
  ]
}

export function wordStats() {
  const s = { learning: 0, familiar: 0, mastered: 0 }
  for (const w of Object.values(progress.words)) s[w.status]++
  return { ...s, total: s.learning + s.familiar + s.mastered }
}
