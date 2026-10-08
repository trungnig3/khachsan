-- ====================================================================
-- HOTEL MANAGEMENT SYSTEM - SEED DATA (MySQL 8.0)
-- ====================================================================

-- 1. Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Quản trị viên toàn quyền hệ thống'),
(2, 'ROLE_STAFF', 'Nhân viên khách sạn / Lễ tân / Quản lý ca trực'),
(3, 'ROLE_CUSTOMER', 'Khách hàng đặt phòng');

-- 2. Insert Users (Password: BCrypt of admin123, staff123, customer123)
-- BCrypt for 'admin123': $2a$10$7v50tqM06J60b2k5.YFfeejD5uWbJzC7QG7mB5Z51j7L5K/hL4gWW
INSERT INTO users (id, email, password, full_name, phone, id_card, address, active) VALUES
(1, 'admin@auragrand.vn', '$2a$10$Xpt7/b1yKxJ9Y.Yq5x6qre7O8b2mXo9A.K2V5N6F6kZ4E3M1s2r6O', 'Nguyễn Hoàng Hải (Giám Đốc)', '0901234567', '001099000001', 'Phú Quốc, Kiên Giang', 1),
(2, 'staff@auragrand.vn', '$2a$10$Xpt7/b1yKxJ9Y.Yq5x6qre7O8b2mXo9A.K2V5N6F6kZ4E3M1s2r6O', 'Lê Thị Thu Thảo (Trưởng Lễ Tân)', '0912345678', '001099000002', 'Dương Đông, Phú Quốc', 1),
(3, 'khachhang@gmail.com', '$2a$10$Xpt7/b1yKxJ9Y.Yq5x6qre7O8b2mXo9A.K2V5N6F6kZ4E3M1s2r6O', 'Trần Minh Quang (Khách VIP)', '0988776655', '001099000003', 'Hà Nội, Việt Nam', 1);

