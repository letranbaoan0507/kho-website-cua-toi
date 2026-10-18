# Kho website của tôi

Ứng dụng tĩnh tiếng Việt để lưu link website cá nhân. Không đặt hạn mức số link hoặc số lần thêm; giới hạn thực tế phụ thuộc dung lượng trình duyệt và kích thước kho. Chỉ lưu liên kết/thông tin dự án, không sao chép mã nguồn hay toàn bộ nội dung website được liên kết.

Có tạo/đổi mật khẩu riêng, khóa thủ công và tự khóa, thêm/sửa/xóa/khôi phục/xóa vĩnh viễn, tìm kiếm không dấu, lọc trạng thái, bộ sưu tập, thẻ, yêu thích, vừa mở, lưới/danh sách, dán nhiều link, chặn link trùng (kể cả thùng rác), sao chép và mở website/mã nguồn.

IndexedDB chỉ lưu một bản mã hóa AES-GCM 256-bit. Khóa dẫn xuất từ mật khẩu bằng PBKDF2-SHA256 600.000 vòng, salt 16 byte ngẫu nhiên, IV 12 byte mới mỗi lần lưu; mật khẩu và CryptoKey chỉ nằm trong phiên làm việc. Mọi thay đổi lưu bằng giao dịch có kiểm tra phiên bản để tránh ghi đè từ tab khác. Mật khẩu không thể khôi phục khi quên. File JSON sao lưu cũng là bản mã hóa; mật khẩu của bản sao là mật khẩu tại thời điểm xuất.

Dữ liệu chỉ ở trình duyệt/tên miền đang dùng, không tự đồng bộ sang máy khác. Có thể xuất/nhập bản sao mã hóa để chuyển kho; nhập trong kho đang mở sẽ gộp các link mới, không ghi đè mục trùng. Xóa dữ liệu trình duyệt có thể xóa kho. Có chức năng đề nghị quyền lưu dữ liệu lâu dài.

Không cần API key, database cloud hoặc gói thư viện trả phí. Font Be Vietnam Pro tải từ Google Fonts; khi không có mạng dùng font hệ thống. Phải chạy qua HTTPS hoặc localhost để có WebCrypto. Không dùng file:// để chạy.

Website không lưu trữ mật khẩu đăng nhập của từng website; mật khẩu bảo vệ toàn bộ kho. Website liên kết không chịu ảnh hưởng khi xóa một mục trong kho.

Kiểm tra: node tests/core.test.cjs; node tests/app.test.cjs; node --check dist/app.js. Chưa kiểm thử tương tác trực tiếp trong trình duyệt tại môi trường xây dựng này.
