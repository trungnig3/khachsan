-- ========================================================
-- SEED DATA: AURA GRAND LUXURY HOTEL MANAGEMENT
-- Realistic 5-star hotel operational seed records
-- ========================================================

USE hotel_management_db;

-- 1. INSERT ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Quản trị viên toàn quyền hệ thống khách sạn'),
(2, 'ROLE_STAFF', 'Nhân viên lễ tân, buồng phòng & thu ngân'),
(3, 'ROLE_CUSTOMER', 'Khách hàng đặt phòng trực tuyến');

-- 2. INSERT USERS (Passwords hashed with BCrypt, raw passwords: admin123, staff123, customer123)
INSERT INTO users (id, email, password, full_name, phone, address, status) VALUES
(1, 'admin@auragrand.vn', '$2a$10$7R8QJ8zO7eQ5vB5LgNf3ZeG3/a5qR6.tX8V.F9zE2lK9sM7wN0uO.', 'Hoàng Minh Quân (Tổng Giám Đốc)', '0909888999', 'Đại lộ Hoàng Hôn, Phú Quốc', 'ACTIVE'),
(2, 'staff@auragrand.vn', '$2a$10$7R8QJ8zO7eQ5vB5LgNf3ZeG3/a5qR6.tX8V.F9zE2lK9sM7wN0uO.', 'Trần Phương Thảo (Trưởng Lễ Tân)', '0918776655', 'Thị trấn Dương Đông, Phú Quốc', 'ACTIVE'),
(3, 'khachhang@gmail.com', '$2a$10$7R8QJ8zO7eQ5vB5LgNf3ZeG3/a5qR6.tX8V.F9zE2lK9sM7wN0uO.', 'Nguyễn Văn An', '0901234567', 'Quận 1, TP. Hồ Chí Minh', 'ACTIVE'),
(4, 'minhtuan@yahoo.com', '$2a$10$7R8QJ8zO7eQ5vB5LgNf3ZeG3/a5qR6.tX8V.F9zE2lK9sM7wN0uO.', 'Phạm Minh Tuấn', '0988776655', 'Ba Đình, Hà Nội', 'ACTIVE'),
(5, 'maihoang88@gmail.com', '$2a$10$7R8QJ8zO7eQ5vB5LgNf3ZeG3/a5qR6.tX8V.F9zE2lK9sM7wN0uO.', 'Hoàng Thị Mai', '0912348899', 'Hải Châu, Đà Nẵng', 'ACTIVE');

-- 3. INSERT USER_ROLES
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Admin has ROLE_ADMIN
(2, 2), -- Staff has ROLE_STAFF
(3, 3), -- Customer has ROLE_CUSTOMER
(4, 3),
(5, 3);

