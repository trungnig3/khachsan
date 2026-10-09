# AURA GRAND - HỆ THỐNG QUẢN LÝ KHÁCH SẠN HƯỚNG DỊCH VỤ (SOA & REST MICROSERVICES)
*(SOA Hotel Management System - Service-Oriented Architecture)*

Dự án được xây dựng chuyên biệt đáp ứng yêu cầu môn học **Phát triển phần mềm hướng dịch vụ (SOA)**. Hệ thống tập trung tối đa vào **Kiến trúc Hướng Dịch vụ**, chuẩn hóa Web Services RESTful API, hợp đồng OpenAPI 3.0 / WSDL XML, điều phối dịch vụ qua Enterprise Service Bus (ESB) & API Gateway, tích hợp an toàn qua OAuth2 / JWT.

---

## 🏛️ ĐIỂM NỔI BẬT KIẾN TRÚC HƯỚNG DỊCH VỤ (SOA HIGHLIGHTS)

1. **Trung Tâm Dịch Vụ SOA (SOA Service Hub & API Playground)**:
   - Tích hợp trực tiếp trên giao diện web (Bấm vào nút **"SOA Services"** trên Navbar).
   - Cho phép giáo viên và sinh viên xem **Mô hình Kiến trúc SOA Topology**, kiểm thử **Live API Playground** với dữ liệu JSON thực tế, theo dõi thời gian phản hồi (latency), và xem chuỗi tích hợp đa dịch vụ (**Service Orchestration Flow**).
   - Tự động xuất tệp `OpenAPI_3.0_SOA_Hotel_Services.json`, `Postman_Collection_SOA_Hotel.json`, và `HotelServiceContract.wsdl` chỉ bằng 1 cú nhấp chuột!

2. **Chi Tiết Báo Cáo SOA**: Xem tệp [`SOA_ARCHITECTURE.md`](./SOA_ARCHITECTURE.md) trong thư mục gốc dự án.

---

## 1. CÔNG NGHỆ SỬ DỤNG

* **Backend**: Java 17, Spring Boot 3.3.0
* **Security & Auth**: Spring Security 6, JWT (JSON Web Token), BCrypt Password Encoder
* **ORM & Database**: Spring Data JPA, Hibernate, MySQL 8.0
* **Validation**: Jakarta Validation API (`@NotNull`, `@NotBlank`, `@Email`, `@Min`)
* **API Documentation**: OpenAPI 3.0 / Swagger UI (`springdoc-openapi`)
* **Build Tool Backend**: Apache Maven
* **Frontend**: TypeScript, React 19 / Angular modular architecture, Tailwind CSS, Lucide Icons
* **DevOps**: Docker, Docker Compose, Multi-stage builds

---

## 2. TÀI KHOẢN TRẢI NGHIỆM DEMO (ROLES & CREDENTIALS)

Hệ thống được nạp sẵn dữ liệu 3 nhóm phân quyền chính:

| Nhóm người dùng | Email đăng nhập | Mật khẩu | Quyền hạn (Role) | Chức năng chính |
| :--- | :--- | :--- | :--- | :--- |
| **Tổng Quản Lý (Admin)** | `admin@auragrand.vn` | `admin123` | `ROLE_ADMIN` | Toàn quyền quản trị Dashboard KPI, CRUD buồng phòng, cấu hình bảng giá, khuyến mãi, doanh thu |
| **Lễ Tân / Thu Ngân (Staff)** | `staff@auragrand.vn` | `staff123` | `ROLE_STAFF` | Quầy tiếp tân, check-in phát thẻ khóa, check-out quyết toán minibar, xuất hóa đơn VAT |
| **Khách Hàng (Customer)** | `khachhang@gmail.com` | `customer123` | `ROLE_CUSTOMER` | Tìm kiếm phòng, đặt phòng trực tuyến, áp dụng voucher, theo dõi đơn đặt phòng, đánh giá sao |

*(Lưu ý: Mật khẩu lưu trong cơ sở dữ liệu MySQL đều được mã hóa bằng thuật toán BCrypt một chiều an toàn).*

---

## 3. CẤU TRÚC DỰ ÁN

