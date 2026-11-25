export const SUBJECTS = [
  { id: 'math', name: 'Toán', icon: '🔢', color: '#ffa502' },
  { id: 'english', name: 'Tiếng Anh', icon: '🔤', color: '#1e90ff' }
]

export const GAMES = [
  // ---------- Toán ----------
  {
    id: 'board',
    subject: 'math',
    name: 'Bảng Thần Kỳ',
    icon: '🧮',
    color: '#8854d0',
    desc: 'Nhìn hình hộp quà rồi kéo số đúng vào ô dấu hỏi.'
  },
  {
    id: 'balloon',
    subject: 'math',
    name: 'Bắn Bóng Bay',
    icon: '🎈',
    color: '#ff6b81',
    desc: 'Chạm vào quả bóng có đáp án đúng trước khi nó bay mất!'
  },
  {
    id: 'calc',
    subject: 'math',
    name: 'Tính Nhanh',
    icon: '⚡',
    color: '#ffa502',
    desc: 'Giải phép tính thật nhanh để nhận thêm điểm thưởng.'
  },
  {
    id: 'compare',
    subject: 'math',
    name: 'So Sánh',
    icon: '🐊',
    color: '#2ed573',
    desc: 'Chọn dấu lớn hơn, bé hơn hay bằng nhau.'
  },
  {
    id: 'count',
    subject: 'math',
    name: 'Đếm Hình',
    icon: '🍎',
    color: '#1e90ff',
    desc: 'Đếm xem có bao nhiêu đồ vật nhé!'
  },
  {
    id: 'missing',
    subject: 'math',
    name: 'Số Bí Ẩn',
    icon: '🎁',
    color: '#a55eea',
    desc: 'Tìm con số đang trốn trong hộp quà.'
  },

  // ---------- Tiếng Anh ----------
  {
    id: 'listen',
    subject: 'english',
    name: 'Nghe & Chọn',
    icon: '🎧',
    color: '#1e90ff',
    desc: 'Nghe từ tiếng Anh rồi chọn bức tranh đúng.'
  },
  {
    id: 'picture',
    subject: 'english',
    name: 'Đoán Từ',
    icon: '🖼️',
    color: '#ff6b81',
    desc: 'Nhìn hình và chọn từ tiếng Anh đúng.'
  },
  {
    id: 'spell',
    subject: 'english',
    name: 'Ghép Chữ',
    icon: '🔤',
    color: '#8854d0',
    desc: 'Chạm các chữ cái theo thứ tự để viết đúng từ.'
  }
]

export const gameById = (id) => GAMES.find((g) => g.id === id)
export const gamesOf = (subject) => GAMES.filter((g) => g.subject === subject)

export const GRADES = [1, 2, 3, 4, 5]
