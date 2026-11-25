// Từ vựng tiếng Anh tiểu học theo chủ đề, chia theo lớp.
// Mỗi từ: [tiếng Anh, nghĩa tiếng Việt, hình emoji]
// Lưu ý: không để 2 từ dùng chung 1 hình, tránh gây nhầm khi chọn hình.

const T = (grade, topic, icon, words) => ({
  grade,
  topic,
  icon,
  words: words.map(([en, vi, emoji]) => ({ en, vi, emoji, topic, grade }))
})

export const TOPICS = [
  // ---------- Lớp 1 ----------
  T(1, 'Con vật', '🐾', [
    ['cat', 'con mèo', '🐱'],
    ['dog', 'con chó', '🐶'],
    ['fish', 'con cá', '🐟'],
    ['bird', 'con chim', '🐦'],
    ['duck', 'con vịt', '🦆'],
    ['pig', 'con lợn', '🐷'],
    ['cow', 'con bò', '🐮'],
    ['hen', 'con gà mái', '🐔'],
    ['frog', 'con ếch', '🐸'],
    ['bee', 'con ong', '🐝']
  ]),
  T(1, 'Hoa quả', '🍓', [
    ['apple', 'quả táo', '🍎'],
    ['banana', 'quả chuối', '🍌'],
    ['orange', 'quả cam', '🍊'],
    ['grapes', 'chùm nho', '🍇'],
    ['mango', 'quả xoài', '🥭'],
    ['lemon', 'quả chanh', '🍋'],
    ['pear', 'quả lê', '🍐'],
    ['cherry', 'quả anh đào', '🍒'],
    ['watermelon', 'quả dưa hấu', '🍉']
  ]),
  T(1, 'Màu sắc', '🎨', [
    ['red', 'màu đỏ', '🔴'],
    ['blue', 'màu xanh dương', '🔵'],
    ['green', 'màu xanh lá', '🟢'],
    ['yellow', 'màu vàng', '🟡'],
    ['purple', 'màu tím', '🟣'],
    ['black', 'màu đen', '⚫'],
    ['white', 'màu trắng', '⚪'],
    ['brown', 'màu nâu', '🟤']
  ]),
  T(1, 'Số đếm', '🔢', [
    ['one', 'số một', '1️⃣'],
    ['two', 'số hai', '2️⃣'],
    ['three', 'số ba', '3️⃣'],
    ['four', 'số bốn', '4️⃣'],
    ['five', 'số năm', '5️⃣'],
    ['six', 'số sáu', '6️⃣'],
    ['seven', 'số bảy', '7️⃣'],
    ['eight', 'số tám', '8️⃣'],
    ['nine', 'số chín', '9️⃣'],
    ['ten', 'số mười', '🔟']
  ]),

  // ---------- Lớp 2 ----------
  T(2, 'Cơ thể', '🧍', [
    ['eye', 'con mắt', '👁️'],
    ['ear', 'cái tai', '👂'],
    ['nose', 'cái mũi', '👃'],
    ['mouth', 'cái miệng', '👄'],
    ['hand', 'bàn tay', '✋'],
    ['foot', 'bàn chân', '🦶'],
    ['leg', 'cái chân', '🦵'],
    ['tooth', 'cái răng', '🦷']
  ]),
  T(2, 'Gia đình', '👨‍👩‍👧', [
    ['mother', 'mẹ', '👩'],
    ['father', 'bố', '👨'],
    ['baby', 'em bé', '👶'],
    ['grandma', 'bà', '👵'],
    ['grandpa', 'ông', '👴'],
    ['boy', 'bạn trai', '👦'],
    ['girl', 'bạn gái', '👧']
  ]),
  T(2, 'Đồ chơi', '🧸', [
    ['ball', 'quả bóng', '⚽'],
    ['kite', 'con diều', '🪁'],
    ['robot', 'người máy', '🤖'],
    ['car', 'xe ô tô', '🚗'],
    ['train', 'tàu hỏa', '🚂'],
    ['balloon', 'bóng bay', '🎈'],
    ['drum', 'cái trống', '🥁'],
    ['teddy', 'gấu bông', '🧸']
  ]),
  T(2, 'Đồ ăn', '🍞', [
    ['bread', 'bánh mì', '🍞'],
    ['egg', 'quả trứng', '🥚'],
    ['milk', 'sữa', '🥛'],
    ['rice', 'cơm', '🍚'],
    ['cake', 'bánh ga tô', '🎂'],
    ['candy', 'kẹo', '🍬'],
    ['pizza', 'bánh pi-za', '🍕'],
    ['cookie', 'bánh quy', '🍪']
  ]),

  // ---------- Lớp 3 ----------
  T(3, 'Đồ dùng học tập', '🎒', [
    ['book', 'quyển sách', '📕'],
    ['pen', 'bút mực', '🖊️'],
    ['pencil', 'bút chì', '✏️'],
    ['ruler', 'thước kẻ', '📏'],
    ['bag', 'cặp sách', '🎒'],
    ['school', 'trường học', '🏫'],
    ['scissors', 'cái kéo', '✂️'],
    ['computer', 'máy tính', '💻']
  ]),
  T(3, 'Quần áo', '👕', [
    ['hat', 'cái mũ', '👒'],
    ['shirt', 'áo sơ mi', '👕'],
    ['dress', 'váy liền', '👗'],
    ['shoes', 'đôi giày', '👟'],
    ['socks', 'đôi tất', '🧦'],
    ['coat', 'áo khoác', '🧥'],
    ['glasses', 'kính mắt', '👓'],
    ['gloves', 'găng tay', '🧤']
  ]),
  T(3, 'Thời tiết', '🌦️', [
    ['sun', 'mặt trời', '☀️'],
    ['rain', 'mưa', '🌧️'],
    ['cloud', 'đám mây', '☁️'],
    ['snow', 'tuyết', '❄️'],
    ['rainbow', 'cầu vồng', '🌈'],
    ['wind', 'gió', '💨'],
    ['star', 'ngôi sao', '⭐'],
    ['moon', 'mặt trăng', '🌙']
  ]),

  // ---------- Lớp 4 ----------
  T(4, 'Nghề nghiệp', '🧑‍💼', [
    ['doctor', 'bác sĩ', '🧑‍⚕️'],
    ['farmer', 'nông dân', '🧑‍🌾'],
    ['cook', 'đầu bếp', '🧑‍🍳'],
    ['pilot', 'phi công', '🧑‍✈️'],
    ['police', 'cảnh sát', '👮'],
    ['singer', 'ca sĩ', '🧑‍🎤'],
    ['teacher', 'giáo viên', '🧑‍🏫'],
    ['firefighter', 'lính cứu hỏa', '🧑‍🚒']
  ]),
  T(4, 'Thể thao', '🏅', [
    ['swimming', 'bơi lội', '🏊'],
    ['running', 'chạy bộ', '🏃'],
    ['tennis', 'quần vợt', '🎾'],
    ['badminton', 'cầu lông', '🏸'],
    ['basketball', 'bóng rổ', '🏀'],
    ['cycling', 'đạp xe', '🚴'],
    ['chess', 'cờ vua', '♟️'],
    ['skating', 'trượt băng', '⛸️']
  ]),
  T(4, 'Thú hoang dã', '🦁', [
    ['lion', 'sư tử', '🦁'],
    ['tiger', 'con hổ', '🐯'],
    ['elephant', 'con voi', '🐘'],
    ['monkey', 'con khỉ', '🐒'],
    ['giraffe', 'hươu cao cổ', '🦒'],
    ['zebra', 'ngựa vằn', '🦓'],
    ['bear', 'con gấu', '🐻'],
    ['snake', 'con rắn', '🐍'],
    ['rabbit', 'con thỏ', '🐰']
  ]),
  T(4, 'Địa điểm', '🗺️', [
    ['house', 'ngôi nhà', '🏠'],
    ['hospital', 'bệnh viện', '🏥'],
    ['bank', 'ngân hàng', '🏦'],
    ['castle', 'lâu đài', '🏰'],
    ['beach', 'bãi biển', '🏖️'],
    ['park', 'công viên', '🏞️'],
    ['mountain', 'ngọn núi', '⛰️'],
    ['shop', 'cửa hàng', '🏪']
  ]),

  // ---------- Lớp 5 ----------
  T(5, 'Phương tiện', '🚦', [
    ['bus', 'xe buýt', '🚌'],
    ['bike', 'xe đạp', '🚲'],
    ['plane', 'máy bay', '✈️'],
    ['ship', 'tàu thủy', '🚢'],
    ['taxi', 'xe taxi', '🚕'],
    ['motorbike', 'xe máy', '🏍️'],
    ['helicopter', 'trực thăng', '🚁'],
    ['rocket', 'tên lửa', '🚀']
  ]),
  T(5, 'Hoạt động', '🎭', [
    ['sing', 'hát', '🎤'],
    ['dance', 'nhảy múa', '💃'],
    ['sleep', 'ngủ', '😴'],
    ['eat', 'ăn', '🍽️'],
    ['paint', 'vẽ tranh', '🎨'],
    ['write', 'viết', '✍️'],
    ['read', 'đọc', '📖'],
    ['cry', 'khóc', '😭']
  ]),
  T(5, 'Cảm xúc', '😊', [
    ['happy', 'vui vẻ', '😊'],
    ['sad', 'buồn', '😞'],
    ['angry', 'tức giận', '😠'],
    ['tired', 'mệt mỏi', '🥱'],
    ['hot', 'nóng', '🥵'],
    ['cold', 'lạnh', '🥶'],
    ['scared', 'sợ hãi', '😱'],
    ['surprised', 'ngạc nhiên', '😮']
  ]),
  T(5, 'Thiên nhiên', '🌳', [
    ['tree', 'cái cây', '🌳'],
    ['flower', 'bông hoa', '🌸'],
    ['sea', 'biển', '🌊'],
    ['leaf', 'chiếc lá', '🍃'],
    ['volcano', 'núi lửa', '🌋'],
    ['desert', 'sa mạc', '🏜️'],
    ['island', 'hòn đảo', '🏝️'],
    ['forest', 'khu rừng', '🌲']
  ])
]

export const ALL_WORDS = TOPICS.flatMap((t) => t.words)
