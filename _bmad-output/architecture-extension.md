# Kiến Trúc Browser Extension

## Tổng Quan
SurfSense Browser Extension là "tai mắt" của hệ thống, cho phép thu thập dữ liệu (ingestion) liền mạch và hỗ trợ người dùng ngay trên bất kỳ trang web nào. Nó được xây dựng bằng **Plasmo Framework**, giúp đơn giản hóa việc phát triển extension cho Chrome (Manifest V3).

## Stack Công Nghệ

| Hạng Mục | Công Nghệ |
|----------|-----------|
| **Framework** | Plasmo |
| **UI** | React 18, Tailwind CSS |
| **Stores** | Storage API (Plasmo Storage) |
| **Messaging** | Plasmo Messaging (Port-based) |

## Các Thành Phần Chính

### 1. Popup (`popup.tsx`)
- Giao diện người dùng xuất hiện khi click vào icon extension.
- **Chức năng**:
    - Đăng nhập/Đăng xuất.
    - Chuyển đổi trạng thái "Tracking" (Bật/Tắt thu thập active tab).
    - Tìm kiếm nhanh (Quick Search) vào kho kiến thức SurfSense.
    - Hiển thị thông báo trạng thái hệ thống.

### 2. Background Service Worker (`background/`)
- Trái tim của extension, chạy ngầm độc lập với các tab.
- **Nhiệm vụ**:
    - **Session Management**: Giữ token xác thực, refresh token khi hết hạn.
    - **Ingestion Queue**: Nhận dữ liệu từ Content Scripts, đóng gói (batching) để tránh spam request, và gửi về Backend API.
    - **Context Awareness**: Giám sát thay đổi URL/Tab để kích hoạt thu thập lại nếu cần.

### 3. Content Scripts
- Scripts chạy trong ngữ cảnh của trang web người dùng đang xem.
- **Nhiệm vụ**:
    - Trích xuất nội dung trang (DOM parsing, Readability.js).
    - Lắng nghe các sự kiện (ví dụ: user copy text -> gợi ý lưu làm note).
    - Inject UI (nếu cần): Hiển thị nút "Lưu vào SurfSense" trực tiếp trên trang.

## Luồng Hoạt Động (Workflows)

### Quy Trình Thu Thập (Ingestion Flow)
1. User truy cập `example.com`.
2. **Content Script** kích hoạt, parse nội dung chính (loại bỏ quảng cáo/footer).
3. Script gửi message chứa nội dung tới **Background Worker**.
4. **Background** kiểm tra:
    - User có đang bật tracking không?
    - Token còn hiệu lực không?
    - Trang này có bị blacklist không (ví dụ: localhost, banking sites)?
5. Nếu hợp lệ, Background đẩy dữ liệu về Backend `POST /api/v1/extension/ingest`.

### Quy Trình Tra Cứu (Lookup Flow)
1. User bôi đen 1 đoạn text trên web.
2. Extension hiển thị tooltip nhỏ.
3. User click "Search in SurfSense".
4. Request gửi về Backend để tìm kiếm các tài liệu liên quan đến đoạn text đó.
5. Kết quả hiển thị ngay trong Side Panel hoặc Popup.
