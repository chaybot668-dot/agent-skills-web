# Hướng dẫn bật “Nhận ebook miễn phí” (email tự động)

Website là trang tĩnh nên không tự gửi email được. Cách làm đúng: dùng một dịch vụ email marketing (có gói miễn phí) để
**thu email + tự động gửi ebook**. Website chỉ chuyển email của khách sang dịch vụ đó.

Luồng hoạt động: Khách nhập email → website gửi tới dịch vụ → dịch vụ gửi email xác nhận → khách bấm xác nhận →
dịch vụ gửi email chứa link tải ebook (tự động, bạn không phải làm gì).

## Bước 1. Chuẩn bị ebook
- File PDF hoàn chỉnh. **Không bỏ file PDF vào thư mục website** (ai biết đường dẫn cũng tải được, không cần email).
- Tải PDF lên nơi lưu riêng: Google Drive (chia sẻ “Bất kỳ ai có đường liên kết”) hoặc kho file của chính dịch vụ email.
- Lấy đường link tải.

## Bước 2. Chọn dịch vụ email (chọn một)
Phổ biến, có gói miễn phí: **MailerLite**, **Brevo**, **Mailchimp**. Hạn mức gói miễn phí thay đổi theo thời gian,
hãy xem trang giá của họ trước khi chọn. Cần chắc chắn gói miễn phí có: (1) form đăng ký, (2) email tự động (automation/welcome email),
(3) xác nhận email hai bước (double opt-in).

## Bước 3. Tạo danh sách và form
1. Tạo tài khoản, xác minh email người gửi (nên dùng email thật của thương hiệu).
2. Tạo danh sách (audience/group), ví dụ “Ebook”.
3. Tạo form đăng ký (hosted/embedded form) cho danh sách đó. **Bật xác nhận hai bước (double opt-in).**
4. Tạo email tự động gửi ngay sau khi đăng ký thành công (welcome / automation): tiêu đề, lời chào ngắn, **link tải ebook** từ Bước 1.
5. Bật (publish) automation. Gửi thử bằng email của chính bạn.

## Bước 4. Lấy thông tin gắn vào website
Trong phần “Embed / HTML” của form, tìm thẻ `<form ... action="...">`. Cần 4 thứ:
- **action**: địa chỉ bắt đầu bằng `https://` → điền vào `formAction`.
- **Tên ô email**: Mailchimp thường là `EMAIL`; nhiều dịch vụ khác là `email` → điền vào `emailField`.
- **Các ô ẩn** (`<input type="hidden" name=... value=...>`): điền vào `hidden` dạng `{ ten: "giatri" }`.
- **Ô chống bot** (Mailchimp có ô tên dạng `b_xxxxx_xxxx`, bỏ trống): điền tên đó vào `honeypot`.

## Bước 5. Điền vào `landing/script.js`
Tìm khối `ebook:` (gần đầu file) và điền, ví dụ:

```js
ebook: {
  formAction: "https://ten-tai-khoan.list-manage.com/subscribe/post?u=XXXX&id=YYYY",
  emailField: "EMAIL",
  nameField: "",
  hidden: {},
  honeypot: "b_XXXX_YYYY",
  title: "Tên ebook của bạn", titleVi: "Tên ebook của bạn",
},
```

Khi `formAction` còn trống, mục này tự ẩn hoàn toàn trên website thật (không hiện form hỏng).
Mở file trực tiếp trên máy hoặc `localhost` sẽ hiện ở chế độ thử nghiệm, không gửi đi đâu.

## Bước 6. Kiểm thử trước khi công khai
1. Đưa lên web, mở mục “Nhận ebook miễn phí”.
2. Đăng ký bằng email cá nhân của bạn. Kiểm tra: email xác nhận có đến không (xem cả thư rác) → bấm xác nhận → email có link ebook đến không → link tải mở được không.
3. Thử trên điện thoại. Thử email sai và không tick ô đồng ý để xem thông báo lỗi.

## Lưu ý pháp lý và uy tín (quan trọng)
- Giữ nguyên ô đồng ý (không tick sẵn) và dòng “có thể hủy đăng ký bất cứ lúc nào”. Mọi email gửi đi phải có nút hủy đăng ký (dịch vụ tự thêm).
- Bạn đang thu dữ liệu cá nhân (email). Nên có trang chính sách quyền riêng tư nêu rõ dùng email để làm gì, lưu bao lâu, ai xử lý (nhà cung cấp dịch vụ email).
  Hãy hỏi luật sư hoặc người am hiểu để đảm bảo phù hợp quy định hiện hành về bảo vệ dữ liệu cá nhân; đây không phải tư vấn pháp lý.
- Không hứa hẹn lợi nhuận trong ebook hay email. Giữ cảnh báo rủi ro. Chỉ gửi email đúng nội dung khách đã đồng ý nhận.
