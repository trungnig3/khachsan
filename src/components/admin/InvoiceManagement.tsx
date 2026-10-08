import React, { useState } from 'react';
import { Search, FileText, Printer, CheckCircle2, Download, Eye, DollarSign } from 'lucide-react';
import { Invoice } from '../../types/hotel';

interface InvoiceManagementProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

export const InvoiceManagement: React.FC<InvoiceManagementProps> = ({
  invoices,
  onSelectInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      inv.invoiceCode.toLowerCase().includes(term) ||
      inv.customerName.toLowerCase().includes(term) ||
      inv.bookingCode.toLowerCase().includes(term) ||
      inv.roomNumber.toLowerCase().includes(term)
    );
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
            Quản Lý Hóa Đơn & Thu Ngân (Invoices)
          </h2>
          <p className="text-xs text-[#64748B]">
            Hóa đơn điện tử VAT, theo dõi biên lai thanh toán và xuất bản in cho khách hàng
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border border-[#CBD5E1] shadow-sm text-xs">
          <span className="text-[#64748B] block text-[10px] uppercase font-bold">Tổng doanh số hóa đơn:</span>
          <span className="font-mono font-bold text-base text-[#0F172A] tabular-nums">
            {totalInvoiced.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo số hóa đơn (INV-...), tên khách, mã booking, số phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
              <tr>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Số Hóa Đơn</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Ngày Lập</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Khách Hàng</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Phòng & Booking</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Phương thức</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px] text-right">Tổng Tiền (VAT)</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Trạng Thái</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-[#0F172A] tabular-nums">
                    {inv.invoiceCode}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[#64748B] tabular-nums">
                    {inv.issueDate}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-[#0F172A]">{inv.customerName}</div>
                    <div className="text-[10px] text-[#64748B]">{inv.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-medium text-[#0F172A]">Phòng {inv.roomNumber}</span>
                    <div className="text-[10px] font-mono text-[#64748B]">{inv.bookingCode}</div>
                  </td>
                  <td className="py-3.5 px-6 text-[#475569] text-[11px] truncate max-w-[150px]">
                    {inv.paymentMethod}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-[#0F172A] tabular-nums">
                    {inv.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status === 'PAID' ? 'ĐÃ THU' : 'CHƯA THU'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => onSelectInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[11px] font-semibold text-[#0F172A] hover:bg-white flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>Xem & In</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
