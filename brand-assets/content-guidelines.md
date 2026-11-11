# LAVIENT CAPITAL — Content Design System

Bộ quy tắc biên tập dùng chung cho website (EN + VI). Mọi nội dung mới phải qua danh sách kiểm tra ở cuối tài liệu.

## 1. Brand voice
Chuyên nghiệp, phân tích, tự tin, súc tích, mang tính tổ chức. Mỗi đoạn có một luận điểm, một lời giải thích, dẫn chứng nếu có, và một ý nghĩa thực tiễn. Không viết như quảng cáo, diễn giả truyền động lực hay mạng xã hội đại trà.

- Câu chủ động, một ý một câu. Ưu tiên danh từ cụ thể (hệ thống, quy tắc, dữ liệu, rủi ro) hơn tính từ.
- Chỉ nêu điều có thể kiểm chứng. Con số, ngày tháng, chứng nhận lấy đúng từ chứng nhận gốc; không suy diễn.
- Ngôi xưng: “tôi” cho quan điểm cá nhân của nhà giao dịch; “chúng tôi / we” cho thương hiệu và cộng đồng. Không trộn trong cùng một đoạn.

## 2. Từ ngữ cấm (VI và EN tương đương)
Tiến hóa · bứt phá giới hạn · khai phá tiềm năng · chinh phục đỉnh cao · thay đổi cuộc chơi · vươn tầm thế giới · định nghĩa lại cuộc chơi · kiến tạo tương lai · đánh thức sức mạnh · đột phá không giới hạn · hành trình vươn tới thành công · thành công vượt trội · tư duy triệu phú · bí quyết thành công.
EN: evolve/evolution (khi nghĩa là “phát triển”), unlock your potential, game-changing, breakthrough, conquer, unleash, secret to success.

## 3. Từ ngữ ưu tiên
Phát triển · hoàn thiện · cải thiện · nâng cao · tối ưu · mở rộng · tăng trưởng · tích lũy · xây dựng · củng cố · thích ứng · điều chỉnh.
Chọn theo nghĩa thực tế: “cải thiện liên tục” cho quy trình, “xây dựng” cho hệ thống, “tích lũy” cho kinh nghiệm hoặc vốn.

## 4. Tiêu đề
- Nêu nội dung, không hô khẩu hiệu. Tối đa khoảng 8 từ cho H2.
- Phần nhấn (màu vàng, `<em>`) là cụm có nghĩa trọn vẹn, không phải một từ lẻ.
- Không dấu chấm than. Không câu hỏi tu từ.

## 5. Đoạn văn
- Chiều rộng đọc 55–70 ký tự; line-height 1.55–1.75; heading 1.1–1.3.
- Đoạn ngắn (≤ 4 dòng): `text-wrap: balance`. Đoạn dài: `text-wrap: pretty`. Heading: `balance`.
- Không dùng `<br>` hay khoảng trắng để ép dòng. Ngoại lệ duy nhất: tiêu đề hai vế có chủ đích (`.fs-big`), mỗi vế tự cân dòng.

## 6. CTA
Động từ + đối tượng, 2–4 từ, không giục giã. Ví dụ: “Xem thành tựu”, “Liên hệ”, “Gửi tin nhắn”. Tránh “Đăng ký ngay”, “Đừng bỏ lỡ”.

## 7. Typography tiếng Việt
- Letter-spacing 0 cho đoạn văn; chỉ nhãn viết hoa (eyebrow, mono) mới có tracking, tối đa 0.16em.
- Giữ nguyên thuật ngữ quốc tế (Futures, CFD, prop firm, drawdown) khi chưa có từ tương đương được dùng rộng rãi; dùng nhất quán một cách viết trên toàn site.
- Nhãn nhỏ nhất 12px. Không dùng font weight dưới 400 cho nội dung chính.

## 8. Typography tiếng Anh
- Chính tả Anh–Anh nhất quán (recognised, behaviour, practise); riêng tên chương trình của quỹ giữ nguyên như nguồn (“funded program”).
- Không dịch máy từ tiếng Việt; viết lại theo văn phong tài chính tự nhiên.
- Title Case cho tên riêng và nhãn điều hướng; sentence case cho heading mô tả.

## 9. Typography responsive
- Cỡ chữ dùng `clamp()` qua token `--fs-*`; không cố định một cỡ cho mọi thiết bị.
- Kiểm ở 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920 px: không tràn, không từ mồ côi, không heading gãy bất thường.

## 10. Danh sách kiểm tra trước khi đăng
1. Không có từ trong mục 2.
2. Mỗi đoạn có một luận điểm; không lặp ý giữa các đoạn.
3. Mọi con số, ngày tháng đối chiếu được với chứng nhận.
4. EN và VI cùng nghĩa, mỗi bản đọc tự nhiên.
5. Quét orphan/overflow ở các breakpoint ở mục 9.
