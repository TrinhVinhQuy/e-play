// Sinh câu hỏi toán theo chương trình tiểu học (lớp 1 → 5)

export const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
export const pick = (arr) => arr[rnd(0, arr.length - 1)]
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const fmt = (n) => n.toLocaleString('vi-VN')

// Phạm vi cộng/trừ theo lớp
const ADD_MAX = { 1: 20, 2: 100, 3: 1000, 4: 10000, 5: 100000 }

const OPS = {
  1: ['+', '−'],
  2: ['+', '−', '+', '−', '×', '÷'],
  3: ['+', '−', '×', '÷'],
  4: ['+', '−', '×', '÷'],
  5: ['+', '−', '×', '÷']
}

function mulPair(grade) {
  switch (grade) {
    case 2: return [rnd(2, 5), rnd(1, 10)]
    case 3: return [rnd(2, 9), rnd(1, 10)]
    case 4: return [rnd(11, 999), rnd(2, 9)]
    default: return [rnd(11, 99), rnd(11, 99)]
  }
}

/** Một phép tính: { a, op, b, ans } */
export function genOp(grade) {
  const op = pick(OPS[grade] || OPS[1])
  if (op === '+' || op === '−') {
    // Lớp 1: nửa số câu trong phạm vi 10
    const max = grade === 1 && Math.random() < 0.5 ? 10 : ADD_MAX[grade]
    const lo = grade === 1 ? 1 : Math.floor(max / 20)
    if (op === '+') {
      const a = rnd(lo, max - lo)
      const b = rnd(lo, max - a)
      return { a, op, b, ans: a + b }
    }
    const a = rnd(lo, max)
    const b = rnd(Math.min(lo, a), a)
    return { a, op, b, ans: a - b }
  }
  const [x, y] = mulPair(grade)
  if (op === '×') return { a: x, op, b: y, ans: x * y }
  // Chia hết: (x*y) : x = y
  return { a: x * y, op: '÷', b: x, ans: y }
}

/** Tạo 4 lựa chọn gồm đáp án và 3 đáp án nhiễu gần đúng */
export function makeChoices(ans) {
  const mag = Math.max(1, 10 ** Math.max(0, String(ans).length - 2))
  const deltas = shuffle([1, -1, 2, -2, 3, -3, 10, -10, mag, -mag, 2 * mag, -2 * mag])
  const set = new Set([ans])
  for (const d of deltas) {
    if (set.size >= 4) break
    const v = ans + d
    if (v >= 0) set.add(v)
  }
  let k = 4
  while (set.size < 4) set.add(ans + k++)
  return shuffle([...set])
}

// ---------- Các loại câu hỏi ----------

export function genCalc(grade) {
  const { a, op, b, ans } = genOp(grade)
  return {
    kind: 'calc',
    prompt: 'Kết quả là bao nhiêu?',
    parts: [fmt(a), op, fmt(b), '=', '?'],
    choices: makeChoices(ans),
    answer: ans,
    explain: `${fmt(a)} ${op} ${fmt(b)} = ${fmt(ans)}`
  }
}

export function genCompare(grade) {
  let leftText, leftVal
  if (grade === 1) {
    leftVal = rnd(0, 20)
    leftText = fmt(leftVal)
  } else {
    const { a, op, b, ans } = genOp(grade)
    leftVal = ans
    leftText = `${fmt(a)} ${op} ${fmt(b)}`
  }
  let rightVal
  const r = Math.random()
  if (r < 0.3) rightVal = leftVal
  else {
    const spread = Math.max(2, Math.round(leftVal * 0.1))
    rightVal = Math.max(0, leftVal + (Math.random() < 0.5 ? -1 : 1) * rnd(1, spread))
    if (grade === 1) rightVal = Math.min(20, rightVal)
    if (rightVal === leftVal) rightVal = leftVal + 1
  }
  const answer = leftVal > rightVal ? '>' : leftVal < rightVal ? '<' : '='
  return {
    kind: 'compare',
    prompt: 'Chọn dấu thích hợp',
    parts: [leftText, '?', fmt(rightVal)],
    choices: ['<', '=', '>'],
    answer,
    explain: `${leftText} ${answer} ${fmt(rightVal)}`
  }
}

