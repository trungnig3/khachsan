import React from 'react';
import { Search, Calendar, Users, Home } from 'lucide-react';
import { RoomType } from '../../types/hotel';

interface HeroBannerProps {
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  guestsCount: number;
  setGuestsCount: (guests: number) => void;
  selectedRoomType: string;
  setSelectedRoomType: (type: string) => void;
  roomTypes: RoomType[];
  onSearch: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guestsCount,
  setGuestsCount,
  selectedRoomType,
  setSelectedRoomType,
  roomTypes,
  onSearch,
}) => {
  return (
    <div className="relative bg-[#0A1120] text-white overflow-hidden">
      {/* Background Photography with measured gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85"
          alt="Aura Grand Luxury Resort Infinity Pool and Oceanfront"
          className="w-full h-full object-cover object-center brightness-[0.45] scale-105 transform animate-pulse duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1120] via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36 flex flex-col items-center text-center">
        {/* Editorial Subtitle with subtle gold line */}
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-[#D4AF37]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#EAB308] font-semibold">
            Biểu Tượng Nghỉ Dưỡng Thượng Lưu
          </span>
          <span className="h-px w-8 bg-[#D4AF37]" />
        </div>

        {/* Display Headline */}
        <h1 className="font-luxury text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8FAFC] max-w-4xl leading-tight mb-6" style={{ textWrap: 'balance' }}>
          Đỉnh Cao Không Gian Nghỉ Dưỡng Bên Bờ Đại Dương
        </h1>

        <p className="text-sm sm:text-base text-[#CBD5E1] max-w-2xl font-light leading-relaxed mb-12">
          Khám phá bộ sưu tập phòng nghỉ sang trọng bậc nhất, thưởng ngoạn hoàng hôn biển tuyệt mỹ và tận hưởng dịch vụ quản gia tận tâm 24/7 tại Aura Grand.
        </p>

        {/* High-Performance Booking Search Widget */}
        <div className="w-full max-w-5xl bg-[#0F172A]/90 backdrop-blur-xl border border-[#334155] rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/60 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Check-in Date */}
            <div className="bg-[#1E293B]/80 border border-[#334155] rounded-xl p-3 hover:border-[#64748B] transition-colors">
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>Ngày nhận phòng</span>
              </label>
              <input
                type="date"
                value={checkInDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
              />
            </div>

            {/* Check-out Date */}
            <div className="bg-[#1E293B]/80 border border-[#334155] rounded-xl p-3 hover:border-[#64748B] transition-colors">
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>Ngày trả phòng</span>
              </label>
              <input
                type="date"
                value={checkOutDate}
                min={checkInDate || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
              />
            </div>

            {/* Number of Guests */}
            <div className="bg-[#1E293B]/80 border border-[#334155] rounded-xl p-3 hover:border-[#64748B] transition-colors">
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>Số khách</span>
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
              >
                <option value={1} className="bg-[#0F172A] text-white">1 Khách (Đơn)</option>
                <option value={2} className="bg-[#0F172A] text-white">2 Khách (Cặp đôi)</option>
                <option value={3} className="bg-[#0F172A] text-white">3 Khách</option>
                <option value={4} className="bg-[#0F172A] text-white">4 Khách (Gia đình)</option>
                <option value={6} className="bg-[#0F172A] text-white">5 - 6 Khách (Biệt thự)</option>
              </select>
            </div>

            {/* Room Type */}
            <div className="bg-[#1E293B]/80 border border-[#334155] rounded-xl p-3 hover:border-[#64748B] transition-colors">
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>Hạng phòng</span>
              </label>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="w-full bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0F172A] text-white">Tất cả các hạng</option>
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id.toString()} className="bg-[#0F172A] text-white">
                    {rt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-[#94A3B8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Giá đã bao gồm ăn sáng buffet và đặc quyền Lotus Spa 5 sao</span>
            </div>
            <button
              onClick={onSearch}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm phòng trống</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
