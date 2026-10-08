import React, { useState } from 'react';
import {
  Key,
  LogOut,
  LogIn,
  Search,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Clock,
  Printer,
  Sparkles
} from 'lucide-react';
import { Booking, User } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface FrontDeskCheckInOutProps {
  currentUser: User;
  onRefresh: () => void;
  onViewInvoice: (booking: Booking) => void;
}

export const FrontDeskCheckInOut: React.FC<FrontDeskCheckInOutProps> = ({
  currentUser,
  onRefresh,
  onViewInvoice,
}) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<'checkin' | 'checkout'>('checkin');
  const [searchTerm, setSearchTerm] = useState('');

  // Settle additional charges state for check-out
  const [selectedCheckoutBooking, setSelectedCheckoutBooking] = useState<Booking | null>(null);
  const [minibarCharge, setMinibarCharge] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'CASH' | 'VNPAY' | 'BANK_TRANSFER' | 'CREDIT_CARD'>('CASH');

  const bookings = hotelStore.getBookings();

  // Check-in candidates: Confirmed bookings
  const checkInList = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');

  // Check-out candidates: Checked-in guests
  const checkOutList = bookings.filter(b => b.status === 'CHECKED_IN');

  const handlePerformCheckIn = (booking: Booking) => {
    hotelStore.updateBookingStatus(booking.id, 'CHECKED_IN');
    showToast(`Đã hoàn tất thủ tục Check-in cho khách ${booking.customerName}. Thẻ phòng ${booking.roomNumber} đã kích hoạt!`, 'success');
    onRefresh();
  };

  const handleOpenCheckoutModal = (booking: Booking) => {
    setSelectedCheckoutBooking(booking);
    setMinibarCharge(0);
    setLateFee(0);
    setCheckoutNotes('');
    setCheckoutPaymentMethod(booking.paymentMethod || 'CASH');
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCheckoutBooking) return;

    // Settle payment and checkout
    hotelStore.settleBookingPayment(selectedCheckoutBooking.id, checkoutPaymentMethod);
    hotelStore.updateBookingStatus(selectedCheckoutBooking.id, 'CHECKED_OUT');
    showToast(`Đã hoàn tất thủ tục Check-out & quyết toán tiền cho phòng ${selectedCheckoutBooking.roomNumber}. Trạng thái thanh toán: ĐÃ TRẢ!`, 'success');
    setSelectedCheckoutBooking(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
          Quầy Tiếp Tân (Front Desk Check-in / Check-out)
        </h2>
        <p className="text-xs text-[#64748B]">
          Thực hiện thủ tục nhận phòng, cấp phát thẻ khóa từ, quyết toán minibar và bàn giao buồng phòng
        </p>
      </div>

      {/* Segmented Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#F1F5F9] rounded-2xl w-fit">
        <button
          onClick={() => setTab('checkin')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'checkin'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          <LogIn className="w-4 h-4 text-[#EAB308]" />
          <span>Danh Sách Chờ Check-in ({checkInList.length})</span>
        </button>

        <button
          onClick={() => setTab('checkout')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'checkout'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          <LogOut className="w-4 h-4 text-emerald-400" />
          <span>Khách Đang Ở Cần Check-out ({checkOutList.length})</span>
        </button>
      </div>

      {/* Tab 1: Check-in Desk */}
      {tab === 'checkin' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <span className="font-bold text-xs text-[#0F172A]">
              Khách có lịch nhận phòng hôm nay & đã xác nhận
            </span>
            <span className="text-[11px] text-[#64748B]">
              Lễ tân trực ca: <strong>{currentUser.fullName}</strong>
            </span>
          </div>

          {checkInList.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#64748B]">
              Hiện không có khách nào đang chờ làm thủ tục nhận phòng.
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {checkInList.map((b) => (
                <div key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#0F172A] tabular-nums">
                        {b.bookingCode}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {b.status}
                      </span>
                    </div>

                    <div className="font-bold text-[#0F172A]">
                      {b.customerName} · {b.customerPhone}
                    </div>

                    <div className="text-xs text-[#64748B] flex items-center gap-3">
                      <span>Phòng được gán: <strong className="text-[#0F172A]">Phòng {b.roomNumber} ({b.roomTypeName})</strong></span>
                      <span>·</span>
                      <span>Lưu trú: {b.checkInDate} đến {b.checkOutDate} ({b.nights} đêm)</span>
                    </div>

                    {b.specialRequests && (
                      <div className="text-[11px] text-[#B45309] bg-amber-50 p-2 rounded-lg mt-1">
                        Ghi chú khách: "{b.specialRequests}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePerformCheckIn(b)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Key className="w-4 h-4" />
                      <span>Xác nhận giao phòng & Khóa thẻ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Check-out Desk */}
      {tab === 'checkout' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <span className="font-bold text-xs text-[#0F172A]">
              Danh sách phòng đang có khách lưu trú (Sẵn sàng trả phòng)
            </span>
          </div>

          {checkOutList.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#64748B]">
              Hiện không có phòng nào đang ở cần trả phòng.
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {checkOutList.map((b) => (
                <div key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#0F172A] tabular-nums">
                        {b.bookingCode}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        ĐANG LƯU TRÚ
                      </span>
                    </div>

                    <div className="font-bold text-base text-[#0F172A]">
                      Phòng {b.roomNumber} - {b.roomTypeName}
                    </div>

                    <div className="text-xs text-[#64748B]">
                      Khách hàng: <strong>{b.customerName}</strong> ({b.customerPhone}) · Check-in lúc: {b.checkedInAt || b.checkInDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onViewInvoice(b)}
                      className="px-4 py-2 border border-[#CBD5E1] text-[#334155] text-xs font-semibold rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      Hóa đơn tạm tính
                    </button>
                    <button
                      onClick={() => handleOpenCheckoutModal(b)}
                      className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <LogOut className="w-4 h-4 text-[#EAB308]" />
                      <span>Thủ tục Check-out</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Checkout settlement */}
      {selectedCheckoutBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0]">
            <h3 className="font-luxury text-xl font-bold text-[#0F172A] mb-1">
              Quyết Toán Trả Phòng (Check-out)
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Phòng {selectedCheckoutBooking.roomNumber} · Khách hàng: {selectedCheckoutBooking.customerName}
            </p>

            <form onSubmit={handleCompleteCheckout} className="space-y-4 text-xs">
              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between text-[#64748B]">
                  <span>Tiền phòng & Dịch vụ ban đầu:</span>
                  <span className="font-mono tabular-nums font-bold text-[#0F172A]">
                    {selectedCheckoutBooking.totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Trạng thái thanh toán trước:</span>
                  <span className="text-emerald-600 font-bold">
                    {selectedCheckoutBooking.paymentStatus === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Phí phát sinh Minibar / Hỏng hóc (VNĐ)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={minibarCharge}
                  onChange={(e) => setMinibarCharge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Phụ thu trả phòng muộn (Late Checkout fee)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100000}
                  value={lateFee}
                  onChange={(e) => setLateFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Ghi chú bàn giao chìa khóa & hiện trạng phòng
                </label>
                <textarea
                  rows={2}
                  value={checkoutNotes}
                  onChange={(e) => setCheckoutNotes(e.target.value)}
                  placeholder="Khách đã hoàn trả đủ 2 thẻ phòng, không có hư hao đồ đạc..."
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Phương thức thanh toán quyết toán *
                </label>
                <select
                  value={checkoutPaymentMethod}
                  onChange={(e) => setCheckoutPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A] font-semibold text-xs"
                >
                  <option value="CASH">Tiền mặt tại quầy lễ tân</option>
                  <option value="VNPAY">Cổng VNPay Sandbox (Quét mã QR / Thẻ NCB)</option>
                  <option value="BANK_TRANSFER">Chuyển khoản Ngân hàng (VietQR)</option>
                  <option value="CREDIT_CARD">Thẻ Tín dụng / POS tại quầy</option>
                </select>
              </div>

              <div className="pt-2 text-right">
                <span className="text-[11px] text-[#64748B] block">Tổng tiền quyết toán thêm:</span>
                <span className="font-mono text-lg font-bold text-[#0F172A] tabular-nums">
                  {(minibarCharge + lateFee).toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setSelectedCheckoutBooking(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  Đóng lại
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Hoàn tất Check-out & Chuyển Dọn Buồng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
