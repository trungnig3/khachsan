import React from 'react';
import { X, Check, Bed, Maximize2, Users, Shield, Clock, Coffee, Sparkles } from 'lucide-react';
import { Room, RoomType } from '../../types/hotel';

interface RoomDetailModalProps {
  room: Room | null;
  roomType?: RoomType;
  onClose: () => void;
  onBook: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  roomType,
  onClose,
  onBook,
}) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E2E8F0] my-8 relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Main Hero Photo */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-900 overflow-hidden">
            <img
              src={room.imageUrl}
              alt={room.roomTypeName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-luxury text-xs text-[#EAB308] uppercase tracking-widest font-semibold block mb-1">
                Phòng {room.roomNumber} · Tầng {room.floor}
              </span>
              <h2 className="font-luxury text-2xl sm:text-3xl font-bold">
                {room.roomTypeName}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Quick Spec Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs">
              <div className="flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-[#B45309]" />
                <div>
                  <span className="text-[#64748B] block">Diện tích</span>
                  <span className="font-bold text-[#0F172A] font-mono">{roomType?.area || 40} m²</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bed className="w-5 h-5 text-[#B45309]" />
                <div>
                  <span className="text-[#64748B] block">Loại giường</span>
                  <span className="font-bold text-[#0F172A] truncate block max-w-[120px]">
                    {roomType?.bedType || 'Giường King'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#B45309]" />
                <div>
                  <span className="text-[#64748B] block">Sức chứa</span>
                  <span className="font-bold text-[#0F172A]">Tối đa {roomType?.maxGuests || 2} khách</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#B45309]" />
                <div>
                  <span className="text-[#64748B] block">Tiêu chuẩn</span>
                  <span className="font-bold text-emerald-600">5 Sao Quốc Tế</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-luxury text-lg font-bold text-[#0F172A] mb-2">
                Mô tả không gian & Thiết kế
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {room.description || roomType?.description}
              </p>
            </div>

            {/* Amenities List */}
            <div>
              <h3 className="font-luxury text-lg font-bold text-[#0F172A] mb-4">
                Tiện nghi phòng nghỉ cao cấp
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-[#334155]">
                {roomType?.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs text-[#78350F] space-y-2">
              <h4 className="font-bold flex items-center gap-2 text-sm text-[#92400E]">
                <Shield className="w-4 h-4" />
                <span>Chính sách nhận / trả phòng & Hủy phòng</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#92400E]/90">
                <li>Thời gian nhận phòng tiêu chuẩn: <strong>14:00</strong>. Thời gian trả phòng: <strong>12:00 trưa</strong>.</li>
                <li>Miễn phí hủy phòng trước 48 giờ so với ngày nhận phòng.</li>
                <li>Trẻ em dưới 6 tuổi lưu trú miễn phí cùng giường với bố mẹ.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="block text-[11px] text-[#64748B] uppercase font-semibold">
              Giá niêm yết trực tuyến
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums">
                {room.pricePerNight.toLocaleString('vi-VN')}
              </span>
              <span className="text-sm text-[#64748B]">đ / đêm (chưa gồm thuế phí)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            >
              Đóng lại
            </button>
            {room.status === 'AVAILABLE' ? (
              <button
                onClick={() => {
                  onClose();
                  onBook(room);
                }}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Tiến hành đặt phòng
              </button>
            ) : (
              <button
                disabled
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-200 text-slate-500 text-xs font-semibold cursor-not-allowed border border-slate-300"
              >
                {room.status === 'CLEANING'
                  ? 'Phòng đang dọn dẹp - Không thể đặt'
                  : room.status === 'OCCUPIED'
                  ? 'Phòng đang có khách - Không thể đặt'
                  : 'Phòng đang bảo trì - Không thể đặt'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
