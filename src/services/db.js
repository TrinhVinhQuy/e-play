// Lưu trữ điểm số.
// - Có VITE_GAS_URL: lưu lên Google Sheet trong Google Drive qua Google Apps Script.
// - Không có: lưu trong trình duyệt (localStorage).
// Luôn lưu bản sao cục bộ để game vẫn chạy khi mất mạng.

const GAS_URL = import.meta.env.VITE_GAS_URL
export const isCloud = Boolean(GAS_URL)

const LOCAL_KEY = 'toanvui.scores'

function localScores() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLocal(rec) {
  const all = localScores()
  all.push(rec)
  localStorage.setItem(LOCAL_KEY, JSON.stringify(all.slice(-500)))
}

function topScores(list, game, grade, limit = 10) {
  // Mỗi bạn chỉ giữ điểm cao nhất
  const best = new Map()
  for (const r of list) {
    if (r.game !== game || Number(r.grade) !== Number(grade)) continue
    const k = r.name + '|' + r.avatar
    if (!best.has(k) || best.get(k).score < r.score) best.set(k, r)
  }
  return [...best.values()].sort((a, b) => b.score - a.score).slice(0, limit)
}

async function gasGet(params) {
  const res = await fetch(`${GAS_URL}?${new URLSearchParams(params)}`)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Lỗi máy chủ')
  return data
}

async function gasPost(body) {
  // text/plain để tránh CORS preflight (Apps Script không hỗ trợ OPTIONS)
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Lỗi máy chủ')
  return data
}

/** rec: { name, avatar, grade, game, score, correct, total, stars } */
export async function saveScore(rec) {
  const full = { ...rec, time: new Date().toISOString() }
  saveLocal(full)
  if (!isCloud) return { cloud: false }
  try {
    await gasPost({ action: 'saveScore', ...full })
    return { cloud: true }
  } catch (e) {
    console.warn('Không lưu được lên Google Drive:', e)
    return { cloud: false, error: e.message }
  }
}

export async function getLeaderboard(game, grade) {
  if (isCloud) {
    try {
      const data = await gasGet({ action: 'leaderboard', game, grade })
      return { source: 'cloud', rows: data.rows }
    } catch (e) {
      console.warn('Không tải được bảng xếp hạng từ Google Drive:', e)
    }
  }
  return { source: 'local', rows: topScores(localScores(), game, grade) }
}
