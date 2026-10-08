import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  ArrowRight,
  ShieldCheck,
  Building,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { VNPaySandboxModal, VNPayTransactionResult } from '../common/VNPaySandboxModal';
import { useToast } from '../ui/Toast';

interface BookingManagementProps {
  bookings: Booking[];
  onRefresh: () => void;
  onViewInvoice: (booking: Booking) => void;
}

export const BookingManagement: React.FC<BookingManagementProps> = ({
  bookings,
  onRefresh,
  onViewInvoice,
}) => {
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBookingForVNPay, setSelectedBookingForVNPay] = useState<Booking | null>(null);

  // Status transitions
  const handleUpdateStatus = (bookingId: number, newStatus: BookingStatus) => {
    const success = hotelStore.updateBookingStatus(bookingId, newStatus);
    if (success) {
      showToast(`Đã chuyển trạng thái booking sang ${newStatus}`, 'success');
      onRefresh();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(hotelStore.getBookings().find(b => b.id === bookingId) || null);
      }
    }
  };

  const handleTogglePayment = (bookingId: number) => {
    hotelStore.toggleBookingPaymentStatus(bookingId);
    showToast('Đã cập nhật trạng thái thanh toán & hóa đơn', 'success');
    onRefresh();
  };

  const handleVNPaySuccess = (result: VNPayTransactionResult) => {
    if (!selectedBookingForVNPay) return;
    hotelStore.settleBookingPayment(selectedBookingForVNPay.id, 'VNPAY', result.transactionNo);
    showToast(`Đã thu tiền phòng ${selectedBookingForVNPay.roomNumber} qua VNPay Sandbox thành công!`, 'success');
    setSelectedBookingForVNPay(null);
    onRefresh();
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchCode = b.bookingCode.toLowerCase().includes(term);
        const matchName = b.customerName.toLowerCase().includes(term);
        const matchPhone = b.customerPhone.toLowerCase().includes(term);
        const matchRoom = b.roomNumber.toLowerCase().includes(term);
        if (!matchCode && !matchName && !matchPhone && !matchRoom) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
            Quản Lý Đặt Phòng (Bookings)
          </h2>
          <p className="text-xs text-[#64748B]">
            Xác nhận đơn trực tuyến, quản lý lịch trình khách lưu trú và ngăn chặn trùng lịch phòng
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn (AG-...), tên khách, số điện thoại, số phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {st === 'ALL'
                ? `Tất cả (${bookings.length})`
                : st === 'PENDING'
                ? 'Chờ duyệt'
                : st === 'CONFIRMED'
                ? 'Đã duyệt'
                : st === 'CHECKED_IN'
                ? 'Đang ở'
                : st === 'CHECKED_OUT'
                ? 'Đã trả phòng'
                : 'Đã hủy'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
              <tr>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Mã Booking</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Khách hàng</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Phòng nghỉ</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Thời gian</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px] text-right">Tổng tiền</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Thanh toán</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Trạng thái</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-[#0F172A] tabular-nums">
                    {b.bookingCode}
                  </td>

                  <td className="py-3.5 px-6">
                    <div className="font-bold text-[#0F172A]">{b.customerName}</div>
                    <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                      <span>{b.customerPhone}</span>
                      <span>·</span>
                      <span className="truncate max-w-[120px]">{b.customerEmail}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-6">
                    <span className="font-bold text-[#0F172A]">Phòng {b.roomNumber}</span>
                    <div className="text-[10px] text-[#64748B]">{b.roomTypeName}</div>
                  </td>

                  <td className="py-3.5 px-6 text-[#334155]">
                    <div>{b.checkInDate} → {b.checkOutDate}</div>
                    <div className="text-[10px] text-[#64748B]">{b.nights} đêm ({b.numGuests} khách)</div>
                  </td>

                  <td className="py-3.5 px-6 text-right font-mono font-bold text-[#0F172A] tabular-nums">
                    {b.totalAmount.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => handleTogglePayment(b.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all hover:scale-105 flex items-center gap-1 ${
                        b.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200 ring-1 ring-amber-300'
                      }`}
                      title="Bấm để chuyển đổi trạng thái ĐÃ TRẢ / CHƯA TRẢ"
                    >
                      {b.paymentStatus === 'PAID' ? '✓ ĐÃ TRẢ' : '⚡ CHƯA TRẢ'}
                    </button>
                  </td>

                  <td className="py-3.5 px-6">
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        b.status === 'CHECKED_IN'
                          ? 'bg-blue-100 text-blue-700'
                          : b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : b.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : b.status === 'CHECKED_OUT'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Quick VNPay Sandbox test payment if unpaid */}
                      {b.paymentStatus !== 'PAID' && b.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setSelectedBookingForVNPay(b)}
                          className="px-2 py-1 bg-[#005BAA] hover:bg-[#004785] text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                          title="Thanh toán thử qua VNPay Sandbox"
                        >
                          <span className="bg-white text-[#005BAA] px-1 rounded font-black text-[8px]">VN</span>
                          <span>Thu VNPay</span>
                        </button>
                      )}

                      {/* Workflow Actions */}
                      {b.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                          title="Xác nhận duyệt đặt phòng"
                        >
                          Duyệt
                        </button>
                      )}

                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'CHECKED_IN')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                          title="Check-in giao chìa khóa cho khách"
                        >
                          Check-in
                        </button>
                      )}

                      {b.status === 'CHECKED_IN' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'CHECKED_OUT')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                          title="Trả phòng & Quyết toán hoàn tất"
                        >
                          Check-out
                        </button>
                      )}

                      {b.status !== 'CANCELLED' && b.status !== 'CHECKED_OUT' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 text-[10px] font-medium rounded-lg cursor-pointer"
                          title="Hủy đơn"
                        >
                          Hủy
                        </button>
                      )}

                      <button
                        onClick={() => onViewInvoice(b)}
                        className="p-1.5 text-[#B45309] hover:bg-amber-50 rounded-lg cursor-pointer"
                        title="Xem hóa đơn"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VNPay Sandbox Modal */}
      {selectedBookingForVNPay && (
        <VNPaySandboxModal
          orderCode={selectedBookingForVNPay.bookingCode}
          orderInfo={`Thanh toan don phong ${selectedBookingForVNPay.roomNumber} - Khach san Aura Grand`}
          amount={selectedBookingForVNPay.totalAmount}
          customerName={selectedBookingForVNPay.customerName}
          customerEmail={selectedBookingForVNPay.customerEmail}
          onClose={() => setSelectedBookingForVNPay(null)}
          onPaymentSuccess={handleVNPaySuccess}
        />
      )}
    </div>
  );
};
