// English Adventure – chương trình học dạng DỮ LIỆU (World → Unit → Lesson).
// Thêm/bớt thế giới, unit hay từ vựng chỉ cần sửa file này,
// không phải viết thêm trang Vue (theo nguyên tắc trong tài liệu thiết kế).
import { ALL_WORDS } from '../data/vocab'

export const WORD = Object.fromEntries(ALL_WORDS.map((w) => [w.en, w]))

// Các hoạt động trong từng loại bài (Game Template)
export const LESSON_TEMPLATES = {
  lesson: [
    { type: 'LEARN' }, // Warm-up + Learn: thẻ từ có phát âm
    { type: 'LISTENING' }, // Practice: nghe và chọn hình
    { type: 'MATCHING' }, // Practice: ghép hình với từ
    { type: 'QUIZ' }, // Challenge: nhìn hình chọn từ
    { type: 'SPELLING', max: 2 } // Challenge: đánh vần
  ],
  review: [
    { type: 'MATCHING', max: 6 },
    { type: 'LISTENING', max: 6 },
    { type: 'QUIZ', max: 6 },
    { type: 'SPELLING', max: 3 }
  ],
  boss: [
    { type: 'LISTENING', max: 8 },
    { type: 'MATCHING', max: 6 },
    { type: 'QUIZ', max: 8 },
    { type: 'SPELLING', max: 4 }
  ],
  practice: [
    { type: 'LISTENING', max: 8 },
    { type: 'MATCHING', max: 6 },
    { type: 'QUIZ', max: 8 },
    { type: 'SPELLING', max: 3 }
  ]
}

// unlock: 'open' = mở sẵn, 'previous' = mở khi qua Boss của thế giới trước
export const WORLDS = [
  {
    id: 'animal',
    name: 'Animal Forest',
    vi: 'Khu rừng động vật',
    icon: '🌳',
    color: '#2ed573',
    unlock: 'open',
    boss: '🦍',
    units: [
      { name: 'Pets', vi: 'Thú cưng', words: ['cat', 'dog', 'bird', 'fish', 'rabbit', 'frog'] },
      { name: 'Farm Animals', vi: 'Vật nuôi', words: ['cow', 'pig', 'duck', 'hen', 'bee'] },
      { name: 'Wild Animals', vi: 'Thú hoang dã', words: ['lion', 'tiger', 'elephant', 'monkey', 'giraffe', 'zebra', 'bear', 'snake'] }
    ]
  },
  {
    id: 'fruit',
    name: 'Fruit Kingdom',
    vi: 'Vương quốc trái cây',
    icon: '🍓',
    color: '#ff6b81',
    unlock: 'previous',
    boss: '🍍',
    units: [
      { name: 'Common Fruits', vi: 'Trái cây quen thuộc', words: ['apple', 'banana', 'orange', 'grapes', 'mango'] },
      { name: 'Fruit Shop', vi: 'Cửa hàng trái cây', words: ['lemon', 'pear', 'cherry', 'watermelon'] }
    ]
  },
  {
    id: 'color',
    name: 'Color Garden',
    vi: 'Khu vườn sắc màu',
    icon: '🎨',
    color: '#a55eea',
    unlock: 'previous',
    boss: '🦚',
    units: [
      { name: 'Bright Colors', vi: 'Màu tươi sáng', words: ['red', 'blue', 'green', 'yellow'] },
      { name: 'More Colors', vi: 'Thêm nhiều màu', words: ['purple', 'black', 'white', 'brown'] }
    ]
  },
  {
    id: 'number',
    name: 'Number Island',
    vi: 'Hòn đảo số đếm',
    icon: '🏝️',
    color: '#ffa502',
    unlock: 'previous',
    boss: '🐙',
    units: [
      { name: 'One to Five', vi: 'Số 1 đến 5', words: ['one', 'two', 'three', 'four', 'five'] },
      { name: 'Six to Ten', vi: 'Số 6 đến 10', words: ['six', 'seven', 'eight', 'nine', 'ten'] }
    ]
  },
  {
    id: 'family',
    name: 'Family House',
    vi: 'Ngôi nhà gia đình',
    icon: '🏠',
    color: '#ff7f50',
    unlock: 'previous',
    boss: '🐲',
    units: [
      { name: 'My Family', vi: 'Gia đình em', words: ['mother', 'father', 'baby', 'grandma', 'grandpa', 'boy', 'girl'] },
      { name: 'My Body', vi: 'Cơ thể em', words: ['eye', 'ear', 'nose', 'mouth', 'hand', 'foot', 'leg', 'tooth'] }
    ]
  },
  {
    id: 'toy',
    name: 'Toy Town',
    vi: 'Thị trấn đồ chơi',
    icon: '🧸',
    color: '#1e90ff',
    unlock: 'previous',
    boss: '🤖',
    units: [
      { name: 'My Toys', vi: 'Đồ chơi của em', words: ['ball', 'kite', 'robot', 'teddy'] },
      { name: 'Toy Shop', vi: 'Cửa hàng đồ chơi', words: ['car', 'train', 'balloon', 'drum'] }
    ]
  },
  {
    id: 'food',
    name: 'Food Street',
    vi: 'Phố ẩm thực',
    icon: '🍔',
    color: '#eccc68',
    unlock: 'previous',
    boss: '🦀',
    units: [
      { name: 'Breakfast', vi: 'Bữa sáng', words: ['bread', 'egg', 'milk', 'rice'] },
      { name: 'Snacks', vi: 'Đồ ăn vặt', words: ['cake', 'candy', 'pizza', 'cookie'] }
    ]
  },
  {
    id: 'school',
    name: 'School Town',
    vi: 'Thị trấn trường học',
    icon: '🏫',
    color: '#3742fa',
    unlock: 'previous',
    boss: '🦉',
    units: [
      { name: 'In My Bag', vi: 'Trong cặp sách', words: ['book', 'pen', 'pencil', 'ruler'] },
      { name: 'At School', vi: 'Ở trường', words: ['bag', 'school', 'scissors', 'computer'] }
    ]
  },
  {
    id: 'clothes',
    name: 'Clothes World',
    vi: 'Thế giới quần áo',
    icon: '👕',
    color: '#ff4757',
    unlock: 'previous',
    boss: '🦩',
    units: [
      { name: 'Clothes', vi: 'Quần áo', words: ['hat', 'shirt', 'dress', 'coat'] },
      { name: 'Accessories', vi: 'Phụ kiện', words: ['shoes', 'socks', 'glasses', 'gloves'] }
    ]
  },
  {
    id: 'weather',
    name: 'Weather Land',
    vi: 'Xứ sở thời tiết',
    icon: '🌦️',
    color: '#70a1ff',
    unlock: 'previous',
    boss: '⛈️',
    units: [
      { name: 'The Sky', vi: 'Bầu trời', words: ['sun', 'cloud', 'star', 'moon'] },
      { name: 'Weather', vi: 'Thời tiết', words: ['rain', 'snow', 'rainbow', 'wind'] }
    ]
  },
  {
    id: 'daily',
    name: 'Daily Life City',
    vi: 'Thành phố sinh hoạt',
    icon: '🏙️',
    color: '#20bf6b',
    unlock: 'previous',
    boss: '🦸',
    units: [
      { name: 'Actions', vi: 'Hoạt động', words: ['sing', 'dance', 'sleep', 'eat', 'paint', 'write', 'read', 'cry'] },
      { name: 'Feelings', vi: 'Cảm xúc', words: ['happy', 'sad', 'angry', 'tired', 'hot', 'cold', 'scared', 'surprised'] },
      { name: 'Jobs', vi: 'Nghề nghiệp', words: ['doctor', 'farmer', 'cook', 'pilot', 'police', 'singer', 'teacher', 'firefighter'] }
    ]
  },
  {
    id: 'travel',
    name: 'Travel Adventure',
    vi: 'Chuyến du lịch',
    icon: '✈️',
    color: '#0abde3',
    unlock: 'previous',
    boss: '🐉',
    units: [
      { name: 'Transport', vi: 'Phương tiện', words: ['bus', 'bike', 'plane', 'ship', 'taxi', 'motorbike', 'helicopter', 'rocket'] },
      { name: 'Places', vi: 'Địa điểm', words: ['house', 'hospital', 'bank', 'castle', 'beach', 'park', 'mountain', 'shop'] },
      { name: 'Nature', vi: 'Thiên nhiên', words: ['tree', 'flower', 'sea', 'leaf', 'volcano', 'desert', 'island', 'forest'] },
      { name: 'Sports', vi: 'Thể thao', words: ['swimming', 'running', 'tennis', 'badminton', 'basketball', 'cycling', 'chess', 'skating'] }
    ]
  }
]