const THINGS = ['🍎', '🍓', '🌟', '🐟', '🌸', '🍌', '🐞', '🎈', '🍪', '🦋', '🚗', '⚽']

export function genCount(grade) {
  const emoji = pick(THINGS)
  if (grade <= 2) {
    const n = grade === 1 ? rnd(1, 10) : rnd(6, 20)
    return {
      kind: 'count',
      prompt: `Có bao nhiêu ${emoji}?`,
      groups: [n],
      emoji,
      choices: makeChoices(n),
      answer: n,
      explain: `Có ${n} ${emoji}`
    }
  }
  // Lớp 3+: đếm theo nhóm → phép nhân
  const g = grade === 3 ? rnd(2, 5) : rnd(3, 6)
  const each = grade === 3 ? rnd(2, 5) : rnd(3, 7)
  const ans = g * each
  return {
    kind: 'count',
    prompt: `Có ${g} nhóm, mỗi nhóm ${each} ${emoji}. Tất cả có bao nhiêu?`,
    groups: Array(g).fill(each),
    emoji,
    choices: makeChoices(ans),
    answer: ans,
    explain: `${g} × ${each} = ${ans}`
  }
}

export function genMissing(grade) {
  const { a, op, b, ans } = genOp(grade)
  const hideA = Math.random() < 0.5
  const answer = hideA ? a : b
  const parts = [hideA ? '?' : fmt(a), op, hideA ? fmt(b) : '?', '=', fmt(ans)]
  return {
    kind: 'missing',
    prompt: 'Số nào đang trốn trong hộp quà?',
    parts,
    choices: makeChoices(answer),
    answer,
    explain: `${fmt(a)} ${op} ${fmt(b)} = ${fmt(ans)}`
  }
}

// Bảng thần kỳ: phép tính nhỏ có hình minh họa, kéo số vào ô trống
export function genBoard(grade) {
  const addMax = grade === 1 ? 10 : 20
  const useMul = grade >= 3 && Math.random() < (grade === 3 ? 0.5 : 0.7)
  let a, op, b, ans, prompt
  if (useMul) {
    op = '×'
    a = rnd(2, grade === 3 ? 4 : 5)
    b = rnd(2, grade === 3 ? 5 : 6)
    ans = a * b
    prompt = `Có ${a} nhóm, mỗi nhóm ${b} hộp quà. Tất cả có bao nhiêu?`
  } else if (Math.random() < 0.55) {
    op = '+'
    a = rnd(1, addMax - 1)
    b = rnd(1, addMax - a)
    ans = a + b
    prompt = 'Gộp hai nhóm quà lại, có tất cả bao nhiêu?'
  } else {
    op = '−'
    a = rnd(2, addMax)
    b = rnd(1, a - 1)
    ans = a - b
    prompt = `Có ${a} hộp quà, lấy đi ${b} hộp. Còn lại bao nhiêu?`
  }
  const near = shuffle([1, -1, 2, -2].map((d) => ans + d).filter((v) => v >= 0))
  return {
    kind: 'board',
    a,
    op,
    b,
    prompt,
    parts: [String(a), op, String(b), '=', '?'],
    choices: shuffle([ans, near[0], near[1]]),
    answer: ans,
    explain: `${a} ${op} ${b} = ${ans}`
  }
}

const GENERATORS = {
  board: genBoard,
  calc: genCalc,
  balloon: genCalc,
  compare: genCompare,
  count: genCount,
  missing: genMissing
}

/** Tạo bộ n câu hỏi, tránh trùng lặp */
export function makeQuiz(gameId, grade, n = 10) {
  const gen = GENERATORS[gameId] || genCalc
  const seen = new Set()
  const list = []
  let guard = 0
  while (list.length < n && guard++ < n * 20) {
    const q = gen(grade)
    const key = (q.parts || []).join(' ') + q.prompt + (q.groups || []).join(',')
    if (seen.has(key)) continue
    seen.add(key)
    list.push(q)
  }
  return list
}

export const formatNum = fmt
