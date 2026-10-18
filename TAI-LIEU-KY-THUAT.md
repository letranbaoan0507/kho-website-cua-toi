# Kiến trúc kho website

- Giao diện tĩnh trong `dist/`; Node serverless handler `api/vault.js` trên Vercel; Redis REST lưu một kho dùng chung cho dự án.
- Dữ liệu dùng chung được lưu ở key `webkho:shared-vault:v1`, gồm revision, envelope và băm SHA-256 của khóa ghi. GET không trả băm khóa ghi. POST yêu cầu khóa ghi hiện tại; khóa mới được cấp khi đổi bảo vệ.
- Lua CAS kiểm tra khóa ghi và revision trước một thao tác SET nguyên tử. Không có endpoint xóa toàn bộ kho. Thùng rác và xóa mục là cập nhật envelope có kiểm tra phiên bản.
- Mật khẩu dùng AES-GCM 256-bit và PBKDF2-SHA256 600.000 vòng. Khóa ghi 32 byte ngẫu nhiên ở bên trong payload mã hóa. Mật khẩu/CryptoKey không được đưa lên máy chủ; phiên đang mở giữ khóa ở bộ nhớ.
- Envelope không mật khẩu dùng format `an-web-vault-open` với payload đọc trực tiếp. Chỉ áp dụng khi người dùng chủ động chọn chế độ này.
- IndexedDB `an-private-websites/vault/main` giữ bản sao mới. Trước khi thay bản local cũ bằng bản cloud, lưu bản cũ vào `legacy`; người dùng có thể mở bằng mật khẩu cũ để gộp. Không xóa bản legacy sau khi nhập.
- Khi máy chủ đã cấu hình nhưng không truy cập được, không âm thầm ghi bản riêng và báo đồng bộ thành công. Khi chưa cấu hình, cho dùng local với trạng thái rõ ràng.
- Backup cũ vẫn mở được. Backup mới phản ánh bảo vệ lúc xuất.
- Production cần Redis REST URL/token trong biến môi trường Vercel, không có sẵn trong mã nguồn. Đọc README để kết nối.
