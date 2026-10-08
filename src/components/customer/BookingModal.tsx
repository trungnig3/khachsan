import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  QrCode,
  DollarSign,
  Printer,
  Tag,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import { Booking, BookingServiceItem, HotelService, Room, User as UserType } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { VNPaySandboxModal, VNPayTransactionResult } from '../common/VNPaySandboxModal';
import { useToast } from '../ui/Toast';

interface BookingModalProps {
  room: Room;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  currentUser: UserType | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  currentUser,
  onClose,
  onBookingSuccess,
}) => {
  const { showToast } = useToast();

  // Booking details state
  const [checkInDate, setCheckInDate] = useState<string>(
    initialCheckIn || new Date().toISOString().slice(0, 10)
  );
  
  // Default checkout is 1 day after checkin
  const defaultNextDay = useMemo(() => {
    const d = new Date(checkInDate || Date.now());
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [checkInDate]);

  const [checkOutDate, setCheckOutDate] = useState<string>(
    initialCheckOut || defaultNextDay
  );

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '0901234567');
  const [numGuests, setNumGuests] = useState(initialGuests);
  const [specialRequests, setSpecialRequests] = useState('');

  // Add-on services state
  const availableServices = useMemo(() => hotelStore.getServices().filter(s => s.available), []);
  const [selectedServices, setSelectedServices] = useState<{ [serviceId: number]: number }>({});

  // Promotion coupon state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);

  // Payment method (VNPAY is now primary)
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH'>('VNPAY');
  const [showVNPayModal, setShowVNPayModal] = useState(false);
  const [pendingBookingForVNPay, setPendingBookingForVNPay] = useState<Booking | null>(null);

  // Submit and step state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Calculate nights
  const nights = useMemo(() => {
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    if (end <= start) return 1;
    const diffTime = Math.abs(end - start);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [checkInDate, checkOutDate]);

  // Financial calculations
  const totalRoomPrice = useMemo(() => {
    return room.pricePerNight * nights;
  }, [room.pricePerNight, nights]);

  const servicesTotal = useMemo(() => {
    let sum = 0;
    for (const sId in selectedServices) {
      const qty = selectedServices[sId];
      if (qty > 0) {
        const s = availableServices.find(item => item.id === Number(sId));
        if (s) {
          sum += s.price * qty;
        }
      }
    }
    return sum;
  }, [selectedServices, availableServices]);

  const rawSubtotal = totalRoomPrice + servicesTotal;

  const discountAmount = useMemo(() => {
    return appliedPromo ? appliedPromo.discount : 0;
  }, [appliedPromo]);

  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.08); // 8% VAT
  const totalAmount = taxableAmount + taxAmount;

  // Toggle or increase service quantity
  const handleServiceQtyChange = (serviceId: number, delta: number) => {
    setSelectedServices(prev => {
      const current = prev[serviceId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[serviceId];
        return copy;
      }
      return { ...prev, [serviceId]: next };
    });
  };

  // Apply Voucher Code
  const handleApplyCoupon = () => {
    if (!promoCode.trim()) {
      showToast('Vui lòng nhập mã giảm giá', 'warning');
      return;
    }
    const result = hotelStore.validatePromotion(promoCode, rawSubtotal);
    if (result.valid) {
      setAppliedPromo({
        code: promoCode.trim().toUpperCase(),
        discount: result.discount,
        message: result.message,
      });
      showToast(result.message, 'success');
    } else {
      setAppliedPromo(null);
      showToast(result.message, 'error');
    }
  };

  // Handle Form Submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      showToast('Vui lòng điền đầy đủ họ tên, email và số điện thoại liên lạc', 'warning');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      showToast('Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm', 'warning');
      return;
    }

    setIsSubmitting(true);

    // Map selected services
    const servicesList: BookingServiceItem[] = [];
    for (const sId in selectedServices) {
      const qty = selectedServices[sId];
      if (qty > 0) {
        const s = availableServices.find(item => item.id === Number(sId));
        if (s) {
          servicesList.push({
            serviceId: s.id,
            serviceName: s.name,
            quantity: qty,
            unitPrice: s.price,
            totalPrice: s.price * qty,
          });
        }
      }
    }

    // Call store
    const isVNPay = paymentMethod === 'VNPAY';
    const result = hotelStore.createBooking({
      customerId: currentUser?.id || 999,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomTypeName: room.roomTypeName || 'Deluxe Room',
      checkInDate,
      checkOutDate,
      nights,
      numGuests,
      roomPricePerNight: room.pricePerNight,
      totalRoomPrice,
      servicesTotal,
      discountAmount,
      taxAmount,
      totalAmount,
      status: paymentMethod === 'CASH' ? 'PENDING' : 'CONFIRMED',
      paymentStatus: paymentMethod === 'CASH' ? 'UNPAID' : (isVNPay ? 'UNPAID' : 'PAID'),
      paymentMethod,
      services: servicesList,
      specialRequests: specialRequests.trim(),
    });

    setIsSubmitting(false);

    if (result.success && result.booking) {
      if (isVNPay) {
        setPendingBookingForVNPay(result.booking);
        setShowVNPayModal(true);
      } else {
        setCompletedBooking(result.booking);
        showToast(`Đặt phòng thành công! Mã đơn: ${result.booking.bookingCode}`, 'success');
        onBookingSuccess(result.booking);
      }
    } else {
      showToast(result.message || 'Có lỗi xảy ra khi tạo đơn đặt phòng', 'error');
    }
  };

  const handleVNPayPaymentSuccess = (res: VNPayTransactionResult) => {
    if (!pendingBookingForVNPay) return;
    const settleRes = hotelStore.settleBookingPayment(pendingBookingForVNPay.id, 'VNPAY', res.transactionNo);
    const updated = settleRes.booking || { ...pendingBookingForVNPay, paymentStatus: 'PAID' as const };
    setCompletedBooking(updated);
    showToast(`Thanh toán VNPAY Sandbox thành công! Đơn phòng: ${pendingBookingForVNPay.bookingCode}`, 'success');
    onBookingSuccess(updated);
    setShowVNPayModal(false);
  };

  // If Booking is successful, render Success & Invoice Preview screen
  if (completedBooking) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] my-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-2"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold block mb-1">
            Xác Nhận Thành Công
          </span>
          <h2 className="font-luxury text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
            Kỳ Nghỉ Của Quý Khách Đã Được Đặt!
          </h2>
          <p className="text-xs text-[#64748B] mb-6">
            Mã xác nhận phòng đã được gửi tới email <strong className="text-[#0F172A]">{completedBooking.customerEmail}</strong>. Lễ tân sẵn sàng đón tiếp quý khách.
          </p>

          {/* Receipt Card */}
          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] text-left text-xs space-y-3 mb-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Mã đặt phòng (Booking Code):</span>
              <span className="font-mono font-bold text-sm text-[#0F172A] tabular-nums">
                {completedBooking.bookingCode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#64748B] block">Hạng phòng & Số phòng:</span>
                <span className="font-semibold text-[#0F172A]">
                  Phòng {completedBooking.roomNumber} ({completedBooking.roomTypeName})
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Khách hàng:</span>
                <span className="font-semibold text-[#0F172A]">{completedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Nhận phòng:</span>
                <span className="font-semibold text-[#0F172A]">{completedBooking.checkInDate} (từ 14:00)</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Trả phòng:</span>
                <span className="font-semibold text-[#0F172A]">{completedBooking.checkOutDate} (trước 12:00)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-sm">
              <span className="font-bold text-[#0F172A]">Tổng thanh toán:</span>
              <span className="font-mono font-bold text-[#0F172A] text-base tabular-nums">
                {completedBooking.totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#64748B]">
              <span>Trạng thái thanh toán:</span>
              <span className={`font-semibold ${completedBooking.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {completedBooking.paymentStatus === 'PAID' ? 'Đã thanh toán thành công' : 'Thanh toán tại quầy khi nhận phòng'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In xác nhận / Hóa đơn</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Hoàn tất & Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E2E8F0] my-8 relative flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#0F172A] text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#EAB308] font-semibold block">
              Đặt Phòng Trực Tuyến 5 Sao
            </span>
            <h2 className="font-luxury text-xl font-bold">
              Phòng {room.roomNumber} - {room.roomTypeName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitBooking} className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Section 1: Thời gian lưu trú & Số khách */}
          <div>
            <h3 className="font-luxury text-base font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B45309]" />
              <span>1. Thời gian lưu trú & Số lượng khách</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Ngày nhận phòng *
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Ngày trả phòng *
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Số khách lưu trú *
                </label>
                <select
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                >
                  <option value={1}>1 Người lớn</option>
                  <option value={2}>2 Người lớn (Tiêu chuẩn)</option>
                  <option value={3}>3 Người lớn</option>
                  <option value={4}>4 Người lớn</option>
                </select>
              </div>
            </div>

            <div className="mt-2 text-xs text-[#64748B] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Thời gian lưu trú dự kiến: <strong>{nights} đêm</strong></span>
            </div>
          </div>

          {/* Section 2: Thông tin khách hàng */}
          <div>
            <h3 className="font-luxury text-base font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#B45309]" />
              <span>2. Thông tin khách hàng nhận phòng</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Họ và tên đầy đủ *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Địa chỉ Email *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Số điện thoại di động *
                </label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Yêu cầu đặc biệt (nếu có)
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Cần chuẩn bị cũi cho em bé, hoa tươi kỷ niệm ngày cưới, phòng không hút thuốc..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
              />
            </div>
          </div>

          {/* Section 3: Dịch vụ khách sạn bổ sung */}
          <div>
            <h3 className="font-luxury text-base font-bold text-[#0F172A] mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B45309]" />
                <span>3. Tiện ích & Dịch vụ đi kèm</span>
              </div>
              <span className="text-xs font-normal text-[#64748B]">Tùy chọn bổ sung</span>
            </h3>

            <div className="space-y-3">
              {availableServices.map((service) => {
                const qty = selectedServices[service.id] || 0;
                return (
                  <div
                    key={service.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      qty > 0 ? 'bg-amber-50/50 border-[#D4AF37]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0F172A]">{service.name}</span>
                        <span className="text-[10px] text-[#64748B]">({service.unit})</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-1">{service.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#0F172A] tabular-nums">
                        {service.price.toLocaleString('vi-VN')} đ
                      </span>

                      <div className="flex items-center gap-2 bg-white rounded-lg border border-[#CBD5E1] p-1">
                        <button
                          type="button"
                          onClick={() => handleServiceQtyChange(service.id, -1)}
                          disabled={qty === 0}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleServiceQtyChange(service.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Mã ưu đãi & Phương thức thanh toán */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#F1F5F9]">
            {/* Voucher promotion */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Mã khuyến mãi / Voucher</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: WELCOME10, LUXURYVIP"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 uppercase px-3.5 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{appliedPromo.message}</span>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Phương thức thanh toán *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('VNPAY')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'VNPAY'
                      ? 'border-[#005BAA] bg-[#005BAA] text-white shadow-md'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-0.5 mb-1">
                    <span className={`font-black text-xs ${paymentMethod === 'VNPAY' ? 'text-white' : 'text-[#005BAA]'}`}>VN</span>
                    <span className={`font-black text-xs ${paymentMethod === 'VNPAY' ? 'text-red-200' : 'text-[#ED1C24]'}`}>PAY</span>
                  </div>
                  <span className="text-[10px] block font-bold leading-tight">Cổng VNPAY Sandbox</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-md'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]'
                  }`}
                >
                  <QrCode className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[10px] block font-semibold leading-tight">Chuyển khoản QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-md'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[10px] block font-semibold leading-tight">Thẻ Visa/Master</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'CASH'
                      ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-md'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]'
                  }`}
                >
                  <DollarSign className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[10px] block font-semibold leading-tight">Tại quầy lễ tân</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Tóm tắt chi phí thanh toán */}
          <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between text-[#64748B]">
              <span>Tiền phòng ({room.pricePerNight.toLocaleString('vi-VN')} đ x {nights} đêm):</span>
              <span className="font-mono tabular-nums">{totalRoomPrice.toLocaleString('vi-VN')} đ</span>
            </div>

            {servicesTotal > 0 && (
              <div className="flex justify-between text-[#64748B]">
                <span>Dịch vụ khách sạn bổ sung:</span>
                <span className="font-mono tabular-nums">+{servicesTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Ưu đãi giảm giá ({appliedPromo?.code}):</span>
                <span className="font-mono tabular-nums">-{discountAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}

            <div className="flex justify-between text-[#64748B]">
              <span>Thuế giá trị gia tăng VAT (8%):</span>
              <span className="font-mono tabular-nums">+{taxAmount.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-sm font-bold text-[#0F172A]">
              <span>Tổng số tiền thanh toán:</span>
              <span className="font-mono text-lg text-[#0F172A] tabular-nums">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-xl hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang khởi tạo đặt phòng...' : 'Xác nhận đặt phòng ngay'}
            </button>
          </div>
        </form>
      </div>

      {/* VNPay Sandbox Gateway Modal */}
      {showVNPayModal && pendingBookingForVNPay && (
        <VNPaySandboxModal
          orderCode={pendingBookingForVNPay.bookingCode}
          orderInfo={`Thanh toan don phong ${pendingBookingForVNPay.roomNumber} (${pendingBookingForVNPay.roomTypeName}) - Khach san Aura Grand`}
          amount={pendingBookingForVNPay.totalAmount}
          customerName={pendingBookingForVNPay.customerName}
          customerEmail={pendingBookingForVNPay.customerEmail}
          onClose={() => {
            setShowVNPayModal(false);
            if (pendingBookingForVNPay) {
              setCompletedBooking(pendingBookingForVNPay);
            }
          }}
          onPaymentSuccess={handleVNPayPaymentSuccess}
        />
      )}
    </div>
  );
};
