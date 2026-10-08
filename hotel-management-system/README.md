# 🏨 HỆ THỐNG QUẢN LÝ KHÁCH SẠN TRỰC TUYẾN 5 SAO (AURA GRAND RESORT)

Dự án phần mềm web quản lý khách sạn và đặt phòng trực tuyến hoàn chỉnh, độc lập, sẵn sàng mở và chạy trực tiếp bằng **IntelliJ IDEA**, **VS Code** hoặc **Docker Compose**.

---

## 🏛️ 1. Kiến Trúc Hệ Thống (Architecture)

```
[ Angular 18 Frontend ]  <--- HTTP / REST API (JWT) --->  [ Spring Boot 3 Backend (Java 21) ]
                                                                      │
                                                           Spring Data JPA / Hibernate
                                                                      │
                                                                      ▼
                                                                [ MySQL 8.0 ]
```

* **Backend**: Java 21, Spring Boot 3.3.4, Spring Security 6, JWT (jjwt 0.12.6), Spring Data JPA, Hibernate, Jakarta Validation, Springdoc OpenAPI 3 (Swagger).
* **Frontend**: Angular 18+, TypeScript, Reactive Forms, HttpClient, Route Guards, HTTP Interceptors, Tailwind CSS.
* **Database**: MySQL 8.0 (InnoDB, UTF8MB4), phân tầng bảng quan hệ chuẩn 3NF.
* **Containerization**: Dockerfile đa tầng (Multi-stage build) và Docker Compose.

---

## 📁 2. Cấu Trúc Thư Mục Chuẩn (Project Structure)

```text
hotel-management-system/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/hotel/management/
│           │   ├── HotelManagementApplication.java
│           │   ├── config/              # OpenApiConfig, WebConfig...
│           │   ├── controller/          # AuthController, RoomController, BookingController...
│           │   ├── service/             # AuthService, RoomService, BookingService...
│           │   ├── service/impl/        # Implementations với transaction & validation logic
│           │   ├── repository/          # JpaRepository & Custom JPQL Queries
│           │   ├── entity/              # User, Role, Room, RoomType, Booking, Invoice, Review...
│           │   ├── dto/                 # Request & Response Data Transfer Objects
│           │   ├── security/            # JwtUtils, JwtAuthenticationFilter, SecurityConfig...
│           │   └── exception/           # GlobalExceptionHandler, Custom Exceptions...
│           └── resources/
│               ├── application.properties
│               ├── application-dev.properties
│               └── application-prod.properties
│
├── frontend/
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── core/                   # Guards, Interceptors, Services
│       │   ├── layouts/                # Customer Layout & Admin Sidebar Layout
│       │   ├── models/                 # TypeScript interfaces
│       │   ├── pages/
│       │   │   ├── auth/               # Login, Register
│       │   │   ├── customer/           # Home, Room Catalog, Booking Modal
│       │   │   └── admin/              # Dashboard KPI, Room CRUD, Bookings, Front Desk
│       │   ├── app-routing.module.ts
│       │   └── app.module.ts
│       ├── environments/
│       └── styles.css
│
├── database/
│   ├── schema.sql                      # Tạo cấu trúc bảng MySQL 8
│   └── data.sql                        # Dữ liệu mẫu (Phòng, User, Role, Booking, Review...)
│
├── docker/
│   ├── backend/Dockerfile              # Multi-stage Eclipse Temurin Java 21 build
│   └── frontend/Dockerfile             # Multi-stage Node.js 20 build & Nginx runtime
│
├── docker-compose.yml                  # Khởi chạy toàn bộ hệ thống 1 lệnh duy nhất
├── .gitignore
└── README.md
```

---

## 🚀 3. Hướng Dẫn Cài Đặt & Chạy Độc Lập

### Cách 1: Khởi chạy siêu tốc bằng Docker Compose (Khuyên dùng)

Yêu cầu đã cài đặt **Docker** & **Docker Compose**:

```bash
cd hotel-management-system

# Khởi chạy toàn bộ (MySQL 8 + Spring Boot + Angular Frontend)
docker-compose up -d --build
```

* **Trang khách hàng & Quản trị**: `http://localhost:4200`
* **Swagger API Documentation**: `http://localhost:8080/swagger-ui.html`
* **REST API Context Path**: `http://localhost:8080/api`

---

### Cách 2: Chạy cục bộ bằng IntelliJ IDEA & VS Code

#### Bước 1: Chuẩn bị cơ sở dữ liệu MySQL 8.0
1. Mở MySQL Workbench hoặc terminal MySQL:
   ```sql
   CREATE DATABASE hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Thực thi file script:
   * Chạy `database/schema.sql`
   * Chạy `database/data.sql`

#### Bước 2: Chạy Backend bằng IntelliJ IDEA (Java 21)
1. Mở IntelliJ IDEA -> `File` -> `Open` -> Chọn thư mục `hotel-management-system/backend`.
2. Kiểm tra file `src/main/resources/application.properties` khớp với mật khẩu MySQL của máy bạn (`spring.datasource.password`).
3. Chạy `HotelManagementApplication.java` hoặc dùng Maven:
   ```bash
   mvn clean spring-boot:run
   ```
4. Backend sẽ chạy tại cổng `8080`.

#### Bước 3: Chạy Frontend bằng VS Code (Angular)
1. Mở VS Code -> Chọn thư mục `hotel-management-system/frontend`.
2. Mở Terminal và cài đặt dependencies:
   ```bash
   npm install
   ```
3. Chạy dev server:
   ```bash
   npm start
   # hoặc: ng serve --open
   ```
4. Frontend sẽ tự động mở tại `http://localhost:4200`.

---

## 🔐 4. Tài Khoản Đăng Nhập Mặc Định

| Nhóm Người Dùng | Email Đăng Nhập | Mật Khẩu | Vai Trò (Role) |
|---|---|---|---|
| **Giám Đốc / Quản Trị Viên** | `admin@auragrand.vn` | `admin123` | `ROLE_ADMIN` |
| **Trưởng Lễ Tân (Front Desk)** | `staff@auragrand.vn` | `staff123` | `ROLE_STAFF` |
| **Khách Hàng Đặt Phòng VIP** | `khachhang@gmail.com` | `customer123` | `ROLE_CUSTOMER` |

---

## 🛡️ 5. Các Ràng Buộc & Tính Năng Nổi Bật Đã Xử Lý

1. **Section 10 - Chống Trùng Lịch Đặt Phòng**:
   Truy vấn JPQL kiểm tra giao thời gian:
   `NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)`
   Không cho phép đặt phòng nếu đã có khách xác nhận hoặc check-in.
2. **Bảo Mật JWT 256-bit**: Token truyền qua Authorization Bearer Header, kiểm tra phân quyền chặt chẽ trên từng endpoint (`@PreAuthorize("hasRole('ADMIN')")`).
3. **Quy Trình Quầy Lễ Tân**: Check-in tự động chuyển trạng thái phòng sang `OCCUPIED`, Check-out tự động chuyển phòng sang `CLEANING` và cập nhật hóa đơn `PAID`.
4. **Swagger OpenAPI 3**: Đầy đủ tài liệu tương tác trực quan tại `/swagger-ui.html`.
