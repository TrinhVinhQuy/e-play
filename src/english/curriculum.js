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

// after: id thế giới phải thắng Boss trước thì mới mở (null = mở sẵn).
// Nhờ vậy có thể chèn thế giới mới vào bản đồ mà không làm khóa lại tiến độ cũ.
export const WORLDS = [
  {
    id: 'animal',
    name: 'Animal Forest',
    vi: 'Khu rừng động vật',
    icon: '🌳',
    color: '#2ed573',
    after: null,
    boss: '🦍',
    units: [
      { name: 'Pets', vi: 'Thú cưng', words: ['cat', 'dog', 'bird', 'fish', 'rabbit', 'frog'] },
      { name: 'Farm Animals', vi: 'Vật nuôi', words: ['cow', 'pig', 'duck', 'hen', 'bee'] },
      { name: 'Wild Animals', vi: 'Thú hoang dã', words: ['lion', 'tiger', 'elephant', 'monkey', 'giraffe', 'zebra', 'bear', 'snake'] }
    ]
  },
  {
    id: 'ocean',
    name: 'Ocean World',
    vi: 'Thế giới đại dương',
    icon: '🌊',
    color: '#0abde3',
    after: 'animal',
    boss: '🔱',
    units: [
      { name: 'Sea Friends', vi: 'Bạn bè dưới biển', words: ['fish', 'whale', 'dolphin', 'turtle', 'seal'] },
      { name: 'Ocean Creatures', vi: 'Sinh vật đại dương', words: ['shark', 'octopus', 'squid', 'crab', 'shrimp', 'lobster'] }
    ]
  },
  {
    id: 'fruit',
    name: 'Fruit Kingdom',
    vi: 'Vương quốc trái cây',
    icon: '🍓',
    color: '#ff6b81',
    after: 'animal',
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
    after: 'fruit',
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
    after: 'color',
    boss: '🦜',
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
    after: 'number',
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
    after: 'family',
    boss: '🤖',
    units: [
      { name: 'My Toys', vi: 'Đồ chơi của em', words: ['ball', 'kite', 'robot', 'teddy'] },
      { name: 'Toy Shop', vi: 'Cửa hàng đồ chơi', words: ['car', 'train', 'balloon', 'drum'] }
    ]
  },
  {
    id: 'vehicles',
    name: 'Vehicle City',
    vi: 'Thành phố xe cộ',
    icon: '🚦',
    color: '#ff9f43',
    after: 'toy',
    boss: '🏁',
    units: [
      { name: 'On the Road', vi: 'Trên đường phố', words: ['car', 'bus', 'taxi', 'truck', 'van', 'ambulance', 'tractor'] },
      { name: 'Wheels', vi: 'Xe có bánh', words: ['bike', 'motorbike', 'scooter', 'skateboard', 'subway'] },
      { name: 'Water and Sky', vi: 'Trên nước và trên trời', words: ['boat', 'canoe', 'ship', 'plane', 'helicopter'] }
    ]
  },
  {
    id: 'food',
    name: 'Food Street',
    vi: 'Phố ẩm thực',
    icon: '🍔',
    color: '#eccc68',
    after: 'toy',
    boss: '🍩',
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
    after: 'food',
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
    after: 'school',
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
    after: 'clothes',
    boss: '⛈️',
    units: [
      { name: 'Sunny Days', vi: 'Ngày nắng', words: ['sun', 'cloud', 'wind'] },
      { name: 'Rainy Days', vi: 'Ngày mưa', words: ['rain', 'snow', 'rainbow'] }
    ]
  },
  {
    id: 'space',
    name: 'Solar System',
    vi: 'Hệ Mặt Trời',
    icon: '🪐',
    color: '#5f27cd',
    after: 'weather',
    boss: '🌠',
    units: [
      { name: 'Our Sky', vi: 'Bầu trời của chúng ta', words: ['sun', 'moon', 'star', 'earth'] },
      { name: 'Deep Space', vi: 'Vũ trụ xa xôi', words: ['planet', 'comet', 'galaxy', 'alien'] },
      { name: 'Space Explorer', vi: 'Nhà thám hiểm vũ trụ', words: ['rocket', 'astronaut', 'telescope', 'satellite'] }
    ]
  },
  {
    id: 'daily',
    name: 'Daily Life City',
    vi: 'Thành phố sinh hoạt',
    icon: '🏙️',
    color: '#20bf6b',
    after: 'weather',
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
    after: 'daily',
    boss: '🐉',
    units: [
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
