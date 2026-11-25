// Game Engine: đọc cấu hình bài học (template) → tạo danh sách hoạt động + câu hỏi.
// Mỗi loại hoạt động là một component nhận `step` và báo kết quả từng câu.
import { WORD, WORLDS, LESSON_TEMPLATES, lessonById, worldById } from './curriculum'
import { ALL_WORDS } from '../data/vocab'
import { shuffle } from '../utils/questions'
import { weakWords } from './progress'

// Độ dài tối đa của từ cần đánh vần theo lớp (bé nhỏ không phải viết dài)
const SPELL_MAX = { 1: 5, 2: 6, 3: 8, 4: 10, 5: 12 }

/** 3 từ gây nhiễu: ưu tiên cùng thế giới, rồi cùng chủ đề, rồi bất kỳ */
function distractors(en, pool, n = 3) {
  const w = WORD[en]
  const tiers = [
    pool.filter((x) => x !== en),
    ALL_WORDS.filter((x) => x.topic === w.topic && x.en !== en).map((x) => x.en),
    ALL_WORDS.filter((x) => x.en !== en).map((x) => x.en)
  ]
  const out = []
  for (const tier of tiers) {
    for (const x of shuffle(tier)) {
      if (out.length >= n) return out
      if (!out.includes(x)) out.push(x)
    }
  }
  return out
}

function choiceQuestions(words, pool) {
  return words.map((en) => ({
    word: en,
    choices: shuffle([en, ...distractors(en, pool)])
  }))
}

function makeStep(tpl, words, pool, grade) {
  const pick = (n) => shuffle(words).slice(0, n || words.length)
  switch (tpl.type) {
    case 'LEARN':
      return { type: 'LEARN', words }
    case 'LISTENING':
    case 'QUIZ':
      return { type: tpl.type, questions: choiceQuestions(pick(tpl.max), pool) }
    case 'MATCHING': {
      const ws = pick(Math.min(tpl.max || 6, words.length))
      // Ghép tối thiểu 3 cặp: thêm từ cùng thế giới nếu bài ít từ
      while (ws.length < 3) ws.push(distractors(ws[0], pool).find((x) => !ws.includes(x)))
      return { type: 'MATCHING', words: ws }
    }
    case 'SPELLING': {
      const max = SPELL_MAX[grade] || 12
      const ok = shuffle(words.filter((en) => /^[a-z]+$/.test(en) && en.length <= max))
      if (!ok.length) return null
      return { type: 'SPELLING', words: ok.slice(0, tpl.max || 2), extra: grade >= 3 ? 2 : 0 }
    }
  }
  return null
}

/**
 * Tạo phiên học. lessonId = id bài trong curriculum, hoặc 'practice' (ôn từ khó).
 */
export function buildSession(lessonId, grade) {
  if (lessonId === 'practice') {
    let words = weakWords(8)
    if (words.length < 3) words = [...new Set([...words, ...shuffle(WORLDS[0].words)])].slice(0, 6)
    return {
      lesson: { id: 'practice', kind: 'practice', title: 'Ôn tập từ khó', words },
      world: { name: 'My Learning', color: '#8854d0', icon: '📚' },
      steps: LESSON_TEMPLATES.practice.map((t) => makeStep(t, words, words, grade)).filter(Boolean)
    }
  }
  const lesson = lessonById(lessonId)
  const world = worldById(lesson.worldId)
  const steps = LESSON_TEMPLATES[lesson.kind].map((t) => makeStep(t, lesson.words, world.words, grade)).filter(Boolean)
  return { lesson, world, steps }
}

/** Số câu được chấm điểm trong phiên (để vẽ thanh tiến độ) */
export function countItems(steps) {
  return steps.reduce((n, s) => n + (s.questions?.length || (s.type === 'LEARN' ? 0 : s.words.length)), 0)
}

export const STEP_INFO = {
  LEARN: { icon: '📖', title: 'Học từ mới', hint: 'Chạm vào thẻ để nghe phát âm' },
  LISTENING: { icon: '🎧', title: 'Nghe và chọn hình', hint: 'Bấm loa để nghe lại' },
  MATCHING: { icon: '🧩', title: 'Ghép hình với từ', hint: 'Chạm một hình rồi chạm từ đúng' },
  QUIZ: { icon: '🖼️', title: 'What is this?', hint: 'Chọn từ đúng với hình' },
  SPELLING: { icon: '🔤', title: 'Đánh vần', hint: 'Chạm các chữ cái theo thứ tự' }
}
