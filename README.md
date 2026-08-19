# 🎡 NamePicker Pro

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.1.0-emerald.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Language](https://img.shields.io/badge/languages-VI%20%7C%20EN-purple.svg)
![Design System](https://img.shields.io/badge/design%20system-PhongDang%20UI-indigo.svg)

**Công cụ vòng quay may mắn chọn tên ngẫu nhiên, bốc thăm trúng thưởng và phân nhóm lớp học đa năng.**  
Giao diện Glassmorphism cao cấp, Synthetic Web Audio API đa âm sắc, hiệu ứng pháo hoa Canvas Confetti, chọn phông chữ tùy biến, popup Cài đặt chuyên sâu và hỗ trợ Song ngữ Anh / Việt hoàn chỉnh.

🌐 **Subdomain:** [https://namepicker.phongdang.io.vn](https://namepicker.phongdang.io.vn)  
🏛️ **Hệ sinh thái:** [https://phongdang.io.vn](https://phongdang.io.vn)

</div>

---

## ✨ Tính Năng Nâng Cấp Toàn Diện (v2.1.0)

### 1. 🔊 Nâng Cấp Động Cơ Âm Thanh Tổng Hợp (Synthetic Web Audio API)
* **Zero Dependency & 100% Offline:** Tự sinh âm thanh bằng bộ dao động Oscillator & Gain envelope, không cần tải bất kỳ file MP3 nào.
* **5 Kiểu tiếng tạch tạch (Tick sound):**
  * ⚙️ *Cơ học (Mechanical Click)*
  * 🪵 *Gõ gỗ (Woodblock Ping)*
  * 🔔 *Chuông ngân (Metallic Bell)*
  * 👾 *Game 8-bit (Retro Arcade)*
  * 🫧 *Nhẹ nhàng (Soft Tap)*
* **4 Kiểu tiếng chiến thắng (Victory Fanfare):**
  * 🎺 *Kèn đồng chiến thắng (Grand Fanfare)*
  * ✨ *Chuông thần kỳ (Magical Chime)*
  * 👏 *Tiếng vỗ tay hoan hô (Crowd Applause)*
  * 🎮 *Nhạc thắng game (Retro Jingle)*
* **Thanh trượt âm lượng (Volume):** Tùy chỉnh từ 0% đến 100% kèm nút bấm thử mẫu âm thanh trực tiếp trong Cài đặt.
* **🗣️ Giọng Đọc AI Xướng Tên Người Thắng (Google Web Speech TTS):**
  * Tự động đọc vang *"Xin chúc mừng [Tên]!"* hoặc *"Congratulations [Name]!"* khi bốc thăm trúng.
  * Tự động nhận diện các giọng đọc tự nhiên miễn phí của Google và hệ thống (Vietnamese & English).
  * **Mặc định TẮT (OFF)** — có thể bật/tắt, chọn giọng và bấm "Thử giọng đọc" trong Cài Đặt ➜ Tab Âm thanh.

### 2. 🎨 6 Bảng Phối Màu Vòng Quay & Biểu Tượng Tâm
* **Bảng màu:**
  * 🌈 **Rainbow** (Đa sắc rực rỡ)
  * ⚡ **Cyberpunk** (Neon phát sáng)
  * 🍬 **Pastel** (Tông màu phấn ngọt ngào)
  * 👑 **Royal Gold** (Vàng hoàng gia & Xanh thẫm)
  * 🌅 **Sunset** (Hoàng hôn ấm áp)
  * 🌊 **Ocean Cyan** (Đại dương xanh mát)
* **Biểu tượng trục quay trung tâm:** Thay đổi giữa `★`, `👑`, `🏆`, `💎`, `🔥`, `❤️`.

### 3. 🔤 Tùy Chọn Phông Chữ (Font Family Engine)
* Lựa chọn phông chữ hiển thị trên nan quay và toàn giao diện:
  * **Inter** (Hiện đại, tối giản)
  * **Montserrat** (Đậm đà, năng động)
  * **Playfair Display** (Cổ điển, sang trọng)
  * **Quicksand** (Bo tròn, thân thiện)
  * **JetBrains Mono** (Kỹ thuật, monospace)
  * **Oswald** (Gọn gàng, mạnh mẽ)

### 4. ⚙️ Hộp Thoại Cài Đặt Hệ Thống (Settings Modal)
* Thiết kế Glassmorphism dạng Tabs khoa học:
  * 🎡 **Vòng quay:** Thời gian quay, Bảng màu, Biểu tượng tâm, Bật/tắt tự động mở modal, Bật/tắt pháo hoa.
  * 🔊 **Âm thanh:** Bật/tắt, Âm lượng, Kiểu tiếng gõ nan, Kiểu tiếng thắng, Nút nghe thử.
  * 🔤 **Phông & Màu:** Lựa chọn phông chữ và bảng màu trực quan.
  * 🌐 **Ngôn ngữ:** Chuyển đổi Tiếng Việt / English.

### 5. 🌐 Hỗ Trợ Song Ngữ Toàn Diện (Vietnamese & English i18n)
* Chuyển đổi ngôn ngữ tức thì với 1 click (`🇻🇳 VI` ⇋ `🇬🇧 EN`).
* Tự động điều chỉnh cả từ điển giao diện lẫn bộ danh sách mẫu (Classroom names, Numbers, Prizes, Teams).

### 6. 🎛️ Bật / Tắt Ẩn Hiện Danh Sách & Lịch Sử (Responsive Focus Mode)
* **2 Nút Toggle trên Topbar:** Bấm nhanh `👥 Danh Sách` và `🏆 Lịch Sử` để ẩn/hiện từng cột.
* **Nút thu nhỏ `◀ Ẩn` / `Ẩn ▶` trên đầu mỗi cột:** Cho phép ẩn nhanh chỉ với 1 click.
* **Tự động phóng to Vòng quay:** Khi ẩn cả 2 cột bên, vòng quay sẽ tự động phóng to tối đa (chế độ Trình chiếu Presentation Focus) cực kỳ bắt mắt cho lớp học và sự kiện.
* **Lưu trạng thái:** Tự động ghi nhớ tùy chọn ẩn/hiện cột vào `LocalStorage`.

### 7. 🏆 Phím Tắt & Toàn Màn Hình
* Phím tắt: **Space** để Quay/Đóng modal, **Escape** để đóng nhanh.
* Xuất file kết quả Text `.txt`.
* Chế độ **Toàn màn hình (Fullscreen)** chuyên dụng cho máy chiếu trường học.

---

## 📁 Cấu Trúc Dự Án

```
namepicker/
├── index.html            # Giao diện chính của ứng dụng
├── assets/
│   └── favicon.svg       # Favicon vector vòng quay may mắn
├── css/
│   └── style.css         # Design system & CSS responsive tokens
├── js/
│   ├── i18n.js           # Bộ từ điển song ngữ Anh / Việt
│   ├── sound.js          # Web Audio API multi-style acoustic engine
│   ├── confetti.js       # Canvas 2D particle confetti system
│   ├── wheel-engine.js   # Canvas wheel physics, drawing, palettes & fonts
│   └── app.js            # App controller, presets, history, settings modal & events
└── README.md             # Tài liệu hướng dẫn dự án
```

---

## 💻 Chạy Cục Bộ (Local Development)

```bash
# Python
python3 -m http.server 8080

# Hoặc Node.js serve
npx -y serve . -p 8080
```
Truy cập trình duyệt: `http://localhost:8080`

---

## 📄 Bản Quyền
Phát triển và duy trì bởi **[Phong Đặng](https://phongdang.io.vn)** © 2026. MIT License.
