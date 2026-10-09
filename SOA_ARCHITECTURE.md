# BÁO CÁO MÔN HỌC: PHÁT TRIỂN PHẦN MỀM HƯỚNG DỊCH VỤ (SOA)
## HỆ THỐNG QUẢN LÝ KHÁCH SẠN VÀ ĐẶT PHÒNG HƯỚNG DỊCH VỤ (AURA GRAND HOTEL SOA SYSTEM)

---

## CHƯƠNG 1: TỔNG QUAN VỀ KIẾN TRÚC HƯỚNG DỊCH VỤ (SOA) TRONG DỰ ÁN

### 1.1 Tính Cấp Thiết & Mục Tiêu Kiến Trúc
Trong bối cảnh quản lý khách sạn resort cao cấp, hệ thống đòi hỏi tính khả thi tích hợp cao giữa các nền tảng (Website khách hàng, Bảng điều khiển quản trị Admin, Phần mềm buồng phòng di động, Cổng thanh toán trực tuyến VNPay, và Đối tác bán phòng 3rd Party OTA). 

Do đó, dự án được thiết kế theo **Kiến trúc Hướng Dịch vụ (Service-Oriented Architecture - SOA)**, phân tách hệ thống thành các **RESTful Web Services / Microservices** hoạt động độc lập, ghép nối lỏng (Loosely Coupled), tuân thủ nguyên tắc thiết kế hợp đồng dịch vụ (Service Contract First) và mã hóa an toàn qua OAuth2 / JWT.

### 1.2 Các Đặc Tính SOA Đạt Được
1. **Khả năng tái sử dụng (Service Reusability)**: Web Service `AuthService` và `RoomCatalogService` phục vụ đồng thời cho cả UI khách hàng, Bảng quản trị Admin và đối tác OTA.
2. **Hợp đồng dịch vụ chuẩn hóa (Standardized Service Contract)**: Tất cả API giao tiếp qua HTTP REST JSON với định dạng OpenAPI 3.0 (Swagger) & WSDL XML Contract.
3. **Độc lập nền tảng (Platform Independence)**: Backend Java Spring Boot 3.3 & Express Node.js có thể chạy độc lập với Frontend React TypeScript.
4. **Điều phối dịch vụ (Service Orchestration via Enterprise Service Bus)**: Xử lý chuỗi nghiệp vụ khi khách hàng đặt phòng (Check Availability -> Auth Token -> Create Reservation -> Trigger Payment -> Schedule Housekeeping -> Send Email Notification).

---

## CHƯƠNG 2: THIẾT KẾ MÔ HÌNH KIẾN TRÚC SOA & TÍCH HỢP HỆ THỐNG

### 2.1 Mô Hình Phân Lớp SOA (SOA Architecture Topology)

