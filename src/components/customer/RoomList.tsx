import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Check, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { Room, RoomType } from '../../types/hotel';

interface RoomListProps {
  rooms: Room[];
  roomTypes: RoomType[];
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
  initialTypeFilter?: string;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  roomTypes,
  onSelectRoom,
  onBookRoom,
  initialTypeFilter = 'ALL',
}) => {
  const [selectedType, setSelectedType] = useState<string>(initialTypeFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(12000000);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'popular'>('popular');

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Type filter
      if (selectedType !== 'ALL' && room.roomTypeId !== Number(selectedType)) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchNumber = room.roomNumber.toLowerCase().includes(term);
        const matchName = (room.roomTypeName || '').toLowerCase().includes(term);
        const matchDesc = room.description.toLowerCase().includes(term);
        if (!matchNumber && !matchName && !matchDesc) return false;
      }
      // Max price
      if (room.pricePerNight > maxPrice) {
        return false;
      }
      // Only available
      if (onlyAvailable && room.status !== 'AVAILABLE') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price_desc') return b.pricePerNight - a.pricePerNight;
      return a.id - b.id;
    });
  }, [rooms, selectedType, searchTerm, maxPrice, onlyAvailable, sortBy]);

  return (
    <section id="rooms" className="py-20 bg-[#F8F9FA] text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold">
              Kiến Trúc & Không Gian
            </span>
            <span className="h-px w-6 bg-[#D4AF37]" />
          </div>
          <h2 className="font-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mb-4">
            Bộ Sưu Tập Phòng & Biệt Thự Biển
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Mỗi căn phòng tại Aura Grand là một tuyệt tác được thiết kế riêng với nội thất thủ công tinh xảo, ban công đón gió biển trong lành và tiện nghi công nghệ hiện đại.
          </p>
        </div>

        {/* Filter and Control Bar */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Category Tabs (Segmented control) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === 'ALL'
                    ? 'bg-[#0F172A] text-white shadow-md'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                Tất cả hạng phòng ({rooms.length})
              </button>
              {roomTypes.map((type) => {
                const count = rooms.filter((r) => r.roomTypeId === type.id).length;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id.toString())}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedType === type.id.toString()
                        ? 'bg-[#0F172A] text-white shadow-md'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {type.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Quick Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm số phòng, tên phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A] transition-colors"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium text-[#334155] focus:outline-none"
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Price Slider & Available Only */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="font-semibold text-[#475569] whitespace-nowrap">Mức giá tối đa:</span>
              <input
                type="range"
                min={1500000}
                max={12000000}
                step={500000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-40 sm:w-56 accent-[#D4AF37]"
              />
              <span className="font-mono font-bold text-[#0F172A] tabular-nums whitespace-nowrap">
                {maxPrice.toLocaleString('vi-VN')} đ / đêm
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-0 accent-[#0F172A]"
              />
              <span className="font-medium text-[#334155]">Chỉ hiển thị phòng còn trống ngay hôm nay</span>
            </label>
          </div>
        </div>

        {/* Room Grid */}
        {filteredRooms.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0]">
            <Filter className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="font-luxury text-lg font-bold text-[#0F172A] mb-1">
              Không tìm thấy phòng phù hợp
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Vui lòng điều chỉnh lại bộ lọc giá hoặc chọn hạng phòng khác để tiếp tục.
            </p>
            <button
              onClick={() => {
                setSelectedType('ALL');
                setSearchTerm('');
                setMaxPrice(12000000);
                setOnlyAvailable(false);
              }}
              className="px-5 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => {
              const rType = roomTypes.find((t) => t.id === room.roomTypeId);
              const isAvailable = room.status === 'AVAILABLE';

              return (
                <div
                  key={room.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Slot with Smooth Hover Zoom */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={room.imageUrl}
                      alt={`Phòng ${room.roomNumber} - ${room.roomTypeName}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Status Top Right Tag (Clean unboxed text inside dark pill for status) */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-md ${
                          isAvailable
                            ? 'bg-emerald-600/90 text-white'
                            : room.status === 'OCCUPIED'
                            ? 'bg-amber-600/90 text-white'
                            : room.status === 'CLEANING'
                            ? 'bg-sky-600/90 text-white'
                            : 'bg-slate-700/90 text-white'
                        }`}
                      >
                        {isAvailable
                          ? 'Đang trống'
                          : room.status === 'OCCUPIED'
                          ? 'Đang có khách'
                          : room.status === 'CLEANING'
                          ? 'Đang dọn phòng'
                          : 'Bảo trì'}
                      </span>
                    </div>

                    {/* Room Number Floating Label */}
                    <div className="absolute bottom-4 left-4">
                      <span className="font-luxury font-bold text-xs bg-[#0F172A]/85 backdrop-blur-sm text-[#F3E5AB] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30">
                        Phòng {room.roomNumber} · Tầng {room.floor}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Zero-Pill Unboxed Metadata (Section 1.A compliance) */}
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2 font-medium">
                        <span>{rType?.area || 35} m²</span>
                        <span aria-hidden="true">·</span>
                        <span>{rType?.bedType || 'Giường King'}</span>
                        <span aria-hidden="true">·</span>
                        <span>Tối đa {rType?.maxGuests || 2} khách</span>
                      </div>

                      {/* Room Type Title */}
                      <h3 className="font-luxury text-xl font-bold text-[#0F172A] group-hover:text-[#B45309] transition-colors mb-2">
                        {room.roomTypeName}
                      </h3>

                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                        {room.description || rType?.description}
                      </p>

                      {/* Amenities snippet */}
                      <div className="space-y-1.5 mb-6 text-xs text-[#475569]">
                        {rType?.amenities?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Price & Actions */}
                    <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-[#94A3B8]">
                          Giá mỗi đêm từ
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-mono text-lg font-bold text-[#0F172A] tabular-nums">
                            {room.pricePerNight.toLocaleString('vi-VN')}
                          </span>
                          <span className="text-xs text-[#64748B]">đ</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectRoom(room)}
                          className="p-2.5 rounded-xl border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition-colors cursor-pointer"
                          title="Xem chi tiết phòng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isAvailable ? (
                          <button
                            onClick={() => onBookRoom(room)}
                            className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Đặt phòng</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#EAB308]" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed border border-slate-200"
                            title="Phòng này hiện tại không thể đặt"
                          >
                            {room.status === 'CLEANING'
                              ? 'Đang dọn phòng'
                              : room.status === 'OCCUPIED'
                              ? 'Đang có khách'
                              : 'Tạm khóa'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
