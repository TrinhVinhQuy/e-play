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

Mức độ khó theo lớp:

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
