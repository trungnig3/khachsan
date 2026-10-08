import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Building,
  Bed,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Room, RoomStatus, RoomType } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface RoomManagementProps {
  rooms: Room[];
  roomTypes: RoomType[];
  onRefresh: () => void;
  onPreviewRoom?: (room: Room) => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({
  rooms,
  roomTypes,
  onRefresh,
  onPreviewRoom,
}) => {
  const { showToast } = useToast();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterFloor, setFilterFloor] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);

  // Form Fields
  const [roomNumber, setRoomNumber] = useState('');
  const [roomTypeId, setRoomTypeId] = useState<number>(1);
  const [floor, setFloor] = useState<number>(1);
  const [pricePerNight, setPricePerNight] = useState<number>(2000000);
  const [status, setStatus] = useState<RoomStatus>('AVAILABLE');
  const [cleanliness, setCleanliness] = useState<'CLEAN' | 'DIRTY' | 'INSPECTED'>('CLEAN');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingRoom(null);
    setRoomNumber('');
    setRoomTypeId(roomTypes[0]?.id || 1);
    setFloor(1);
    setPricePerNight(roomTypes[0]?.basePrice || 2000000);
    setStatus('AVAILABLE');
    setCleanliness('CLEAN');
    setDescription('');
    setImageUrl('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber);
    setRoomTypeId(room.roomTypeId);
    setFloor(room.floor);
    setPricePerNight(room.pricePerNight);
    setStatus(room.status);
    setCleanliness(room.cleanliness);
    setDescription(room.description);
    setImageUrl(room.imageUrl);
    setModalOpen(true);
  };

  // Delete Room
  const handleDeleteRoom = (room: Room) => {
    if (room.status === 'OCCUPIED') {
      showToast(`Không thể xóa phòng ${room.roomNumber} vì đang có khách lưu trú!`, 'error');
      return;
    }
    if (window.confirm(`Xác nhận xóa vĩnh viễn phòng ${room.roomNumber}? Thao tác không thể hoàn tác.`)) {
      hotelStore.deleteRoom(room.id);
      showToast(`Đã xóa phòng ${room.roomNumber} thành công`, 'info');
      onRefresh();
    }
  };

  // Quick Change Status
  const handleQuickStatusChange = (roomId: number, newStatus: RoomStatus) => {
    hotelStore.updateRoomStatus(roomId, newStatus);
    showToast(`Đã cập nhật trạng thái phòng sang ${newStatus}`, 'success');
    onRefresh();
  };

  // Save Room
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      showToast('Vui lòng nhập số hiệu phòng', 'warning');
      return;
    }

    const typeObj = roomTypes.find(t => t.id === Number(roomTypeId));

    hotelStore.saveRoom({
      id: editingRoom?.id,
      roomNumber: roomNumber.trim(),
      roomTypeId: Number(roomTypeId),
      roomTypeName: typeObj?.name,
      floor: Number(floor),
      pricePerNight: Number(pricePerNight),
      status,
      cleanliness,
      description: description.trim(),
      imageUrl: imageUrl.trim() || typeObj?.imageUrl,
      images: [imageUrl.trim() || typeObj?.imageUrl || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    });

    showToast(editingRoom ? 'Đã cập nhật thông tin phòng!' : 'Đã thêm phòng mới thành công!', 'success');
    setModalOpen(false);
    onRefresh();
  };

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchNum = r.roomNumber.toLowerCase().includes(term);
        const matchName = (r.roomTypeName || '').toLowerCase().includes(term);
        if (!matchNum && !matchName) return false;
      }
      if (filterType !== 'ALL' && r.roomTypeId !== Number(filterType)) return false;
      if (filterFloor !== 'ALL' && r.floor !== Number(filterFloor)) return false;
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      return true;
    });
  }, [rooms, searchTerm, filterType, filterFloor, filterStatus]);

  // Paginated rooms
  const totalPages = Math.ceil(filteredRooms.length / pageSize) || 1;
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRooms.slice(start, start + pageSize);
  }, [filteredRooms, currentPage, pageSize]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
            Quản Lý Danh Sách Phòng Nghỉ
          </h2>
          <p className="text-xs text-[#64748B]">
            Thêm, sửa, đổi trạng thái và giám sát sơ đồ buồng phòng toàn bộ khách sạn
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#EAB308]" />
          <span>Thêm phòng mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo số phòng (101, 202...), tên hạng phòng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium text-[#334155] focus:outline-none"
          >
            <option value="ALL">Tất cả loại phòng</option>
            {roomTypes.map((t) => (
              <option key={t.id} value={t.id.toString()}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={filterFloor}
            onChange={(e) => {
              setFilterFloor(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium text-[#334155] focus:outline-none"
          >
            <option value="ALL">Tất cả các tầng</option>
            <option value="1">Tầng 1 (Trệt & Villa)</option>
            <option value="2">Tầng 2</option>
            <option value="3">Tầng 3</option>
            <option value="4">Tầng 4</option>
            <option value="5">Tầng 5 (Penthouse VIP)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium text-[#334155] focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="AVAILABLE">AVAILABLE (Đang trống)</option>
            <option value="OCCUPIED">OCCUPIED (Có khách)</option>
            <option value="RESERVED">RESERVED (Đã đặt)</option>
            <option value="MAINTENANCE">MAINTENANCE (Bảo trì)</option>
            <option value="CLEANING">CLEANING (Dọn buồng)</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
              <tr>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Phòng</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Hạng phòng</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Tầng</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px] text-right">Giá / đêm</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Trạng thái</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px]">Vệ sinh</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[10px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {paginatedRooms.map((room) => (
                <tr key={room.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={room.imageUrl}
                        alt={`Phòng ${room.roomNumber}`}
                        className="w-10 h-10 rounded-lg object-cover border border-[#CBD5E1] shrink-0"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#0F172A] block font-mono tabular-nums">
                          {room.roomNumber}
                        </span>
                        <span className="text-[10px] text-[#64748B] block truncate max-w-[120px]">
                          {room.description || 'Tiêu chuẩn 5 sao'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-[#0F172A] block">{room.roomTypeName}</span>
                    <span className="text-[10px] text-[#64748B]">ID loại: #{room.roomTypeId}</span>
                  </td>

                  <td className="py-3.5 px-6 font-mono tabular-nums text-[#334155]">
                    Tầng {room.floor}
                  </td>

                  <td className="py-3.5 px-6 text-right font-mono font-bold text-[#0F172A] tabular-nums">
                    {room.pricePerNight.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3.5 px-6">
                    <select
                      value={room.status}
                      onChange={(e) => handleQuickStatusChange(room.id, e.target.value as RoomStatus)}
                      className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                        room.status === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : room.status === 'OCCUPIED'
                          ? 'bg-amber-50 text-[#B45309] border-amber-300'
                          : room.status === 'RESERVED'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : room.status === 'CLEANING'
                          ? 'bg-sky-50 text-sky-700 border-sky-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <option value="AVAILABLE">AVAILABLE (Trống)</option>
                      <option value="OCCUPIED">OCCUPIED (Đang ở)</option>
                      <option value="RESERVED">RESERVED (Đã đặt)</option>
                      <option value="CLEANING">CLEANING (Dọn buồng)</option>
                      <option value="MAINTENANCE">MAINTENANCE (Bảo trì)</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-6">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        room.cleanliness === 'CLEAN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : room.cleanliness === 'INSPECTED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {room.cleanliness === 'CLEAN'
                        ? 'Đã dọn sạch'
                        : room.cleanliness === 'INSPECTED'
                        ? 'Đã nghiệm thu'
                        : 'Chưa dọn'}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onPreviewRoom && (
                        <button
                          onClick={() => onPreviewRoom(room)}
                          className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(room)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                        title="Chỉnh sửa phòng"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Xóa phòng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <span>
            Hiển thị <strong>{paginatedRooms.length}</strong> trên tổng số <strong>{filteredRooms.length}</strong> phòng
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#CBD5E1] disabled:opacity-40 hover:bg-[#F8FAFC] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-[#0F172A]">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#CBD5E1] disabled:opacity-40 hover:bg-[#F8FAFC] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
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
              {editingRoom ? `Chỉnh Sửa Phòng ${editingRoom.roomNumber}` : 'Thêm Phòng Nghỉ Mới'}
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Điền thông tin mã phòng, tầng, hạng phòng và mức giá niêm yết
            </p>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Số phòng (Room Number) *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 101, 205, V-03..."
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Vị trí tầng *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Hạng phòng *
                  </label>
                  <select
                    value={roomTypeId}
                    onChange={(e) => {
                      const tId = Number(e.target.value);
                      setRoomTypeId(tId);
                      const t = roomTypes.find(item => item.id === tId);
                      if (t) setPricePerNight(t.basePrice);
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  >
                    {roomTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#475569]">
                      Giá niêm yết (VNĐ / đêm) *
                    </label>
                    <span className="font-mono text-xs font-bold text-[#D4AF37]">
                      {pricePerNight > 0 ? `${pricePerNight.toLocaleString('vi-VN')} đ` : '0 đ'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(Math.max(0, Number(e.target.value)))}
                    required
                    placeholder="Nhập giá phòng (ví dụ: 50000 cho 50k)"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[11px] text-[#64748B]">Chọn nhanh:</span>
                    <button
                      type="button"
                      onClick={() => setPricePerNight(50000)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        pricePerNight === 50000 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      }`}
                    >
                      50k (50.000đ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricePerNight(200000)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        pricePerNight === 200000 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      }`}
                    >
                      200k
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricePerNight(500000)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        pricePerNight === 500000 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      }`}
                    >
                      500k
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricePerNight(1500000)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        pricePerNight === 1500000 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      }`}
                    >
                      1.5M
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricePerNight(2500000)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        pricePerNight === 2500000 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      }`}
                    >
                      2.5M
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Trạng thái vận hành *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RoomStatus)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  >
                    <option value="AVAILABLE">AVAILABLE (Đang trống)</option>
                    <option value="OCCUPIED">OCCUPIED (Có khách)</option>
                    <option value="RESERVED">RESERVED (Đã đặt trước)</option>
                    <option value="CLEANING">CLEANING (Đang dọn)</option>
                    <option value="MAINTENANCE">MAINTENANCE (Bảo trì)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Tình trạng vệ sinh buồng
                  </label>
                  <select
                    value={cleanliness}
                    onChange={(e) => setCleanliness(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  >
                    <option value="CLEAN">CLEAN (Đã dọn sạch)</option>
                    <option value="INSPECTED">INSPECTED (Đã kiểm tra)</option>
                    <option value="DIRTY">DIRTY (Chưa dọn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Đường dẫn ảnh đại diện (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Ghi chú & Mô tả phòng
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả đặc điểm ban công, hướng view, bồn tắm..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
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
                  Lưu phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
