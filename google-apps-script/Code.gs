/**
 * Toán Vui – "cơ sở dữ liệu" trên Google Drive
 *
 * Script này gắn với một Google Sheet nằm trong Google Drive của bạn.
 * Mỗi lượt chơi được ghi thành 1 dòng ở trang tính "Scores".
 * Cách cài đặt: xem README.md, mục "Kết nối Google Drive".
 */

const SHEET_NAME = 'Scores'
const HEADERS = ['time', 'name', 'avatar', 'grade', 'game', 'score', 'correct', 'total', 'stars']
const GAMES = ['board', 'balloon', 'calc', 'compare', 'count', 'missing']

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sh = ss.getSheetByName(SHEET_NAME)
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME)
    sh.appendRow(HEADERS)
    sh.setFrozenRows(1)
  }
  return sh
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

function int_(v, min, max) {
  const n = Math.round(Number(v))
  if (!isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

// Chặn chèn công thức vào Google Sheet (tên bắt đầu bằng = + - @)
function text_(v, maxLen) {
  let s = String(v == null ? '' : v).trim().slice(0, maxLen)
  if (/^[=+\-@]/.test(s)) s = "'" + s
  return s
}

function doGet(e) {
  try {
    const p = (e && e.parameter) || {}
    if (p.action === 'leaderboard') return json_({ ok: true, rows: leaderboard_(p.game, p.grade) })
    if (p.action === 'ping') return json_({ ok: true })
    return json_({ ok: false, error: 'Hành động không hợp lệ' })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    if (data.action !== 'saveScore') return json_({ ok: false, error: 'Hành động không hợp lệ' })
    if (GAMES.indexOf(data.game) < 0) return json_({ ok: false, error: 'Trò chơi không hợp lệ' })

    const total = int_(data.total, 1, 50)
    const row = [
      new Date(),
      text_(data.name, 20) || 'Bạn nhỏ',
      text_(data.avatar, 8),
      int_(data.grade, 1, 5),
      data.game,
      int_(data.score, 0, 1000),
      int_(data.correct, 0, total),
      total,
      int_(data.stars, 0, 3)
    ]

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)
    try {
      getSheet_().appendRow(row)
    } finally {
      lock.releaseLock()
    }
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

/** Top 10 theo trò chơi + lớp, mỗi bạn chỉ lấy điểm cao nhất */
function leaderboard_(game, grade) {
  const values = getSheet_().getDataRange().getValues()
  const g = Number(grade)
  const best = {}
  for (let i = 1; i < values.length; i++) {
    const r = values[i]
    if (r[4] !== game || Number(r[3]) !== g) continue
    const key = r[1] + '|' + r[2]
    const score = Number(r[5])
    if (!best[key] || best[key].score < score) {
      best[key] = { name: String(r[1]).replace(/^'/, ''), avatar: r[2], grade: g, game: r[4], score: score, stars: Number(r[8]) }
    }
  }
  return Object.keys(best)
    .map(function (k) { return best[k] })
    .sort(function (a, b) { return b.score - a.score })
    .slice(0, 10)
}