// Chia từ của unit thành các bài 3 từ (bài cuối không để lẻ 1 từ)
function chunk(words, size = 3) {
  const out = []
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size))
  if (out.length > 1 && out[out.length - 1].length === 1) out[out.length - 2].push(...out.pop())
  return out
}

const cap = (s) => s[0].toUpperCase() + s.slice(1)

/** Danh sách bài của một thế giới, theo đúng thứ tự học */
function buildLessons(world) {
  const list = []
  world.units.forEach((u, ui) => {
    const unitId = `${world.id}.${ui + 1}`
    chunk(u.words).forEach((ws, li) => {
      list.push({
        id: `${unitId}.${li + 1}`,
        worldId: world.id,
        unitId,
        kind: 'lesson',
        title: ws.map(cap).join(', '),
        words: ws
      })
    })
    list.push({
      id: `${unitId}.review`,
      worldId: world.id,
      unitId,
      kind: 'review',
      title: `Ôn tập: ${u.name}`,
      words: u.words
    })
  })
  list.push({
    id: `${world.id}.boss`,
    worldId: world.id,
    unitId: null,
    kind: 'boss',
    title: 'Boss Challenge',
    words: world.units.flatMap((u) => u.words)
  })
  return list
}

WORLDS.forEach((w) => {
  w.lessons = buildLessons(w)
  w.units.forEach((u, i) => (u.id = `${w.id}.${i + 1}`))
  w.words = w.units.flatMap((u) => u.words)
})

export const ALL_LESSONS = WORLDS.flatMap((w) => w.lessons)
export const lessonById = (id) => ALL_LESSONS.find((l) => l.id === id)
export const worldById = (id) => WORLDS.find((w) => w.id === id)

// Kiểm tra dữ liệu khi chạy dev: từ nào khai báo mà không có trong vocab
if (import.meta.env?.DEV) {
  const missing = WORLDS.flatMap((w) => w.words).filter((en) => !WORD[en])
  if (missing.length) console.warn('[curriculum] Thiếu từ trong vocab:', missing)
}