-- Assign User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- 3. Insert Room Types
INSERT INTO room_types (id, name, code, description, base_price, capacity, area, bed_type, image_url, amenities) VALUES
(1, 'Deluxe Ocean View', 'DLX-OCN', 'Phòng tiêu chuẩn 5 sao với ban công riêng hướng thẳng ra bãi biển hoang sơ, sàn gỗ sồi ấm cúng cùng bồn tắm nằm cao cấp.', 2800000.00, 2, 45, '1 Giường King hoặc 2 Giường Đơn', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', 'Wifi 6 tốc độ cao, Bồn tắm nằm, Smart TV 65-inch, Minibar miễn phí, Ban công riêng hướng biển, Máy pha cà phê Nespresso'),
(2, 'Executive Suite', 'EXE-STE', 'Căn hộ khách sạn thượng lưu với phòng khách sang trọng riêng biệt, phòng làm việc chuyên nghiệp và quầy bar mini.', 4500000.00, 3, 75, '1 Giường Super King', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', 'Bồn sục Jacuzzi, Phòng khách riêng, Dịch vụ quản gia riêng 24/7, Rượu vang chào đón, Bữa sáng phục vụ tại phòng'),
(3, 'Presidential Penthouse', 'PRS-PTH', 'Đỉnh cao xa hoa tầng thượng với bể bơi vô cực riêng, phòng khách trần cao 6 mét, bếp riêng và quản gia túc trực.', 15000000.00, 4, 180, '2 Giường King Size Thượng Hạng', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', 'Hồ bơi vô cực riêng trên tầng thượng, Bếp ăn riêng với đầu bếp phục vụ, Thang máy riêng biệt, Xe Limousine đưa đón sân bay'),
(4, 'Royal Beachfront Villa', 'ROY-VIL', 'Biệt thự biệt lập nằm sát bờ cát trắng, sở hữu khu vườn nhiệt đới riêng và hồ bơi ngoài trời nhìn ra vịnh biển.', 22000000.00, 6, 280, '3 Giường Master King', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', 'Bãi biển riêng tư, Hồ bơi ngoài trời riêng, Sân vườn nhiệt đới, Tiệc nướng BBQ riêng tại sân vườn, Quản gia riêng');

-- 4. Insert Rooms
INSERT INTO rooms (id, room_number, floor, room_type_id, status, price_override, image_url, description) VALUES
(1, '101', 1, 1, 'AVAILABLE', NULL, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', 'Phòng Deluxe góc tầng 1, ban công tiếp giáp thảm cỏ biển.'),
(2, '102', 1, 1, 'AVAILABLE', NULL, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', 'Phòng Deluxe phong cách mộc tự nhiên với nội thất gỗ cao cấp.'),
(3, '103', 1, 1, 'OCCUPIED', NULL, 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80', 'Phòng hướng hồ bơi trung tâm resort.'),
(4, '201', 2, 2, 'AVAILABLE', NULL, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 'Suite cao cấp tầng 2 với ban công nhìn bao quát toàn bộ vịnh biển.'),
(5, '202', 2, 2, 'BOOKED', NULL, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 'Suite thiết kế cổ điển phong cách Đông Dương.'),
(6, '301', 3, 3, 'AVAILABLE', NULL, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 'Presidential Suite tầng thượng với hồ bơi vô cực ngắm hoàng hôn Phú Quốc.'),
(7, '401', 4, 4, 'AVAILABLE', NULL, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', 'Biệt thự hoàng gia hướng biển ngắm trọn cảnh bình minh và hoàng hôn.');

-- 5. Insert Services
INSERT INTO services (id, name, category, description, price, unit, image_url, active) VALUES
(1, 'Aura Luxury Spa & Hot Stone Therapy', 'SPA', 'Trị liệu bấm huyệt đá nóng phục hồi sinh lực toàn thân 90 phút', 1200000.00, 'gói 90 phút', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80', 1),
(2, 'Bữa Tối Lãng Mạn Trên Bãi Biển (Set Michelin)', 'DINING', 'Bữa tối nến lung linh 5 món hải sản cao cấp cùng rượu vang Pháp', 2500000.00, 'set 2 người', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', 1),
(3, 'Đón Tiễn Sân Bay Limousine VIP', 'TRANSPORT', 'Xe Maybach/Limousine đón tiễn riêng tại sân bay quốc tế Phú Quốc', 800000.00, 'lượt', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', 1),
(4, 'Tour Du Thuyền Hoàng Hôn Quần Đảo', 'LEISURE', 'Du ngoạn du thuyền ngắm hoàng hôn, lặn ngắm san hô và tiệc nhẹ', 3200000.00, 'khách', 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80', 1);

-- 6. Insert Promotions
INSERT INTO promotions (id, name, code, description, discount_percent, discount_amount, min_booking_amount, start_date, end_date, active) VALUES
(1, 'Ưu Đãi Nghỉ Dưỡng Mùa Thu', 'AUTUMN20', 'Giảm trực tiếp 20% cho mọi booking đặt phòng từ 2 đêm trở lên', 20, NULL, 5000000.00, '2026-09-01', '2026-11-30', 1),
(2, 'Chào Đón Khách Hàng VIP', 'AURA10', 'Giảm 10% cho hội viên đặt phòng trực tiếp trên website', 10, NULL, 2000000.00, '2026-01-01', '2026-12-31', 1),
(3, 'Đặc Quyền Penthouse Trọn Gói', 'PENTHOUSE5M', 'Tặng 5.000.000 VNĐ cho kỳ nghỉ Penthouse từ 3 đêm', NULL, 5000000.00, 30000000.00, '2026-01-01', '2026-12-31', 1);

-- 7. Insert Bookings
INSERT INTO bookings (id, booking_code, user_id, customer_name, customer_email, customer_phone, room_id, check_in_date, check_out_date, number_of_guests, total_amount, deposit_amount, status, special_requests) VALUES
(1, 'BK-892110', 3, 'Trần Minh Quang', 'khachhang@gmail.com', '0988776655', 1, '2026-10-01', '2026-10-04', 2, 8400000.00, 3000000.00, 'CONFIRMED', 'Yêu cầu phòng tầng cao, view biển trực diện và chuẩn bị hoa hồng.');

-- 8. Insert Invoices
INSERT INTO invoices (id, invoice_code, booking_id, room_amount, service_amount, discount_amount, tax_amount, final_amount, payment_method, status, paid_at, issued_by) VALUES
(1, 'INV-100293', 1, 8400000.00, 0.00, 0.00, 0.00, 8400000.00, 'CREDIT_CARD', 'UNPAID', NULL, 1);

-- 9. Insert Reviews
INSERT INTO reviews (id, booking_id, user_id, guest_name, rating, comment, approved) VALUES
(1, 1, 3, 'Trần Minh Quang', 5, 'Kỳ nghỉ tuyệt hảo nhất tôi từng trải nghiệm tại Phú Quốc! Bữa tối trên biển thật sự lãng mạn, nhân viên phục vụ chu đáo chuẩn quốc tế 5 sao.', 1);
