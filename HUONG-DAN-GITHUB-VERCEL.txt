# Kho website của tôi

Lưu, tìm kiếm và sắp xếp link website; giữ giao diện và các chức năng quản lý kho hiện có. Có hai cách bảo vệ: dùng mật khẩu hoặc không mật khẩu.

## Đồng bộ giữa các thiết bị

Ứng dụng dùng `/api/vault` trên Vercel và một cơ sở dữ liệu Redis có REST API. Không lưu dữ liệu dùng chung vào ổ tạm của Vercel hoặc repository GitHub.

Cần kết nối cơ sở dữ liệu vào đúng dự án Vercel và cấp hai biến môi trường phía máy chủ:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN` (token đọc/ghi, không phải readonly)

Hỗ trợ các tên tương đương `KV_REST_API_URL` và `KV_REST_API_TOKEN`. Sau khi thêm biến cho môi trường Production, triển khai lại dự án. Không đưa token vào JavaScript trình duyệt, GitHub hoặc file sao lưu. Chọn cấu hình cơ sở dữ liệu lưu bền vững và không tự xóa dữ liệu khi đầy. Nhà cung cấp lưu trữ có hạn mức và chính sách riêng.

Khi chưa cấu hình, API trả `SYNC_NOT_CONFIGURED`; website ghi rõ chỉ lưu trên thiết bị và tiếp tục giữ dữ liệu cũ. Việc tải mã nguồn lên GitHub hoặc triển khai giao diện không tự tạo cơ sở dữ liệu.

Khi đã cấu hình:

1. Mở đúng địa chỉ kho bằng trình duyệt đã lưu website cũ và mở khóa bằng mật khẩu hiện tại. Kho cũ sẽ được đưa lên máy chủ; bản gốc trên thiết bị được giữ riêng.
2. Mở cùng địa chỉ trên thiết bị khác. Kho có mật khẩu dùng cùng mật khẩu; kho không mật khẩu mở trực tiếp.
3. Nếu trước đó mỗi thiết bị có dữ liệu riêng, mở Cài đặt > Nhập website cũ trên thiết bị này để gộp. Link trùng giữ nguyên mục trên kho chung.

Danh sách kiểm tra thay đổi mỗi 15 giây và khi quay lại tab. Lưu sử dụng phiên bản và thao tác so sánh/cập nhật nguyên tử để không ghi đè thay đổi từ thiết bị khác. Khi có xung đột, lấy bản mới rồi thực hiện lại thao tác. Kho tối đa khoảng 3 MiB cho một lần đồng bộ, ngoài hạn mức nhà cung cấp; lỗi lưu luôn giữ dữ liệu đang mở.

## Mật khẩu và không mật khẩu

Ở bước tạo kho, chọn Dùng mật khẩu hoặc Không mật khẩu. Đổi sau này tại Cài đặt > Mật khẩu / Không mật khẩu; bỏ/đổi mật khẩu của kho đang bảo vệ phải nhập đúng mật khẩu hiện tại.

Kho có mật khẩu được mã hóa AES-GCM trên trình duyệt trước khi gửi, dùng PBKDF2-SHA256. Mật khẩu không được lưu trên máy chủ. Quyền ghi được bảo vệ bằng khóa ngẫu nhiên nằm trong dữ liệu mã hóa; đổi chế độ/mật khẩu sẽ đổi khóa ghi. Không có chức năng lấy lại mật khẩu đã quên.

Kho không mật khẩu lưu danh sách đọc trực tiếp, không tự khóa: ai có địa chỉ website đều có thể xem và sửa kho. Bật lại mật khẩu để mã hóa những lần lưu tiếp theo; các bản sao đã tải trước đó vẫn giữ trạng thái cũ.

Xuất/nhập JSON hỗ trợ cả hai chế độ và bản sao mã hóa cũ. File sao lưu có mật khẩu dùng mật khẩu tại thời điểm xuất.

## Chạy và kiểm tra

Không cần cài gói npm:

```sh
npm test
npm run build
npm start
```

Mở `http://localhost:8080`. Muốn thử đồng bộ tại máy, cấp biến môi trường REST trước khi chạy. GitHub Pages chỉ hỗ trợ chế độ trên thiết bị vì không chạy `/api/vault`; dùng Vercel để đồng bộ.

Kiểm tra tự động gồm mã hóa thực, chuyển mật khẩu/không mật khẩu, di chuyển dữ liệu cũ, hai thiết bị giả lập cùng kho, chống ghi đè và thu hồi khóa ghi. Chưa kiểm tra trực tiếp trình duyệt hoặc cơ sở dữ liệu Production chưa được kết nối.

Tài liệu giao thức Redis REST: https://upstash.com/docs/redis/features/restapi
