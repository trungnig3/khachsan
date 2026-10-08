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
  LogIn,
  Utensils,
  Tag,
  Copy,
  Sparkles,
  ExternalLink,
  Gift
} from 'lucide-react';
import { Booking, User, HotelService, Promotion, Review } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { VNPaySandboxModal, VNPayTransactionResult } from '../common/VNPaySandboxModal';
import { useToast } from '../ui/Toast';

interface CustomerDashboardProps {
  currentUser: User | null;
  onBackToHome: () => void;
  onSelectBookingInvoice: (booking: Booking) => void;
  onNavigateSection?: (sectionId: 'services' | 'promotions' | 'reviews' | 'rooms') => void;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
  initialTab?: 'bookings' | 'services' | 'promotions' | 'reviews';
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onBackToHome,
  onSelectBookingInvoice,
  onNavigateSection,
  onLogout,
  onOpenLoginModal,
  initialTab = 'bookings',
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'promotions' | 'reviews'>(initialTab);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (!currentUser) return [];
    return hotelStore.getBookings().filter(b => b.customerId === currentUser.id || b.customerEmail === currentUser.email);
  });

  const services = hotelStore.getServices();
  const promotions = hotelStore.getPromotions();
  const [reviewsList, setReviewsList] = useState<Review[]>(() => hotelStore.getReviews());

  // Review Modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [selectedBookingForVNPay, setSelectedBookingForVNPay] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  // General review state
  const [generalRating, setGeneralRating] = useState<number>(5);
  const [generalComment, setGeneralComment] = useState('');

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

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'bookings'
                ? 'border-[#D4AF37] text-[#0F172A] bg-white shadow-xs'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#B45309]" />
            <span>Phòng đã đặt & Hóa đơn ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'services'
                ? 'border-[#D4AF37] text-[#0F172A] bg-white shadow-xs'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/50'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#B45309]" />
            <span>Dịch vụ & Spa cao cấp ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'promotions'
                ? 'border-[#D4AF37] text-[#0F172A] bg-white shadow-xs'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/50'
            }`}
          >
            <Tag className="w-4 h-4 text-[#B45309]" />
            <span>Ưu đãi đặc quyền & Voucher ({promotions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#D4AF37] text-[#0F172A] bg-white shadow-xs'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/50'
            }`}
          >
            <Star className="w-4 h-4 text-[#B45309]" />
            <span>Đánh giá & Trải nghiệm ({reviewsList.length})</span>
          </button>
        </div>

        {/* Tab 1: Bookings List Section */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-12">
            <div className="px-6 py-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-luxury text-lg font-bold text-[#0F172A]">
                  Lịch Sử Đặt Phòng & Hóa Đơn Của Quý Khách
                </h2>
                <span className="text-xs text-[#64748B]">Theo dõi chi tiết trạng thái lưu trú và tải hóa đơn điện tử</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateSection ? onNavigateSection('services') : setActiveTab('services')}
                  className="text-xs font-semibold text-[#B45309] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Dịch vụ & Spa</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => onNavigateSection ? onNavigateSection('promotions') : setActiveTab('promotions')}
                  className="text-xs font-semibold text-[#B45309] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Ưu đãi đặc quyền</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => onNavigateSection ? onNavigateSection('reviews') : setActiveTab('reviews')}
                  className="text-xs font-semibold text-[#B45309] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Đánh giá</span>
                </button>
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
        )}

        {/* Tab 2: Services & Spa Section */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-12 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E2E8F0]">
              <div>
                <h2 className="font-luxury text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#D4AF37]" />
                  <span>Dịch Vụ & Tiện Ích Phòng Nghỉ Dưỡng</span>
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Thưởng thức ẩm thực cao cấp, trị liệu spa đá nóng và dịch vụ đưa đón ngay tại khu nghỉ dưỡng
                </p>
              </div>
              {onNavigateSection && (
                <button
                  onClick={() => onNavigateSection('services')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309] hover:underline cursor-pointer self-start sm:self-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Xem trên trang chủ khách sạn</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="border border-[#E2E8F0] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group bg-[#F8FAFC]/50"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={svc.imageUrl}
                        alt={svc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                        {svc.category}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-luxury font-bold text-base text-[#0F172A]">
                        {svc.name}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                        {svc.description}
                      </p>
                      {svc.unit && (
                        <div className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Đơn vị tính: {svc.unit}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-[#F1F5F9] mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block">Giá dịch vụ</span>
                      <span className="font-mono text-sm font-bold text-[#D4AF37]">
                        {svc.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Đã ghi nhận yêu cầu dịch vụ "${svc.name}"! Nhân viên lễ tân sẽ liên hệ quý khách trong ít phút.`, 'success');
                      }}
                      className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Yêu cầu dịch vụ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Promotions & Vouchers Section */}
        {activeTab === 'promotions' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-12 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E2E8F0]">
              <div>
                <h2 className="font-luxury text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#D4AF37]" />
                  <span>Ưu Đãi Đặc Quyền & Voucher Thành Viên</span>
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Mã giảm giá độc quyền dành riêng cho khách hàng thành viên Aura Grand Luxury Resort
                </p>
              </div>
              {onNavigateSection && (
                <button
                  onClick={() => onNavigateSection('promotions')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309] hover:underline cursor-pointer self-start sm:self-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Xem trên trang chủ khách sạn</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="p-5 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 relative flex flex-col justify-between hover:border-amber-400 transition-all shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {promo.discountType === 'PERCENTAGE' ? `GIẢM ${promo.discountValue}%` : `GIẢM ${promo.discountValue.toLocaleString('vi-VN')} Đ`}
                      </span>
                      <span className="text-[10px] text-[#64748B]">HSD: {promo.endDate}</span>
                    </div>

                    <h4 className="font-luxury font-bold text-base text-[#0F172A]">
                      {promo.title}
                    </h4>

                    {promo.maxDiscount && (
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        Giảm tối đa lên đến {promo.maxDiscount.toLocaleString('vi-VN')} đ cho mỗi đơn đặt phòng.
                      </p>
                    )}

                    <div className="text-[11px] text-[#94A3B8]">
                      Đơn tối thiểu: <strong>{promo.minOrderValue ? `${promo.minOrderValue.toLocaleString('vi-VN')} đ` : 'Không giới hạn'}</strong>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-amber-200/60 flex items-center justify-between gap-3">
                    <div className="font-mono font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-amber-300 text-[#0F172A] tracking-wider select-all">
                      {promo.code}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(promo.code);
                        showToast(`Đã sao chép mã "${promo.code}" vào bộ nhớ tạm!`, 'success');
                      }}
                      className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#B45309] text-slate-900 hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 mb-12">
            {/* Write a review card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
              <h3 className="font-luxury text-lg font-bold text-[#0F172A] mb-1">
                Gửi Đánh Giá Trải Nghiệm Của Quý Khách
              </h3>
              <p className="text-xs text-[#64748B] mb-5">
                Chia sẻ ý kiến chân thực của quý khách giúp Aura Grand ngày càng hoàn thiện chất lượng phục vụ 5 sao.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!generalComment.trim()) {
                    showToast('Vui lòng nhập nhận xét của quý khách', 'warning');
                    return;
                  }
                  hotelStore.addReview({
                    customerName: currentUser.fullName,
                    roomTypeName: 'Kỳ Nghỉ Nghỉ Dưỡng',
                    rating: generalRating,
                    comment: generalComment.trim(),
                  });
                  setReviewsList(hotelStore.getReviews());
                  setGeneralComment('');
                  showToast('Cảm ơn quý khách đã gửi đánh giá trải nghiệm tại khách sạn!', 'success');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-[#475569] mb-1.5">
                    Mức độ hài lòng của quý khách:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setGeneralRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= generalRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-bold text-xs text-[#0F172A] ml-2">
                      {generalRating === 5 ? 'Tuyệt vời (5/5)' : generalRating === 4 ? 'Rất tốt (4/5)' : `${generalRating}/5 sao`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1.5">
                    Nội dung nhận xét & góp ý:
                  </label>
                  <textarea
                    rows={3}
                    value={generalComment}
                    onChange={(e) => setGeneralComment(e.target.value)}
                    placeholder="Chia sẻ về không gian phòng, dịch vụ spa, ẩm thực buffet hoặc đội ngũ nhân viên lễ tân..."
                    required
                    className="w-full p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Gửi nhận xét</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of guest reviews */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="font-luxury text-lg font-bold text-[#0F172A]">
                    Đánh Giá Từ Các Du Khách Khác ({reviewsList.length})
                  </h3>
                  <span className="text-xs text-[#64748B]">Xếp hạng trung bình 4.9/5 sao từ hơn 1,200 lượt khách</span>
                </div>
                {onNavigateSection && (
                  <button
                    onClick={() => onNavigateSection('reviews')}
                    className="text-xs font-semibold text-[#B45309] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Xem trên trang chủ</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                          {rev.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-[#0F172A] block">{rev.customerName}</span>
                          <span className="text-[10px] text-[#94A3B8]">{rev.roomTypeName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-[#94A3B8] block text-right">
                      {rev.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
