import React from 'react';
import { Crown, Phone, Mail, MapPin, Award, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A1120] text-[#94A3B8] border-t border-[#1E293B] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-luxury text-lg font-bold tracking-widest text-[#F8FAFC]">
                AURA GRAND
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#64748B] mb-6">
              Khu nghỉ dưỡng và khách sạn 5 sao quốc tế hướng biển. Mang đến trải nghiệm nghỉ dưỡng tinh tế, dịch vụ quản gia cao cấp và không gian thanh lịch tuyệt mỹ.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#EAB308]">
              <Award className="w-4 h-4 shrink-0" />
              <span>World Luxury Hotel Awards Winner 2026</span>
            </div>
          </div>

          {/* Column 2: Liên hệ & Địa chỉ */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Liên hệ & Địa chỉ
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Đại lộ Hoàng Hôn, Bãi Dài, Đặc Khu Nghỉ Dưỡng Quốc Tế, Phú Quốc</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-mono tabular-nums">+84 (0) 297 388 9999</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>concierge@auragrand.vn</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Dịch vụ & Chính sách */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Tiện ích & Chính sách
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-[#F8FAFC] transition-colors">
                  Dịch vụ Lotus Spa & Massage
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#F8FAFC] transition-colors">
                  Ẩm thực Á - Âu tại quầy Ocean Club
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#F8FAFC] transition-colors">
                  Xe đưa đón sân bay VIP Maybach / Mercedes
                </a>
              </li>
              <li>
                <span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">
                  Chính sách nhận phòng (14:00) & trả phòng (12:00)
                </span>
              </li>
              <li>
                <span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">
                  Quy định hủy phòng & hoàn tiền linh hoạt
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Đặc quyền & Cam kết */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Cam kết dịch vụ 5 sao
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-[#94A3B8]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cam kết giá tốt nhất khi đặt phòng trực tiếp trên website.</span>
              </div>
              <div className="flex items-start gap-2 text-[#94A3B8]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Thanh toán mã hóa bảo mật chuẩn quốc tế và xuất hóa đơn VAT điện tử ngay lập tức.</span>
              </div>
              <div className="p-3 bg-[#111C35] rounded-xl border border-[#1E293B] mt-4">
                <span className="text-[11px] block font-medium text-[#F8FAFC] mb-1">
                  Đặc quyền thành viên AURA Club
                </span>
                <span className="text-[10px] text-[#64748B] block">
                  Đăng ký nhận ngay voucher 10% cho kỳ nghỉ đầu tiên.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 Aura Grand Luxury Hotel & Resort. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-6">
            <span>Bảo mật dữ liệu</span>
            <span>·</span>
            <span>Điều khoản sử dụng</span>
            <span>·</span>
            <span>Giấy phép lữ hành số: 79-026/2026/TCDL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