```text
+-----------------------------------------------------------------------+
|                    LAYER 1: PRESENTATION LAYER                        |
|   React SPA / Admin Portal / Housekeeping App / OTA Partner APIs     |
+-----------------------------------------------------------------------+
                                   | (HTTP REST JSON / JWT Bearer)
                                   v
+-----------------------------------------------------------------------+
|               LAYER 2: ENTERPRISE SERVICE BUS (ESB)                   |
|   API Gateway Router (`/api/v1/*`) | Rate Limiter | Auth Interceptor  |
+-----------------------------------------------------------------------+
                                   | (Service Discovery & Routing)
        +--------------------------+--------------------------+
        |                          |                          |
        v                          v                          v
+-------------------+    +-------------------+    +-------------------+
|  Auth & Identity  |    |  Room & Catalog   |    |     Booking &     |
|     Service       |    |     Service       |    |  Reservation Svc  |
+-------------------+    +-------------------+    +-------------------+
        |                          |                          |
        +--------------------------+--------------------------+
                                   |
        +--------------------------+--------------------------+
        |                          |                          |
        v                          v                          v
+-------------------+    +-------------------+    +-------------------+
|   Housekeeping    |    |     Amenity &     |    | Payment & Invoice |
| & Maintenance Svc |    |   Spa Order Svc   |    |    GTGT Service   |
+-------------------+    +-------------------+    +-------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    LAYER 4: PERSISTENCE & DATA LAYER                  |
|    PostgreSQL / MySQL 8.0 (`hotel_db`) | JPA / Hibernate Repositories  |
+-----------------------------------------------------------------------+
```

### 2.2 Danh Mục Các Web Services Cơ Bản (SOA Service Catalog)

| Tên Web Service | Mã Service Endpoint | Giao thức | Mô tả Chức năng |
| :--- | :--- | :--- | :--- |
| **AuthService** | `POST /api/v1/auth/login` | REST / HTTP | Xác thực thông tin tài khoản và cấp JWT Token mã hóa |
| **AuthService** | `POST /api/v1/auth/register` | REST / HTTP | Đăng ký tài khoản khách hàng mới |
| **RoomCatalogService** | `GET /api/v1/rooms/search` | REST / HTTP | Tra cứu danh sách phòng khả dụng theo ngày & bộ lọc |
| **BookingService** | `POST /api/v1/bookings/create` | REST / HTTP | Khởi tạo đơn đặt phòng & điều phối chuỗi giao dịch SOA |
| **HousekeepingService**| `POST /api/v1/housekeeping/update-status` | REST / HTTP | Cập nhật trạng thái phòng (SẠCH, ĐANG DỌN) & phí lẻ buồng phòng |
| **AmenityService** | `POST /api/v1/services/order` | REST / HTTP | Tích hợp dịch vụ ăn uống, Spa, xe đưa đón vào phòng nghỉ |
| **PaymentInvoiceService**| `POST /api/v1/payments/process` | REST / HTTP | Xử lý thanh toán trực tuyến & phát hành hóa đơn đỏ GTGT |

---

## CHƯƠNG 3: CHI TIẾT CÁC RESTFUL WEB SERVICES & CHUẨN ENVELOPE SOA

Tất cả Web Services trong hệ thống trả về phản hồi theo chuẩn cấu trúc **SOA Response Envelope**:

```json
{
  "service": "booking-service",
  "version": "1.0.0",
  "timestamp": "2026-10-09T01:42:00.000Z",
  "status": 200,
  "message": "Thao tác dịch vụ thành công!",
  "data": { ... }
}
```

---

## CHƯƠNG 4: KỊCH BẢN TÍCH HỢP ĐA DỊCH VỤ (SERVICE ORCHESTRATION & ESB FLOW)

Khi khách hàng bấm **Xác Nhận Đặt Phòng** trên giao diện, quy trình điều phối dịch vụ (Service Orchestration) diễn ra qua 5 bước liên tiếp:

1. **Client -> API Gateway**: Gửi Yêu cầu `POST /api/v1/bookings/create` kèm JWT Token.
2. **API Gateway -> AuthService**: Xác minh chữ ký JWT Token hợp lệ.
3. **API Gateway -> RoomCatalogService**: Khóa phòng tạm thời, kiểm tra chống trùng lịch đặt.
4. **BookingService -> PaymentGatewayService**: Khởi tạo cổng thanh toán trực tuyến & phát hành mã đặt phòng.
5. **BookingService -> HousekeepingService**: Tự động đưa phòng vào lịch phân công dọn dẹp cho nhân viên buồng phòng trước giờ check-in.

---

## CHƯƠNG 5: HƯỚNG DẪN KIỂM THỬ TRỰC TIẾP API TRÊN TRÌNH DUYỆT & POSTMAN

1. **Kiểm thử trực tiếp trên Web App**:
   - Truy cập giao diện chính, bấm vào nút **"SOA Services"** (biểu tượng Cpu vàng) trên thanh điều hướng Navbar.
   - Chuyển sang thẻ **"Kiểm Thử API Trực Tiếp (Playground)"**.
   - Chọn bất kỳ Web Service nào (`POST /api/v1/bookings/create`, `GET /api/v1/rooms/search`, `POST /api/v1/housekeeping/update-status`), chỉnh sửa JSON Payload và bấm **"Gửi Lệnh Dịch Vụ SOA"** để xem phản hồi REST HTTP thực tế cùng thời gian phản hồi (latency).

2. **Xuất tài liệu nộp bài**:
   - Mở modal **SOA Services** -> Thẻ **"Xuất OpenAPI / Postman / WSDL"**.
   - Tải về file `OpenAPI_3.0_SOA_Hotel_Services.json`, `Postman_Collection_SOA_Hotel.json`, và `HotelServiceContract.wsdl` để nộp cho giáo viên.
