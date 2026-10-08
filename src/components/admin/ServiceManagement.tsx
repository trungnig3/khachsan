import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, Sparkles, X, Coffee, Car, Shirt, Utensils } from 'lucide-react';
import { HotelService } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface ServiceManagementProps {
  services: HotelService[];
  onRefresh: () => void;
}

export const ServiceManagement: React.FC<ServiceManagementProps> = ({
  services,
  onRefresh,
}) => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<HotelService | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<HotelService['category']>('DINING');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(300000);
  const [unit, setUnit] = useState('người');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setCategory('DINING');
    setDescription('');
    setPrice(350000);
    setUnit('người');
    setImageUrl('https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80');
    setAvailable(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: HotelService) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setDescription(s.description);
    setPrice(s.price);
    setUnit(s.unit);
    setImageUrl(s.imageUrl);
    setAvailable(s.available);
    setModalOpen(true);
  };

  const handleDeleteService = (s: HotelService) => {
    if (window.confirm(`Xác nhận xóa dịch vụ "${s.name}"?`)) {
      hotelStore.deleteService(s.id);
      showToast(`Đã xóa dịch vụ ${s.name}`, 'info');
      onRefresh();
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập tên dịch vụ', 'warning');
      return;
    }

    hotelStore.saveService({
      id: editingService ? editingService.id : Date.now(),
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      unit: unit.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
      available,
    });

    showToast(editingService ? 'Đã cập nhật dịch vụ!' : 'Đã thêm dịch vụ mới!', 'success');
    setModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
            Quản Lý Dịch Vụ Khách Sạn (Hotel Services)
          </h2>
          <p className="text-xs text-[#64748B]">
            Thiết lập bảng giá các dịch vụ ẩm thực, spa, xe đưa đón và giặt ủi
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#EAB308]" />
          <span>Thêm dịch vụ mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  {s.category}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {s.available ? 'Đang phục vụ' : 'Tạm dừng'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-luxury text-base font-bold text-[#0F172A] mb-1">
                  {s.name}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                  {s.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-[#94A3B8] font-semibold block">Đơn giá:</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-base font-bold text-[#0F172A] tabular-nums">
                    {s.price.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs text-[#64748B]">đ / {s.unit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                  title="Sửa dịch vụ"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(s)}
                  className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Xóa dịch vụ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
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
              {editingService ? `Sửa Dịch Vụ: ${editingService.name}` : 'Thêm Dịch Vụ Mới'}
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Cung cấp chi tiết tên dịch vụ, phân loại và giá niêm yết
            </p>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  placeholder="VD: Trị Liệu Lotus Spa Đá Nóng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Danh mục phân loại *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  >
                    <option value="DINING">DINING (Ẩm thực & Nhà hàng)</option>
                    <option value="WELLNESS">WELLNESS (Spa & Chăm sóc)</option>
                    <option value="TRANSPORT">TRANSPORT (Xe đưa đón VIP)</option>
                    <option value="LAUNDRY">LAUNDRY (Giặt ủi & Hấp)</option>
                    <option value="CONCIERGE">CONCIERGE (Quản gia & Tour)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Đơn vị tính *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: lượt, người, chuyến, kg..."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Đơn giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0F172A] focus:ring-0"
                    />
                    <span className="font-semibold text-[#334155]">Đang kích hoạt phục vụ</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Đường dẫn ảnh minh họa (URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Mô tả dịch vụ
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
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
                  Lưu dịch vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