-- 4. INSERT ROOM TYPES
INSERT INTO room_types (id, code, name, description, base_price, max_guests, area_sqm, bed_type, image_url, is_featured) VALUES
(1, 'DLX-OCN', 'Deluxe Ocean View', 'Phòng Deluxe sang trọng hướng thẳng ra biển đại dương, ban công rộng đón gió biển mát lành, trang bị giường King cao cấp cùng phòng tắm bằng đá cẩm thạch Ý.', 2200000.00, 2, 42, '1 Giường King (2m x 2m)', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', TRUE),
(2, 'EXE-STE', 'Executive Suite', 'Không gian Suite đẳng cấp thương gia với phòng khách biệt lập, bàn làm việc sang trọng và đặc quyền sử dụng Executive Lounge tầng 12 miễn phí cả ngày.', 3800000.00, 3, 68, '1 Giường Super King + Sofa Bed', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', TRUE),
(3, 'PRS-STE', 'Presidential Penthouse Suite', 'Tuyệt tác nghỉ dưỡng thượng lưu tại tầng áp mái cao nhất, tầm nhìn 360 độ toàn vịnh biển và thành phố, quản gia phục vụ 24/7, phòng ăn riêng và hầm rượu.', 8500000.00, 4, 145, '2 Giường Super King Master', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80', TRUE),
(4, 'SUP-CTY', 'Superior City View', 'Không gian ấm cúng, thiết kế hiện đại tối giản với ánh sáng tự nhiên ngập tràn, nhìn ra toàn cảnh nhịp sống phồn hoa rực rỡ của thành phố về đêm.', 1550000.00, 2, 32, '2 Giường Đơn hoặc 1 Giường Đôi', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', FALSE),
(5, 'RYL-VIL', 'Royal Beachfront Villa', 'Biệt thự biệt lập tọa lạc ngay trên bờ cát trắng mịn, lối đi thẳng xuống biển riêng tư, sân vườn nhiệt đới xanh mát cùng hồ bơi nước mặn.', 11000000.00, 6, 220, '3 Phòng ngủ King size', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', TRUE);

-- 5. INSERT 20+ ROOMS
INSERT INTO rooms (id, room_number, room_type_id, floor, price_per_night, status, cleanliness, description, image_url) VALUES
(101, '101', 4, 1, 1550000.00, 'AVAILABLE', 'CLEAN', 'Phòng 101 tầng 1 nhìn ra vườn', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'),
(102, '102', 4, 1, 1550000.00, 'OCCUPIED', 'INSPECTED', 'Phòng 102 đang có khách', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'),
(103, '103', 1, 1, 2200000.00, 'AVAILABLE', 'CLEAN', 'Phòng 103 hướng hồ bơi', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'),
(104, '104', 1, 1, 2200000.00, 'CLEANING', 'DIRTY', 'Phòng 104 đang dọn buồng', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'),
(201, '201', 1, 2, 2200000.00, 'AVAILABLE', 'CLEAN', 'Phòng 201 góc tầng 2', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'),
(202, '202', 1, 2, 2200000.00, 'OCCUPIED', 'INSPECTED', 'Phòng 202 hướng biển', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'),
(203, '203', 2, 2, 3800000.00, 'RESERVED', 'CLEAN', 'Phòng 203 khách VIP đặt trước', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
(204, '204', 2, 2, 3800000.00, 'AVAILABLE', 'CLEAN', 'Executive Suite 204', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
(301, '301', 1, 3, 2200000.00, 'AVAILABLE', 'CLEAN', 'Phòng 301 hướng biển', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'),
(302, '302', 1, 3, 2200000.00, 'OCCUPIED', 'INSPECTED', 'Phòng 302 khách check-in hôm qua', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'),
(303, '303', 2, 3, 3800000.00, 'AVAILABLE', 'CLEAN', 'Suite góc tầng 3', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
(304, '304', 4, 3, 1550000.00, 'MAINTENANCE', 'DIRTY', 'Phòng đang bảo trì điều hòa', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'),
(401, '401', 2, 4, 3800000.00, 'AVAILABLE', 'CLEAN', 'Executive Suite tầng 4', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
(402, '402', 2, 4, 3800000.00, 'AVAILABLE', 'CLEAN', 'Suite hạng sang tầng 4', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
(403, '403', 1, 4, 2200000.00, 'OCCUPIED', 'INSPECTED', 'Phòng 403 khách gia đình', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'),
(404, '404', 1, 4, 2200000.00, 'AVAILABLE', 'CLEAN', 'Deluxe tầng 4', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'),
(501, '501', 3, 5, 8500000.00, 'AVAILABLE', 'CLEAN', 'Presidential Penthouse Suite 501', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'),
(502, '502', 3, 5, 8500000.00, 'OCCUPIED', 'INSPECTED', 'Presidential Suite 502', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'),
(601, 'V-01', 5, 1, 11000000.00, 'AVAILABLE', 'CLEAN', 'Biệt thự bãi biển V-01', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'),
(602, 'V-02', 5, 1, 11000000.00, 'OCCUPIED', 'INSPECTED', 'Biệt thự bãi biển V-02', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80');

-- 6. INSERT SERVICES
INSERT INTO services (id, name, category, description, price, unit, image_url, is_available) VALUES
(1, 'Buffet Sáng Quốc Tế Thượng Hạng', 'DINING', 'Hơn 120 món ăn Á - Âu chế biến tại quầy live-cooking từ 6h30 đến 10h30.', 350000.00, 'người / ngày', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80', TRUE),
(2, 'Trị Liệu Lotus Spa Đá Nóng Thảo Dược (90 phút)', 'WELLNESS', 'Liệu trình thư giãn thải độc sâu với tinh dầu ngọc lan tây và đá núi lửa ấm.', 950000.00, 'lượt', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80', TRUE),
(3, 'Xe Đưa Đón Sân Bay Mercedes E-Class', 'TRANSPORT', 'Tài xế chuyên nghiệp đón tại ga đến sân bay, nước khoáng mát lạnh và khăn thơm.', 650000.00, 'chuyến', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80', TRUE),
(4, 'Dịch Vụ Giặt Ủi & Hấp Cao Cấp', 'LAUNDRY', 'Giặt sấy, ủi phẳng và giao trả tận phòng trong vòng 6 giờ làm việc.', 200000.00, 'gói 5 món', 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80', TRUE),
(5, 'Tiệc Nướng BBQ Hoàng Hôn Bãi Biển', 'DINING', 'Hải sản tươi sống tôm hùm, cua hoàng đế, bò Wagyu và vang trắng dưới ánh nến.', 1800000.00, 'người', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', TRUE);

-- 7. INSERT PROMOTIONS
INSERT INTO promotions (id, code, title, discount_type, discount_value, min_order_value, max_discount, start_date, end_date, usage_limit, used_count, is_active) VALUES
(1, 'WELCOME10', 'Chào mừng quý khách mới', 'PERCENTAGE', 10.00, 2000000.00, 500000.00, '2026-01-01', '2026-12-31', 200, 42, TRUE),
(2, 'LUXURYVIP', 'Ưu đãi thượng lưu - Giảm 15%', 'PERCENTAGE', 15.00, 5000000.00, 1500000.00, '2026-05-01', '2026-10-31', 100, 19, TRUE),
(3, 'SUMMER500K', 'Đại tiệc mùa hè - Giảm ngay 500.000đ', 'FIXED', 500000.00, 3000000.00, NULL, '2026-06-01', '2026-09-30', 50, 31, TRUE);

-- 8. INSERT BOOKINGS
INSERT INTO bookings (id, booking_code, customer_id, customer_name, customer_email, customer_phone, room_id, check_in_date, check_out_date, nights, num_guests, room_price_per_night, total_room_price, services_total, discount_amount, tax_amount, total_amount, status, payment_status, payment_method, special_requests, checked_in_at) VALUES
(1, 'AG-20260901', 3, 'Nguyễn Văn An', 'khachhang@gmail.com', '0901234567', 102, '2026-09-28', '2026-10-02', 4, 2, 1550000.00, 6200000.00, 700000.00, 500000.00, 512000.00, 6912000.00, 'CHECKED_IN', 'PAID', 'BANK_TRANSFER', 'Yêu cầu phòng không hút thuốc', '2026-09-28 14:15:00'),
(2, 'AG-20260902', 4, 'Phạm Minh Tuấn', 'minhtuan@yahoo.com', '0988776655', 202, '2026-09-29', '2026-10-03', 4, 2, 2200000.00, 8800000.00, 1600000.00, 0.00, 832000.00, 11232000.00, 'CHECKED_IN', 'PAID', 'CREDIT_CARD', NULL, '2026-09-29 13:40:00'),
(3, 'AG-20260903', 5, 'Hoàng Thị Mai', 'maihoang88@gmail.com', '0912348899', 203, '2026-10-01', '2026-10-05', 4, 2, 3800000.00, 15200000.00, 0.00, 1520000.00, 1094400.00, 14774400.00, 'CONFIRMED', 'PAID', 'BANK_TRANSFER', NULL, NULL);

-- 9. INSERT INVOICES
INSERT INTO invoices (id, invoice_code, booking_id, customer_name, customer_email, customer_phone, room_charges, service_charges, discount_amount, tax_amount, total_amount, paid_amount, status, payment_method, issue_date) VALUES
(1, 'INV-2026-001', 1, 'Nguyễn Văn An', 'khachhang@gmail.com', '0901234567', 6200000.00, 700000.00, 500000.00, 512000.00, 6912000.00, 6912000.00, 'PAID', 'Chuyển khoản Vietcombank QR', '2026-09-28'),
(2, 'INV-2026-002', 2, 'Phạm Minh Tuấn', 'minhtuan@yahoo.com', '0988776655', 8800000.00, 1600000.00, 0.00, 832000.00, 11232000.00, 11232000.00, 'PAID', 'Thẻ Visa Signature', '2026-09-29');

-- 10. INSERT REVIEWS
INSERT INTO reviews (id, booking_id, customer_name, room_type_name, rating, comment, review_date, is_approved) VALUES
(1, NULL, 'Trần Minh Hoàng', 'Presidential Penthouse Suite', 5, 'Trải nghiệm 5 sao đỉnh cao thực sự! Quản gia phục vụ cực kỳ chu đáo, hồ bơi vô cực riêng trên sân thượng nhìn ra biển lúc hoàng hôn đẹp nghẹt thở.', '2026-09-24', TRUE),
(2, NULL, 'Nguyễn Thị Bích Ngọc', 'Deluxe Ocean View', 5, 'Phòng ốc sạch sẽ không tì vết, giường êm ái, ban công nhìn thẳng ra đại dương xanh ngắt. Buffet sáng rất phong phú, các bạn nhân viên luôn tươi cười.', '2026-09-20', TRUE),
(3, NULL, 'David Harrison', 'Executive Suite', 5, 'Exceptional hospitality. The Executive Lounge access was superb for my remote meetings. Fast internet and prompt airport pickup service.', '2026-09-18', TRUE);
