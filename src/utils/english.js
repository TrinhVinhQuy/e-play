// Sinh câu hỏi tiếng Anh theo lớp
import { TOPICS, ALL_WORDS } from '../data/vocab'
import { pick, shuffle } from './questions'

// Lớp hiện tại + lớp liền trước, để bé vừa học mới vừa ôn cũ
function poolFor(grade) {
  const lo = Math.max(1, grade - 1)
  return ALL_WORDS.filter((w) => w.grade >= lo && w.grade <= grade)
}

// 3 từ gây nhiễu, ưu tiên cùng chủ đề (màu với màu, con vật với con vật)
function distractors(word, n = 3) {
  const topic = TOPICS.find((t) => t.topic === word.topic)
  let others = topic.words.filter((w) => w.en !== word.en)
  if (others.length < n) others = ALL_WORDS.filter((w) => w.en !== word.en)
  return shuffle(others).slice(0, n)
}

const explain = (w) => `${w.emoji} ${w.en} – ${w.vi}`

export function genListen(grade) {
  const w = pick(poolFor(grade))
  return {
    kind: 'listen',
    key: w.en,
    word: w.en,
    prompt: 'Nghe và chọn hình đúng',
    choices: shuffle([w, ...distractors(w)].map((x) => x.emoji)),
    answer: w.emoji,
    explain: explain(w)
  }
}

export function genPicture(grade) {
  const w = pick(poolFor(grade))
  return {
    kind: 'picture',
    key: w.en,
    word: w.en,
    emoji: w.emoji,
    prompt: 'Đây là gì trong tiếng Anh?',
    choices: shuffle([w, ...distractors(w)].map((x) => x.en)),
    answer: w.en,
    explain: explain(w)
  }
}

// Độ dài tối đa của từ cần ghép theo lớp
const SPELL_MAX = { 1: 4, 2: 5, 3: 6, 4: 8, 5: 10 }
const ABC = 'abcdefghijklmnopqrstuvwxyz'

export function genSpell(grade) {
  const max = SPELL_MAX[grade] || 10
  let pool = poolFor(grade).filter((w) => /^[a-z]+$/.test(w.en) && w.en.length <= max)
  if (pool.length < 10) pool = ALL_WORDS.filter((w) => w.grade <= grade && w.en.length <= max)
  const w = pick(pool)
  // Từ lớp 3: thêm chữ cái thừa cho khó hơn
  const extra = grade >= 3 ? Math.min(3, grade - 2) : 0
  const letters = w.en.split('')
  for (let i = 0; i < extra; i++) letters.push(pick(ABC.split('').filter((c) => !w.en.includes(c))))
  return {
    kind: 'spell',
    key: w.en,
    word: w.en,
    vi: w.vi,
    emoji: w.emoji,
    prompt: 'Ghép các chữ cái thành từ đúng',
    letters: shuffle(letters),
    answer: w.en,
    explain: explain(w)
  }
}

const GEN = { listen: genListen, picture: genPicture, spell: genSpell }

export const isEnglishGame = (id) => id in GEN

export function makeEnglishQuiz(gameId, grade, n = 10) {
  const gen = GEN[gameId]
  const seen = new Set()
  const list = []
  let guard = 0
  while (list.length < n && guard++ < n * 30) {
    const q = gen(grade)
    if (seen.has(q.key)) continue
    seen.add(q.key)
    list.push(q)
  }
  return list
}