```text
hotel-management/
├── backend/                              # Java Spring Boot 3 Backend
│   ├── src/main/java/com/auragrand/hotel/
│   │   ├── controller/                   # REST Controllers (Auth, Room, Booking, Dashboard)
│   │   ├── dto/                          # Data Transfer Objects (Login, Booking, JwtResponse)
│   │   ├── entity/                       # JPA Entities (User, Role, Room, RoomType, Booking, Invoice)
│   │   ├── exception/                    # Global Exception Handler (400, 404, 409 Conflict)
│   │   ├── repository/                   # Spring Data JPA Repositories (với Overlap Verification Query)
│   │   └── security/                     # Spring Security, JwtUtils, JwtFilter, BCrypt
│   ├── src/main/resources/
│   │   └── application.yml               # Cấu hình Datasource, JPA, JWT Secret, Swagger
│   ├── Dockerfile                        # Multi-stage Dockerfile cho Backend
│   └── pom.xml                           # Maven dependencies
├── database/
│   ├── schema.sql                        # Cấu trúc CSDL MySQL 8.0 quan hệ chuẩn
│   └── data.sql                          # Dữ liệu mẫu (20+ phòng, 6 tầng, 5 dịch vụ, booking, review)
├── src/                                  # Giao diện Web SPA cao cấp
│   ├── components/
│   │   ├── admin/                        # Dashboard SaaS, Quản lý phòng, Lễ tân Check-in/out, Invoices, Swagger Explorer
│   │   ├── customer/                     # Hero Banner, Room Catalog, Booking Checkout Modal, Customer Portal
│   │   ├── layout/                       # Navbar, Footer cao cấp
│   │   └── ui/                           # Toast notifications, modals
│   ├── services/
│   │   └── hotelStore.ts                 # Trình quản lý trạng thái dữ liệu thời gian thực
│   └── types/                            # TypeScript Domain Models
├── docker-compose.yml                    # Khởi chạy đồng thời MySQL, Backend & Web
└── README.md
```

---

## 4. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### Cách 1: Chạy toàn bộ bằng Docker Compose (Khuyên dùng)

Yêu cầu máy tính đã cài đặt [Docker Desktop](https://www.docker.com/).

```bash
# 1. Di chuyển vào thư mục dự án
cd hotel-management

# 2. Khởi chạy tất cả các dịch vụ (MySQL 8 + Spring Boot + Web Frontend)
docker-compose up -d --build

# 3. Kiểm tra trạng thái các container
docker-compose ps
```

* **Giao diện Web Khách sạn & Quản trị**: `http://localhost:3000`
* **Swagger API UI Backend**: `http://localhost:8080/swagger-ui.html`
* **MySQL Database**: `localhost:3306` (Database: `hotel_management_db`, User: `root`, Password: `rootpassword`)

---

### Cách 2: Chạy thủ công trên môi trường phát triển (Local Development)

#### Bước 1: Chuẩn bị Cơ sở dữ liệu MySQL
1. Mở MySQL Workbench hoặc Terminal MySQL:
```sql
CREATE DATABASE hotel_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
2. Chạy lần lượt 2 file SQL trong thư mục `database/`:
   * Chạy `database/schema.sql` để tạo bảng và quan hệ khóa ngoại.
   * Chạy `database/data.sql` để nạp dữ liệu mẫu ban đầu.

#### Bước 2: Khởi chạy Spring Boot Backend
1. Đảm bảo máy tính đã cài đặt **Java JDK 17** và **Maven 3.8+**.
2. Kiểm tra thông tin kết nối MySQL trong `backend/src/main/resources/application.yml`.
3. Khởi chạy:
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```
Backend sẽ khởi động tại cổng `http://localhost:8080`.

#### Bước 3: Khởi chạy Giao diện Frontend
1. Đảm bảo máy đã cài **Node.js 18+** và **npm**.
2. Cài đặt và khởi chạy:
```bash
npm install
npm run dev
```
Mở trình duyệt truy cập `http://localhost:3000`.

---

## 5. TÍNH NĂNG NỔI BẬT

1. **Giao diện chuẩn Khách sạn Luxury 5 sao**: Tông màu Xanh Navy `#0A192F` kết hợp Vàng Champagne `#D4AF37`, typography sang trọng, hỗ trợ responsive hoàn hảo trên mọi thiết bị.
2. **Kiểm tra trùng lịch phòng (Overlap Prevention)**: Ngăn chặn tuyệt đối 2 khách đặt trùng ngày trên cùng 1 phòng bằng thuật toán Date Range Overlap ở cả Frontend và Backend JPA SQL query.
3. **Quầy Lễ Tân (Front Desk Desk Workflow)**: Quy trình check-in giao thẻ từ và check-out quyết toán chi phí minibar, late checkout, sau đó tự động chuyển phòng sang chế độ dọn dẹp (`CLEANING`).
4. **Hóa đơn điện tử VAT & Bản In**: Hỗ trợ xem chi tiết chi phí phòng, dịch vụ, voucher giảm giá, thuế 8% VAT và nút in hóa đơn chuẩn hóa quốc tế.
5. **Tích hợp Swagger API Explorer**: Tích hợp sẵn giao diện OpenAPI trực quan ngay trong bảng quản trị để lập trình viên và kiểm thử viên kiểm tra các endpoint RESTful.
