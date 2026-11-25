import { store, go } from '../store'
import { saveScore } from '../services/db'
import { sfx } from './sound'

export function starsFor(correct, total) {
  const p = total ? correct / total : 0
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p >= 0.4 ? 1 : 0
}

/** Kết thúc lượt chơi: tính sao, chuyển màn kết quả, lưu điểm */
export async function finishGame({ score, correct, total }) {
  const stars = starsFor(correct, total)
  store.player.stars += stars
  store.result = {
    gameId: store.gameId,
    score,
    correct,
    total,
    stars,
    saving: true,
    cloud: null
  }
  if (stars >= 2) sfx.win()
  go('result')

  const res = await saveScore({
    name: store.player.name,
    avatar: store.player.avatar,
    grade: store.player.grade,
    game: store.gameId,
    score,
    correct,
    total,
    stars
  })
  if (store.result) {
    store.result.saving = false
    store.result.cloud = res.cloud
  }
}

export const PRAISE = [
  'Giỏi quá! 🎉',
  'Chính xác! 👏',
  'Tuyệt vời! 🌟',
  'Siêu đỉnh! 🚀',
  'Bạn thông minh quá! 🧠',
  'Đúng rồi! 💯',
  'Hoan hô! 🥳'
]

export const ENCOURAGE = ['Cố lên nhé! 💪', 'Không sao, thử lại nào! 🌈', 'Gần đúng rồi! 🍀']
