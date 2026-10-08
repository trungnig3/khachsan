import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Crown,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Building2,
  DollarSign
} from 'lucide-react';
import { Invoice } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { VNPaySandboxModal, VNPayTransactionResult } from './VNPaySandboxModal';
import { useToast } from '../ui/Toast';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onInvoiceUpdated?: (updatedInvoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  onClose,
  onInvoiceUpdated,
}) => {
  const { showToast } = useToast();
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(invoice);
  const [showVNPayModal, setShowVNPayModal] = useState(false);

  useEffect(() => {
    setCurrentInvoice(invoice);
  }, [invoice]);

  if (!currentInvoice) return null;

  const isPaid = currentInvoice.status === 'PAID';

  const handleVNPaySuccess = (result: VNPayTransactionResult) => {
    const res = hotelStore.settleBookingPayment(
      currentInvoice.bookingId,
      'VNPAY',
      result.transactionNo
    );

    if (res.success && res.invoice) {
      setCurrentInvoice(res.invoice);
      onInvoiceUpdated?.(res.invoice);
      showToast('Đã ghi nhận thanh toán hóa đơn qua VNPAY Sandbox thành công!', 'success');
    }
    setShowVNPayModal(false);
  };

  const handleCashSettle = () => {
    const res = hotelStore.settleBookingPayment(
      currentInvoice.bookingId,
      'CASH'
    );
    if (res.success && res.invoice) {
      setCurrentInvoice(res.invoice);
      onInvoiceUpdated?.(res.invoice);
      showToast('Đã xác nhận thu tiền mặt và quyết toán hóa đơn!', 'success');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#E2E8F0] my-8 relative flex flex-col overflow-hidden max-h-[92vh]">
          {/* Modal Top Action Bar (no-print) */}
          <div className="no-print px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#EAB308] font-bold">
                Hóa Đơn Điện Tử Khách Sạn (VAT Invoice)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B45309] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-lg flex items-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>In Hóa Đơn</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Document Body */}
          <div className="p-8 sm:p-12 overflow-y-auto flex-1 font-sans text-[#0F172A] bg-white print:p-0">
            {/* Header & Logo */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b-2 border-[#0F172A]">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <span className="font-luxury text-xl font-bold tracking-widest text-[#0F172A]">
                    AURA GRAND RESORT
                  </span>
                </div>
                <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
                  Đại lộ Hoàng Hôn, Bãi Dài, Đặc Khu Nghỉ Dưỡng Quốc Tế, Phú Quốc<br />
                  MST: 0317899668 · Hotline: +84 (0) 297 388 9999<br />
                  Email: billing@auragrand.vn
                </p>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B45309] block">
                  HÓA ĐƠN DỊCH VỤ NGHỈ DƯỠNG
                </span>
                <div className="font-mono text-base font-bold text-[#0F172A] tabular-nums">
                  {currentInvoice.invoiceCode}
                </div>
                <div className="text-xs text-[#64748B]">
                  Ngày lập: <strong>{currentInvoice.issueDate}</strong>
                </div>
                <div className="text-xs text-[#64748B]">
                  Mã booking: <strong className="font-mono text-[#0F172A]">{currentInvoice.bookingCode}</strong>
                </div>
              </div>
            </div>

            {/* Customer & Stay Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-[#E2E8F0] text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-2">
                  Thông tin khách hàng:
                </span>
                <div className="font-bold text-sm text-[#0F172A] mb-1">{currentInvoice.customerName}</div>
                <div className="text-[#64748B] space-y-0.5">
                  <div>Email: {currentInvoice.customerEmail}</div>
                  <div>Điện thoại: {currentInvoice.customerPhone}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-2">
                  Chi tiết kỳ lưu trú:
                </span>
                <div className="font-bold text-sm text-[#0F172A] mb-1">
                  Phòng {currentInvoice.roomNumber} · {currentInvoice.roomTypeName}
                </div>
                <div className="text-[#64748B] space-y-0.5">
                  <div>Nhận phòng: {currentInvoice.checkInDate} (14:00)</div>
                  <div>Trả phòng: {currentInvoice.checkOutDate} (12:00)</div>
                  <div>Tổng số đêm: <strong>{currentInvoice.nights} đêm</strong></div>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#CBD5E1] text-[#64748B]">
                    <th className="py-2.5 font-bold uppercase text-[10px]">Mục chi phí</th>
                    <th className="py-2.5 font-bold uppercase text-[10px] text-center">Số lượng</th>
                    <th className="py-2.5 font-bold uppercase text-[10px] text-right">Đơn giá</th>
                    <th className="py-2.5 font-bold uppercase text-[10px] text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-[#0F172A]">Tiền phòng ({currentInvoice.roomTypeName})</div>
                      <div className="text-[11px] text-[#64748B]">Phòng {currentInvoice.roomNumber} - {currentInvoice.checkInDate} đến {currentInvoice.checkOutDate}</div>
                    </td>
                    <td className="py-3 text-center font-mono tabular-nums">{currentInvoice.nights} đêm</td>
                    <td className="py-3 text-right font-mono tabular-nums">
                      {(currentInvoice.roomCharges / (currentInvoice.nights || 1)).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-[#0F172A] tabular-nums">
                      {currentInvoice.roomCharges.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>

                  {currentInvoice.serviceCharges > 0 && (
                    <tr>
                      <td className="py-3">
                        <div className="font-bold text-[#0F172A]">Dịch vụ khách sạn & Minibar & Spa</div>
                        <div className="text-[11px] text-[#64748B]">Các gói tiện ích đăng ký thêm trong kỳ lưu trú</div>
                      </td>
                      <td className="py-3 text-center font-mono tabular-nums">Gói</td>
                      <td className="py-3 text-right font-mono tabular-nums">{currentInvoice.serviceCharges.toLocaleString('vi-VN')} đ</td>
                      <td className="py-3 text-right font-mono font-bold text-[#0F172A] tabular-nums">
                        {currentInvoice.serviceCharges.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Calculation breakdown */}
            <div className="pt-4 border-t border-[#CBD5E1] flex flex-col sm:flex-row justify-between gap-6 text-xs">
              <div className="space-y-2 max-w-xs">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                  Phương thức thanh toán:
                </span>
                <p className="font-semibold text-[#0F172A]">{currentInvoice.paymentMethod}</p>

                {isPaid ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Trạng thái: Đã thanh toán đầy đủ</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>Trạng thái: Chưa thanh toán ({currentInvoice.totalAmount.toLocaleString('vi-VN')} đ)</span>
                    </div>

                    {/* Quick Payment Action Buttons (no-print) */}
                    <div className="no-print pt-1 flex flex-col gap-2">
                      <button
                        onClick={() => setShowVNPayModal(true)}
                        className="w-full py-2 px-3 bg-[#005BAA] hover:bg-[#004785] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <span className="bg-white text-[#005BAA] px-1.5 py-0.2 rounded font-black text-[10px]">VN</span>
                        <span>Thanh toán qua VNPAY Sandbox</span>
                      </button>

                      <button
                        onClick={handleCashSettle}
                        className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-[11px] font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xác nhận đã thu tiền tại quầy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-64 space-y-2">
                <div className="flex justify-between text-[#64748B]">
                  <span>Cộng tiền phòng & dịch vụ:</span>
                  <span className="font-mono tabular-nums">
                    {(currentInvoice.roomCharges + currentInvoice.serviceCharges).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {currentInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Khuyến mãi / Voucher giảm giá:</span>
                    <span className="font-mono tabular-nums">-{currentInvoice.discount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}

                <div className="flex justify-between text-[#64748B]">
                  <span>Thuế GTGT VAT (8%):</span>
                  <span className="font-mono tabular-nums">+{currentInvoice.tax.toLocaleString('vi-VN')} đ</span>
                </div>

                <div className="pt-2 border-t border-[#0F172A] flex justify-between items-center text-sm font-bold text-[#0F172A]">
                  <span>TỔNG CỘNG:</span>
                  <span className="font-mono text-base tabular-nums">
                    {currentInvoice.totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Stamp & Signatures */}
            <div className="mt-12 pt-8 border-t border-dashed border-[#CBD5E1] grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <span className="font-bold text-[#0F172A] block mb-1">KHÁCH HÀNG</span>
                <span className="text-[10px] text-[#94A3B8] block">(Ký & ghi rõ họ tên)</span>
                <div className="h-16" />
                <span className="font-medium text-[#0F172A]">{currentInvoice.customerName}</span>
              </div>

              <div>
                <span className="font-bold text-[#0F172A] block mb-1">ĐẠI DIỆN KHÁCH SẠN</span>
                <span className="text-[10px] text-[#94A3B8] block">(Ký, đóng dấu điện tử)</span>
                <div className="h-16 flex items-center justify-center">
                  {isPaid ? (
                    <span className="border-2 border-red-500 text-red-500 font-bold text-[10px] px-3 py-1 rounded rotate-[-6deg] uppercase tracking-wider">
                      AURA GRAND · ĐÃ THU TIỀN
                    </span>
                  ) : (
                    <span className="border-2 border-amber-500 border-dashed text-amber-600 font-bold text-[10px] px-3 py-1 rounded rotate-[-6deg] uppercase tracking-wider">
                      CHỜ THANH TOÁN
                    </span>
                  )}
                </div>
                <span className="font-medium text-[#0F172A]">Bộ phận Kế toán & Lễ tân</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VNPay Sandbox Modal Integration */}
      {showVNPayModal && (
        <VNPaySandboxModal
          orderCode={currentInvoice.bookingCode}
          orderInfo={`Thanh toan hoa don phong ${currentInvoice.roomNumber} - Khach san Aura Grand`}
          amount={currentInvoice.totalAmount}
          customerName={currentInvoice.customerName}
          customerEmail={currentInvoice.customerEmail}
          onClose={() => setShowVNPayModal(false)}
          onPaymentSuccess={handleVNPaySuccess}
        />
      )}
    </>
  );
};
