import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, Sparkles, X, Bed, Maximize2, Users } from 'lucide-react';
import { RoomType } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface RoomTypeManagementProps {
  roomTypes: RoomType[];
  onRefresh: () => void;
}

export const RoomTypeManagement: React.FC<RoomTypeManagementProps> = ({
  roomTypes,
  onRefresh,
}) => {
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);

  // Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(2000000);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [area, setArea] = useState<number>(40);
  const [bedType, setBedType] = useState('1 Giường King (2m x 2m)');
  const [amenitiesStr, setAmenitiesStr] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleOpenAdd = () => {
    setEditingType(null);
    setName('');
    setCode('');
    setDescription('');
    setBasePrice(2500000);
    setMaxGuests(2);
    setArea(45);
    setBedType('1 Giường King (2m x 2m)');
    setAmenitiesStr('Ban công hướng biển, Smart TV 55 inch, Bồn tắm nằm cẩm thạch, Wifi tốc độ cao');
    setImageUrl('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80');
    setModalOpen(true);
  };

  const handleOpenEdit = (type: RoomType) => {
    setEditingType(type);
    setName(type.name);
    setCode(type.code);
    setDescription(type.description);
    setBasePrice(type.basePrice);
    setMaxGuests(type.maxGuests);
    setArea(type.area);
    setBedType(type.bedType);
    setAmenitiesStr((type.amenities || []).join(', '));
    setImageUrl(type.imageUrl);
    setModalOpen(true);
  };

  const handleDeleteType = (type: RoomType) => {
    const roomsOfThisType = hotelStore.getRooms().filter(r => r.roomTypeId === type.id);
    if (roomsOfThisType.length > 0) {
      showToast(`Không thể xóa loại phòng ${type.name} vì đang có ${roomsOfThisType.length} phòng trực thuộc!`, 'error');
      return;
    }

    if (window.confirm(`Xác nhận xóa loại phòng "${type.name}"?`)) {
      hotelStore.deleteRoomType(type.id);
      showToast(`Đã xóa loại phòng ${type.name}`, 'info');
      onRefresh();
    }
  };

  const handleSaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      showToast('Vui lòng nhập tên và mã loại phòng', 'warning');
      return;
    }

    const amenitiesList = amenitiesStr.split(',').map(s => s.trim()).filter(Boolean);

    hotelStore.saveRoomType({
      id: editingType ? editingType.id : Date.now(),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      basePrice: Number(basePrice),
      maxGuests: Number(maxGuests),
      area: Number(area),
      bedType: bedType.trim(),
      amenities: amenitiesList,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    });

    showToast(editingType ? 'Đã cập nhật loại phòng!' : 'Đã tạo loại phòng mới!', 'success');
    setModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
            Quản Lý Danh Mục Loại Phòng (Room Types)
          </h2>
          <p className="text-xs text-[#64748B]">
            Cấu hình đơn giá gốc, diện tích, sức chứa tối đa và tiêu chuẩn tiện nghi phòng
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#EAB308]" />
          <span>Thêm loại phòng</span>
        </button>
      </div>

      {/* Grid of Room Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomTypes.map((type) => {
          const roomCount = hotelStore.getRooms().filter(r => r.roomTypeId === type.id).length;

          return (
            <div
              key={type.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                  <img
                    src={type.imageUrl}
                    alt={type.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0F172A]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider">
                    {type.code}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#0F172A] px-2.5 py-1 rounded-lg text-[11px] font-bold">
                    {roomCount} phòng thực tế
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-luxury text-lg font-bold text-[#0F172A] mb-1">
                    {type.name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                    {type.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center text-xs mb-4">
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Diện tích</span>
                      <span className="font-bold text-[#0F172A] font-mono">{type.area} m²</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Sức chứa</span>
                      <span className="font-bold text-[#0F172A]">{type.maxGuests} khách</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Giường</span>
                      <span className="font-bold text-[#0F172A] truncate block">{type.bedType.split(' ')[1] || 'King'}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#475569] space-y-1 mb-2">
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Tiện nghi chính:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {type.amenities?.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="bg-[#F1F5F9] px-2 py-0.5 rounded text-[10px] text-[#475569]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#94A3B8] font-semibold block">Giá cơ bản:</span>
                  <span className="font-mono text-base font-bold text-[#0F172A] tabular-nums">
                    {type.basePrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(type)}
                    className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                    title="Sửa loại phòng"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteType(type)}
                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                    title="Xóa loại phòng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] my-8 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-luxury text-xl font-bold text-[#0F172A] mb-1">
              {editingType ? `Sửa Loại Phòng: ${editingType.name}` : 'Thêm Loại Phòng Mới'}
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Cấu hình các thông số loại phòng hiển thị trên website và catalog đặt phòng
            </p>

            <form onSubmit={handleSaveType} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Tên loại phòng *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Deluxe Ocean View"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Mã loại (Code) *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: DLX-OCN"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl uppercase focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Giá gốc (VNĐ/đêm) *
                  </label>
                  <input
                    type="number"
                    min={500000}
                    step={100000}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Diện tích (m²)
                  </label>
                  <input
                    type="number"
                    min={15}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Số khách tối đa
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Quy cách giường
                </label>
                <input
                  type="text"
                  placeholder="1 Giường King (2m x 2m)"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Danh sách tiện ích (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Ban công, Bồn tắm nằm, Wifi, Smart TV..."
                  value={amenitiesStr}
                  onChange={(e) => setAmenitiesStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Đường dẫn ảnh đại diện (URL)
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
                  Mô tả không gian loại phòng
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
                  Lưu loại phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
