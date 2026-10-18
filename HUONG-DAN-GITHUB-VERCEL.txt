# Kho website của tôi — bộ đầy đủ để đăng GitHub/Vercel

Bản gốc: https://kho-website-cua-toi.bett-yrobinsonw870.chatgpt.site
Phiên bản 1, commit nguồn ghi trong PHIEN-BAN.json.

Bốn tệp trong `dist/` giữ nguyên từng byte so với gói website đang chạy. Không thay giao diện, logo hay chức năng. Các tệp bổ sung ở ngoài `dist/` chỉ dùng để triển khai, chạy trên máy, đối chiếu và hướng dẫn.

## Có đầy đủ

- Dán link, thêm/sửa/xóa website; thùng rác, khôi phục, xóa vĩnh viễn.
- Tìm kiếm tiếng Việt không dấu, nhóm/bộ sưu tập, thẻ, ghi chú, trạng thái, yêu thích, vừa mở.
- Giao diện lưới/danh sách; mở link website hoặc link mã nguồn/quản trị; sao chép link.
- Dán nhiều link, bỏ qua link trùng; không đặt hạn mức số link hay số lần thêm.
- Người dùng tự đặt/đổi mật khẩu, khóa thủ công và tự khóa khi không thao tác.
- Mã hóa kho trên trình duyệt; xuất và nhập/gộp bản sao JSON mã hóa.
- Logo webkho đúng mã gốc trong giao diện. Kèm file vector riêng ở `assets/logo-webkho.svg` và `assets/logo-icon.svg`.

## Đăng GitHub + Vercel, chọn phương án miễn phí

1. Giải nén ZIP và mở thư mục `Kho-website-cua-toi` bên trong.
2. Tạo repository trong tài khoản GitHub cá nhân, dùng GitHub Free. Có thể chọn Public cho cách đơn giản nhất.
3. Đưa TOÀN BỘ NỘI DUNG thư mục này lên repository: `vercel.json`, `package.json`, `dist/` nằm ngay cấp gốc, không lồng thêm một thư mục `Kho-website-cua-toi`.
4. Đăng nhập Vercel bằng GitHub, chọn gói Hobby, Add New > Project rồi Import repository vừa tạo.
5. Cấu hình có sẵn trong `vercel.json`. Nếu cần kiểm tra: Framework Preset = Other; Root Directory = gốc repository; Build Command = `node verify-package.cjs`; Output Directory = `dist`; Install Command trống; không cần nhập Environment Variables.
6. Bấm Deploy. Dùng tên miền `vercel.app` được cấp, không cần mua tên miền riêng.

Vercel Hobby miễn phí cho dự án cá nhân, phi thương mại và có hạn mức tài nguyên. Không chọn nâng cấp Pro, Pro trial, dịch vụ bổ sung hoặc tên miền trả phí nếu muốn giữ phương án miễn phí. Bộ website này không cần database cloud, API key hay gói npm trả phí.

Nguồn chính thức:
https://vercel.com/docs/plans/hobby
https://vercel.com/docs/project-configuration/vercel-json

## Phương án khác: GitHub Pages miễn phí

GitHub Pages hỗ trợ repository công khai trên GitHub Free.

1. Đưa toàn bộ mã nguồn lên repository Public, nhánh `main`.
2. Vào Settings > Pages > Build and deployment > Source, chọn GitHub Actions.
3. Đảm bảo có `.github/workflows/pages.yml` đi kèm. Nếu tải bằng giao diện web bị thiếu thư mục này, tạo đúng đường dẫn bằng Add file > Create new file rồi dán nội dung tệp đi kèm.
4. Vào Actions > Deploy Kho website to GitHub Pages > Run workflow, hoặc đẩy một commit lên `main`.
5. Chờ chạy xong rồi lấy link trong Settings > Pages.

Nguồn: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## Mở trên máy

Cài Node.js LTS miễn phí từ https://nodejs.org rồi chạy `CHAY-WINDOWS.bat`.
Hoặc mở terminal trong thư mục này:

```text
npm start
```

Mở http://localhost:8080. Giữ cửa sổ máy chủ đang chạy; Ctrl+C để dừng. Không cần `npm install` vì không có gói npm phải cài. Không mở `dist/index.html` trực tiếp bằng file://; phần mã hóa cần HTTPS hoặc localhost.

## Mang dữ liệu từ website cũ sang link mới

ZIP chứa mã nguồn, không tự chứa danh sách website hoặc mật khẩu đang nằm trong trình duyệt của bạn.

1. Ở website cũ, mở khóa kho > Cài đặt & sao lưu > Xuất bản sao mã hóa.
2. Giữ file JSON và ghi nhớ mật khẩu dùng lúc xuất.
3. Ở link mới chưa có kho, chọn Đã có bản sao? Khôi phục kho rồi nhập JSON/mật khẩu đó.
4. Nếu link mới đã có kho, mở khóa rồi Cài đặt & sao lưu > Nhập bản sao. Link mới sẽ được gộp vào kho hiện tại; link trùng không ghi đè.

Dữ liệu chỉ lưu trong trình duyệt, gắn với tên miền; không tự đồng bộ giữa thiết bị. Không đẩy file sao lưu riêng tư lên GitHub. Khi quên mật khẩu, không có chức năng khôi phục mật khẩu. Sau khi đổi mật khẩu, các file sao lưu cũ vẫn dùng mật khẩu cũ.

## Kiểm tra khớp bản gốc

```text
node verify-package.cjs
npm test
```

`dist.sha256.json` chứa dấu kiểm tra của bốn tệp website gốc. Lệnh kiểm tra đối chiếu từng byte bằng SHA-256. Nếu bạn chủ động sửa website sau này, cập nhật dấu kiểm tra hoặc bỏ lệnh kiểm tra khỏi Build Command; bộ mã nguồn không bị khóa chỉnh sửa.

`tests/` chứa kiểm tra mã hóa thực tế và luồng ứng dụng với mô phỏng DOM/IndexedDB. Chưa kiểm thử trực tiếp giao diện trong trình duyệt hoặc triển khai vào tài khoản Vercel/GitHub của bạn.

## Lưu ý về chi phí và dung lượng

Website không đặt hạn mức số lần thêm. Dung lượng thực tế phụ thuộc thiết bị/trình duyệt; không có cam kết lưu trữ vô hạn. Kho có thể bị mất nếu xóa dữ liệu trình duyệt, nên xuất bản sao định kỳ. Google Fonts được gọi như bản đang chạy; nếu không tải được thì dùng font hệ thống.

Không có token, mật khẩu tài khoản hay lịch sử Git trong ZIP. `.openai/hosting.json` chỉ giữ thông tin Sites gốc; GitHub Pages và Vercel không dùng tệp này. Chi tiết kỹ thuật gốc nằm trong `TAI-LIEU-KY-THUAT.md`.
