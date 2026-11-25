# 🦉 Toán Vui – Game học toán cho học sinh tiểu học

Trang web học toán dạng trò chơi cho học sinh **lớp 1 đến lớp 5**, viết bằng **Vue 3 + Vite**, lưu điểm vào **Google Drive** (một Google Sheet và Google Apps Script).

## Trò chơi

| Trò chơi | Nội dung |
|---|---|
| 🧮 **Bảng Thần Kỳ** | Bảng đen có hình hộp quà minh họa phép tính (+, −, ×). Kéo thả hoặc chạm vào thẻ số để điền vào ô ❓. Khi đúng, các hộp quà được đếm lần lượt |
| 🎈 **Bắn Bóng Bay** | Chạm vào quả bóng có đáp án đúng trước khi nó bay mất. Có 3 mạng ❤️ |
| ⚡ **Tính Nhanh** | Cộng, trừ, nhân, chia. Trả lời càng nhanh càng được nhiều điểm |
| 🐊 **So Sánh** | Chọn dấu `<`, `=` hoặc `>` |
| 🍎 **Đếm Hình** | Đếm đồ vật. Từ lớp 3 trở lên là đếm theo nhóm (phép nhân) |
| 🎁 **Số Bí Ẩn** | Tìm số còn thiếu: `5 + ? = 12` |
| 🏆 **Bảng Vàng** | Bảng xếp hạng theo từng trò chơi và từng lớp |

### Tiếng Anh

Ở menu, bấm nút **🔤 Tiếng Anh** để chuyển môn.

#### 🗺️ English Adventure (theo tài liệu thiết kế English Adventure Kids, bản MVP giao diện)

Bé đi qua **12 thế giới** (Animal Forest, Fruit Kingdom, Color Garden, Number Island, Family House, Toy Town, Food Street, School Town, Clothes World, Weather Land, Daily Life City, Travel Adventure). Mỗi thế giới gồm các **Unit**, mỗi Unit gồm các **Lesson** (3 từ mỗi bài) và một bài **Ôn tập**. Cuối mỗi thế giới có **Boss Challenge**. Tổng cộng 92 bài.

- **Một bài học:** Learn (thẻ từ có hình, nghĩa, phát âm) → Listening (nghe chọn hình) → Matching (ghép hình với từ) → Quiz (nhìn hình chọn từ) → Spelling (đánh vần) → Tổng kết.
- **Điểm thưởng:** hoàn thành bài +10 XP, mỗi câu đúng +2 XP, hoàn thành thử thách (Ôn tập/Boss) +15 XP, hoàn thành Unit +30 XP, thắng Boss +100 XP, ôn lại bài cũ +5 XP.
  - Có sổ ghi để không cộng trùng: chơi lại một bài chỉ được +5 XP, mỗi ngày một lần.
  - Trả lời sai không bị trừ điểm.
- **Mở khóa:** phải qua bài trước (đạt ít nhất 1 sao) mới mở bài sau. Thắng Boss thì mở thế giới tiếp theo. Cách mở khóa của từng thế giới cấu hình bằng trường `unlock` trong dữ liệu.
- **Từ của tôi:** mỗi từ có trạng thái Đang học → Đã nhận biết → Thành thạo. Muốn thành thạo, bé phải trả lời đúng ở ít nhất 2 ngày khác nhau. Nút **Ôn tập** chọn ra những từ hay sai hoặc lâu chưa gặp.
- **Nhiệm vụ hôm nay**, cấp độ (mỗi 100 XP lên một cấp), và bạn đồng hành Foxy 🦊.

Chương trình học là **dữ liệu**, không viết cứng trong từng trang:
- `src/english/curriculum.js` định nghĩa World, Unit, danh sách từ và các mẫu bài (Game Template).
- `src/english/engine.js` đọc cấu hình đó và tạo ra các hoạt động trong bài.
- Muốn thêm thế giới hoặc thêm bài, chỉ cần sửa file dữ liệu.

Tiến độ hiện lưu trong trình duyệt (`localStorage`), riêng cho từng người chơi.

#### Mini game luyện nhanh

| Trò chơi | Nội dung |
|---|---|
| 🎧 **Nghe & Chọn** | Trình duyệt đọc to một từ tiếng Anh, bé chọn bức tranh đúng. Bấm 🔊 để nghe lại |
| 🖼️ **Đoán Từ** | Nhìn hình và chọn từ tiếng Anh đúng |
| 🔤 **Ghép Chữ** | Nghe và nhìn hình, rồi chạm các chữ cái theo đúng thứ tự. Sai 2 lần thì hiện gợi ý chữ tiếp theo |

Từ vựng gồm khoảng 150 từ, chia theo 19 chủ đề và theo lớp, nằm trong file `src/data/vocab.js`. Mỗi lượt chơi lấy từ của lớp hiện tại và lớp liền trước. Mỗi từ có nghĩa tiếng Việt và một hình emoji. Muốn thêm từ, bạn chỉ cần thêm một dòng `['từ', 'nghĩa', 'emoji']` vào chủ đề phù hợp.

