import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit, CheckCircle2, XCircle, X } from 'lucide-react';
import { Promotion } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface PromotionManagementProps {
  promotions: Promotion[];
  onRefresh: () => void;
}

export const PromotionManagement: React.FC<PromotionManagementProps> = ({
  promotions,
  onRefresh,
}) => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(2000000);
  const [maxDiscount, setMaxDiscount] = useState<number>(500000);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(100);

  const handleOpenAdd = () => {
    setCode('');
    setTitle('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(10);
    setMinOrderValue(2000000);
    setMaxDiscount(500000);
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate('2026-12-31');
    setUsageLimit(100);
    setModalOpen(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) {
      showToast('Vui lòng điền mã và tiêu đề khuyến mãi', 'warning');
      return;
    }

    const currentList = hotelStore.getPromotions();
    const newPromo: Promotion = {
      id: Date.now(),
      code: code.trim().toUpperCase(),
      title: title.trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      maxDiscount: discountType === 'PERCENTAGE' ? Number(maxDiscount) : undefined,
      startDate,
      endDate,
      usageLimit: Number(usageLimit),
      usedCount: 0,
      active: true,
    };

    currentList.unshift(newPromo);
    localStorage.setItem('auragrand_promotions_v1', JSON.stringify(currentList));

    showToast(`Đã tạo mã khuyến mãi ${newPromo.code} thành công!`, 'success');
    setModalOpen(false);
    onRefresh();
  };

  const handleToggleStatus = (promoId: number) => {
    const list = hotelStore.getPromotions();
    const p = list.find(item => item.id === promoId);
    if (p) {
      p.active = !p.active;
      localStorage.setItem('auragrand_promotions_v1', JSON.stringify(list));
      showToast(`Đã ${p.active ? 'kích hoạt' : 'tạm ngưng'} mã ${p.code}`, 'info');
      onRefresh();
    }
  };

  const handleDeletePromo = (promoId: number, promoCode: string) => {
    hotelStore.deletePromotion(promoId);
    showToast(`Đã xóa vĩnh viễn mã giảm giá ${promoCode}!`, 'success');
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
            Quản Lý Khuyến Mãi & Voucher (Promotions)
          </h2>
          <p className="text-xs text-[#64748B]">
            Tạo mã coupon giảm giá % hoặc số tiền cố định, giới hạn lượt dùng và thời gian áp dụng
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#EAB308]" />
          <span>Tạo mã giảm giá mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((p) => {
          const isExpired = new Date().toISOString().slice(0, 10) > p.endDate;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                isExpired ? 'border-red-200 bg-red-50/20' : 'border-[#E2E8F0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold tracking-wider px-3 py-1 bg-amber-50 text-[#B45309] border border-amber-200 rounded-lg">
                      {p.code}
                    </span>
                    {isExpired && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                        HẾT HẠN
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(p.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.active ? 'KÍCH HOẠT' : 'TẠM TẮT'}
                    </button>
                    <button
                      onClick={() => handleDeletePromo(p.id, p.code)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Xóa mã giảm giá này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#0F172A] mb-1">{p.title}</h3>
                <p className="text-xs text-[#64748B] mb-3">
                  {p.discountType === 'PERCENTAGE'
                    ? `Giảm ${p.discountValue}% (tối đa ${(p.maxDiscount || 0).toLocaleString('vi-VN')}đ)`
                    : `Giảm ${(p.discountValue).toLocaleString('vi-VN')}đ`}
                </p>

                <div className="text-[11px] text-[#64748B] space-y-1">
                  <div>Đơn tối thiểu: <strong>{p.minOrderValue.toLocaleString('vi-VN')} đ</strong></div>
                  <div>Hiệu lực: {p.startDate} → {p.endDate}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] mt-4 flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">
                  Đã dùng {p.usedCount} / {p.usageLimit} lượt
                </span>
                <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#D4AF37] h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (p.usedCount / p.usageLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] my-8 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-luxury text-xl font-bold text-[#0F172A] mb-1">
              Thêm Mã Giảm Giá Mới
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Mã sẽ có hiệu lực trực tiếp trên hệ thống đặt phòng trực tuyến
            </p>

            <form onSubmit={handleSavePromo} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Mã code (Voucher Code) *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: AUTUMN20"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full uppercase px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Tiêu đề chương trình *
                </label>
                <input
                  type="text"
                  placeholder="VD: Tri ân mùa thu - Giảm ngay 20%"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    {discountType === 'PERCENTAGE' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VNĐ)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Tạo mã khuyến mãi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
