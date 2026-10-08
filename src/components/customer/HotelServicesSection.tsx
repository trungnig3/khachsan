import React from 'react';
import { Utensils, Sparkles, Car, Shirt, Wine, ShieldCheck } from 'lucide-react';
import { HotelService } from '../../types/hotel';

interface HotelServicesSectionProps {
  services: HotelService[];
}

export const HotelServicesSection: React.FC<HotelServicesSectionProps> = ({ services }) => {
  return (
    <section id="services" className="py-20 bg-white text-[#0F172A] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold">
              Đặc Quyền Dịch Vụ 5 Sao
            </span>
            <span className="h-px w-6 bg-[#D4AF37]" />
          </div>
          <h2 className="font-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mb-4">
            Trải Nghiệm Đẳng Cấp Thượng Lưu
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Từ liệu trình spa tái tạo năng lượng, phong vị ẩm thực tinh hoa Á - Âu đến dàn siêu xe đón tiếp riêng biệt từ sân bay về resort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-[#F8FAFC] rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3E5AB] bg-[#0F172A]/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {service.category === 'DINING'
                      ? 'Ẩm Thực Tinh Hoa'
                      : service.category === 'WELLNESS'
                      ? 'Spa & Thư Giãn'
                      : service.category === 'TRANSPORT'
                      ? 'Đưa Đón Sang Trọng'
                      : 'Buồng Phòng'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-luxury text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#B45309] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">Đơn giá niêm yết:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-base font-bold text-[#0F172A] tabular-nums">
                      {service.price.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs text-[#64748B]">đ / {service.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