- **Lớp 1:** con vật, hoa quả, màu sắc, số đếm
- **Lớp 2:** cơ thể, gia đình, đồ chơi, đồ ăn
- **Lớp 3:** đồ dùng học tập, quần áo, thời tiết
- **Lớp 4:** nghề nghiệp, thể thao, thú hoang dã, địa điểm
- **Lớp 5:** phương tiện, hoạt động, cảm xúc, thiên nhiên

Giọng đọc dùng sẵn của trình duyệt (Web Speech API), không cần file âm thanh. Chrome và Edge có giọng tiếng Anh tốt nhất. Trên điện thoại, cần tắt chế độ im lặng thì mới nghe được.

### Mức độ khó môn Toán theo lớp

- **Lớp 1:** cộng, trừ trong phạm vi 10 và 20
- **Lớp 2:** cộng, trừ trong phạm vi 100; bảng nhân và chia 2 đến 5
- **Lớp 3:** cộng, trừ trong phạm vi 1.000; bảng nhân và chia 2 đến 9
- **Lớp 4:** cộng, trừ trong phạm vi 10.000; nhân và chia với số có 1 chữ số
- **Lớp 5:** cộng, trừ trong phạm vi 100.000; nhân và chia với số có 2 chữ số

Mỗi lượt chơi có 10 câu và cho tối đa 3 ⭐. Có âm thanh (bật hoặc tắt bằng nút 🔊), pháo giấy khi đạt điểm cao, và bạn Cú 🦉 động viên các bé.

## Chạy thử

```powershell
npm install
npm run dev
```

Sau đó mở http://localhost:5173

Nếu **chưa** kết nối Google Drive, game vẫn chạy bình thường và lưu điểm trên trình duyệt (localStorage).

## Kết nối Google Drive

1. Vào [Google Drive](https://drive.google.com) và tạo một **Google Sheet** mới, ví dụ đặt tên `ToanVui-DB`.
2. Trong Sheet, chọn **Tiện ích mở rộng → Apps Script**.
3. Xóa code mẫu, dán toàn bộ nội dung file [`google-apps-script/Code.gs`](google-apps-script/Code.gs) vào, rồi bấm **Lưu**.
4. Bấm **Triển khai → Tùy chọn triển khai mới**:
   - Loại: **Ứng dụng web**
   - Thực thi với tư cách: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
5. Cấp quyền khi được hỏi, rồi sao chép **URL ứng dụng web** (có dạng `https://script.google.com/macros/s/.../exec`).
6. Trong thư mục dự án, tạo file `.env`:

   ```
   VITE_GAS_URL=https://script.google.com/macros/s/XXXX/exec
   ```

7. Chạy lại `npm run dev`. Từ giờ điểm được ghi vào trang tính **Scores** trong Sheet, và Bảng Vàng đọc dữ liệu từ đó.

> Mỗi lần sửa `Code.gs`, bạn cần **Quản lý triển khai → Chỉnh sửa → Phiên bản mới** để thay đổi có hiệu lực.

**Lưu ý:** URL Apps Script là công khai, nên ai có URL đều có thể gửi điểm. Script đã giới hạn giá trị hợp lệ (điểm, lớp, độ dài tên) và chặn chèn công thức vào Sheet. Mức bảo vệ này đủ cho một game học tập, nhưng không nên lưu thông tin cá nhân nhạy cảm của học sinh.

## Đưa lên mạng

```powershell
npm run build
```

Thư mục `dist/` là trang web tĩnh. Bạn có thể đưa lên GitHub Pages, Netlify, Vercel hoặc Firebase Hosting.

### Netlify

Dự án đã có sẵn file `netlify.toml`, nên Netlify tự biết lệnh build và thư mục cần đưa lên.

1. Vào [app.netlify.com](https://app.netlify.com), chọn **Add new project → Import an existing project → GitHub**, rồi chọn repo `e-play`.
2. Giữ nguyên các thiết lập build (Netlify đọc từ `netlify.toml`) và bấm **Deploy**.
3. Nếu đã có URL Apps Script: vào **Project configuration → Environment variables**, thêm `VITE_GAS_URL` = URL đó, rồi vào **Deploys → Trigger deploy** để build lại.

Từ đó, mỗi lần `git push` lên nhánh `main`, Netlify tự build và cập nhật trang.

## Cấu trúc

```
src/
  App.vue                 khung trang, thanh trên cùng, chuyển màn hình
  store.js                trạng thái người chơi (lưu trong localStorage)
  games.js                danh sách trò chơi
  utils/questions.js      sinh câu hỏi theo từng lớp
  utils/sound.js          hiệu ứng âm thanh (Web Audio, không cần file)
  utils/finish.js         tính sao và lưu điểm khi kết thúc
  services/db.js          lưu và đọc điểm (Google Drive hoặc localStorage)
  components/             các màn hình: Home, Menu, Quiz, Balloon, Result, Leaderboard
google-apps-script/Code.gs   API trên Google Drive (Google Sheet)
```
