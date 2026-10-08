import React, { useState } from 'react';
import {
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Star,
  Printer,
  ChevronRight,
  Shield,
  Send,
  Building,
  ArrowLeft,
  LogOut,
  LogIn
} from 'lucide-react';
import { Booking, User } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { VNPaySandboxModal, VNPayTransactionResult } from '../common/VNPaySandboxModal';
import { useToast } from '../ui/Toast';

interface CustomerDashboardProps {
  currentUser: User | null;
  onBackToHome: () => void;
  onSelectBookingInvoice: (booking: Booking) => void;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onBackToHome,
  onSelectBookingInvoice,
  onLogout,
  onOpenLoginModal,
}) => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (!currentUser) return [];
    return hotelStore.getBookings().filter(b => b.customerId === currentUser.id || b.customerEmail === currentUser.email);
  });

  // Review Modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [selectedBookingForVNPay, setSelectedBookingForVNPay] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  const refreshBookings = () => {
    if (!currentUser) {
      setBookings([]);
      return;
    }
    setBookings(hotelStore.getBookings().filter(b => b.customerId === currentUser.id || b.customerEmail === currentUser.email));
  };

  const handleVNPayPaymentSuccess = (result: VNPayTransactionResult) => {
    if (!selectedBookingForVNPay) return;
    hotelStore.settleBookingPayment(selectedBookingForVNPay.id, 'VNPAY', result.transactionNo);
    refreshBookings();
    showToast(`Thanh toán thành công đơn phòng ${selectedBookingForVNPay.roomNumber} qua VNPay Sandbox!`, 'success');
    setSelectedBookingForVNPay(null);
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN').length;
  const completedBookings = bookings.filter(b => b.status === 'CHECKED_OUT').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
  const totalSpent = bookings.filter(b => b.status !== 'CANCELLED' && b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8F9FA]">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4 ring-8 ring-amber-50">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="font-luxury text-2xl font-bold text-[#0F172A] mb-2">
          Yêu Cầu Đăng Nhập Tài Khoản
        </h2>
        <p className="text-xs text-[#64748B] max-w-md mb-6 leading-relaxed">
          Quý khách vui lòng đăng nhập tài khoản để tra cứu lịch sử đặt phòng, quản lý dịch vụ và hóa đơn thanh toán điện tử.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-[#0F172A] text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Trang Chủ</span>
          </button>
          <button
            onClick={onOpenLoginModal}
            className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-md"
          >
            <LogIn className="w-4 h-4 text-[#EAB308]" />
            <span>Đăng nhập ngay</span>
          </button>
        </div>
      </div>
    );
  }

  // Cancel booking handler
  const handleCancelBooking = (bookingId: number) => {
    if (window.confirm('Quý khách có chắc chắn muốn hủy đặt phòng này?')) {
      hotelStore.updateBookingStatus(bookingId, 'CANCELLED');
      refreshBookings();
      showToast('Đã hủy đặt phòng thành công', 'info');
    }
  };

  // Submit review handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Vui lòng nhập nhận xét của quý khách', 'warning');
      return;
    }
    hotelStore.addReview({
      bookingId: selectedBookingForReview?.id,
      customerName: currentUser.fullName,
      roomTypeName: selectedBookingForReview?.roomTypeName || 'Deluxe Room',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    showToast('Cảm ơn quý khách đã gửi đánh giá trải nghiệm!', 'success');
    setSelectedBookingForReview(null);
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang chủ đặt phòng</span>
            </button>
            <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Khu Vực Khách Hàng (Customer Portal)
            </h1>
            <p className="text-xs text-[#64748B]">
              Xin chào <strong>{currentUser.fullName}</strong> ({currentUser.email})
            </p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-center"
              title="Đăng xuất khỏi tài khoản"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Đăng xuất tài khoản</span>
            </button>
          )}
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block mb-1">
              Tổng số lần đặt phòng
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums">
                {totalBookings}
              </span>
              <Calendar className="w-5 h-5 text-[#B45309]" />
            </div>
            <span className="text-[10px] text-[#94A3B8] mt-2 block">Toàn bộ lịch sử tại khách sạn</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block mb-1">
              Phòng đang/sắp lưu trú
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold text-emerald-600 tabular-nums">
                {activeBookings}
              </span>
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] text-[#94A3B8] mt-2 block">Đã xác nhận & đang hoạt động</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block mb-1">
              Kỳ nghỉ hoàn tất
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums">
                {completedBookings}
              </span>
              <CheckCircle2 className="w-5 h-5 text-[#B45309]" />
            </div>
            <span className="text-[10px] text-[#94A3B8] mt-2 block">Đã hoàn tất trả phòng</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block mb-1">
              Tổng tiền tích lũy
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-[#0F172A] tabular-nums">
                {totalSpent.toLocaleString('vi-VN')} đ
              </span>
              <CreditCard className="w-5 h-5 text-[#B45309]" />
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-2 block">Hạng thành viên VIP Gold</span>
          </div>
        </div>

        {/* Bookings List Section */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h2 className="font-luxury text-lg font-bold text-[#0F172A]">
                Lịch Sử Đặt Phòng & Hóa Đơn Của Quý Khách
              </h2>
              <span className="text-xs text-[#64748B]">Theo dõi chi tiết trạng thái lưu trú và tải hóa đơn điện tử</span>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Building className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="font-luxury text-base font-bold text-[#0F172A] mb-1">
                Quý khách chưa có đơn đặt phòng nào
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Hãy khám phá các hạng phòng nghỉ dưỡng sang trọng của Aura Grand và đặt phòng ngay hôm nay!
              </p>
              <button
                onClick={onBackToHome}
                className="px-6 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                Khám phá bộ sưu tập phòng
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {bookings.map((booking) => {
                const isCancelled = booking.status === 'CANCELLED';
                const isCheckedOut = booking.status === 'CHECKED_OUT';

                return (
                  <div key={booking.id} className="p-6 hover:bg-[#F8FAFC] transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Booking Code & Room Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                            {booking.bookingCode}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                              booking.status === 'CHECKED_IN'
                                ? 'bg-blue-100 text-blue-700'
                                : booking.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : booking.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-700'
                                : booking.status === 'CHECKED_OUT'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {booking.status === 'CHECKED_IN'
                              ? 'Đang lưu trú'
                              : booking.status === 'CONFIRMED'
                              ? 'Đã xác nhận'
                              : booking.status === 'PENDING'
                              ? 'Chờ thanh toán'
                              : booking.status === 'CHECKED_OUT'
                              ? 'Đã trả phòng'
                              : 'Đã hủy'}
                          </span>
                        </div>

                        <div className="font-luxury text-base font-bold text-[#0F172A]">
                          Phòng {booking.roomNumber} · {booking.roomTypeName}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                          <span>Nhận: <strong className="text-[#0F172A]">{booking.checkInDate}</strong></span>
                          <span>·</span>
                          <span>Trả: <strong className="text-[#0F172A]">{booking.checkOutDate}</strong></span>
                          <span>·</span>
                          <span>{booking.nights} đêm</span>
                          <span>·</span>
                          <span>{booking.numGuests} khách</span>
                        </div>
                      </div>

                      {/* Payment & Price */}
                      <div className="lg:text-right space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">
                          Tổng chi phí
                        </span>
                        <div className="font-mono text-lg font-bold text-[#0F172A] tabular-nums">
                          {booking.totalAmount.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {booking.paymentStatus === 'PAID' ? (
                            <span className="text-emerald-600 font-semibold flex items-center lg:justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã thanh toán</span>
                            </span>
                          ) : (
                            <span className="text-amber-600 font-semibold">Chưa thanh toán</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                        {/* VNPay Sandbox payment button if unpaid */}
                        {booking.paymentStatus !== 'PAID' && !isCancelled && (
                          <button
                            onClick={() => setSelectedBookingForVNPay(booking)}
                            className="px-3.5 py-2 rounded-xl bg-[#005BAA] hover:bg-[#004785] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                            title="Thanh toán ngay qua Cổng VNPAY Sandbox"
                          >
                            <span className="bg-white text-[#005BAA] px-1 py-0.2 rounded font-black text-[9px]">VN</span>
                            <span>Thanh toán VNPAY</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSelectBookingInvoice(booking)}
                          className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#B45309]" />
                          <span>Hóa đơn</span>
                        </button>

                        {/* Review button if checked out */}
                        {isCheckedOut && (
                          <button
                            onClick={() => setSelectedBookingForReview(booking)}
                            className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-[#B45309] hover:bg-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                            <span>Đánh giá</span>
                          </button>
                        )}

                        {/* Cancel button if pending or confirmed */}
                        {!isCancelled && !isCheckedOut && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            Hủy đặt phòng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedBookingForReview && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0]">
              <h3 className="font-luxury text-xl font-bold text-[#0F172A] mb-2">
                Đánh Giá Kỳ Nghỉ Tại Aura Grand
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Phòng {selectedBookingForReview.roomNumber} ({selectedBookingForReview.roomTypeName})
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-2">
                    Mức độ hài lòng của quý khách:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#0F172A] ml-2">
                      {reviewRating === 5 ? 'Tuyệt vời (5/5)' : reviewRating === 4 ? 'Rất tốt (4/5)' : `${reviewRating}/5`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-2">
                    Cảm nhận & Góp ý chi tiết:
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Hãy chia sẻ về chất lượng phòng nghỉ, ẩm thực buffet, dịch vụ spa hoặc thái độ phục vụ của nhân viên..."
                    className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForReview(null)}
                    className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi đánh giá</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* VNPay Sandbox Modal */}
        {selectedBookingForVNPay && (
          <VNPaySandboxModal
            orderCode={selectedBookingForVNPay.bookingCode}
            orderInfo={`Thanh toan tien phong ${selectedBookingForVNPay.roomNumber} (${selectedBookingForVNPay.roomTypeName}) - Aura Grand`}
            amount={selectedBookingForVNPay.totalAmount}
            customerName={selectedBookingForVNPay.customerName}
            customerEmail={selectedBookingForVNPay.customerEmail}
            onClose={() => setSelectedBookingForVNPay(null)}
            onPaymentSuccess={handleVNPayPaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};
