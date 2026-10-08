import React, { useState } from 'react';
import {
  Users,
  Shield,
  Crown,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Calendar,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { Role, User } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface UserManagementProps {
  currentUser: User;
  onRefresh?: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  onRefresh,
}) => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(() => hotelStore.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal create/edit user
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('ROLE_STAFF');
  const [password, setPassword] = useState('123456');

  const refreshList = () => {
    setUsers(hotelStore.getUsers());
    onRefresh?.();
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setRole('ROLE_STAFF');
    setPassword('123456');
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
    setModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      showToast('Vui lòng điền đầy đủ họ tên và email', 'warning');
      return;
    }

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '0901234567',
        role,
      };
      hotelStore.saveUser(updated);
      showToast(`Đã cập nhật thông tin tài khoản ${updated.fullName}`, 'success');
    } else {
      const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        showToast('Email này đã được đăng ký trong hệ thống!', 'error');
        return;
      }
      const newUser: User = {
        id: Date.now(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '0901234567',
        role,
        avatar: role === 'ROLE_ADMIN'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
          : role === 'ROLE_STAFF'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      hotelStore.saveUser(newUser);
      showToast(`Đã tạo thành công tài khoản ${newUser.fullName} (${newUser.role})!`, 'success');
    }

    setModalOpen(false);
    refreshList();
  };

  const handleChangeRole = (userId: number, newRole: Role) => {
    if (userId === 1 && newRole !== 'ROLE_ADMIN') {
      showToast('Không thể hạ quyền Tổng Giám Đốc quản trị chính!', 'warning');
      return;
    }
    hotelStore.updateUserRole(userId, newRole);
    refreshList();
    showToast('Đã cập nhật phân quyền tài khoản thành công!', 'success');
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    if (userId === 1) {
      showToast('Không thể xóa tài khoản Quản trị viên cao cấp của hệ thống!', 'error');
      return;
    }
    if (window.confirm(`Quý khách có chắc chắn muốn xóa tài khoản "${userName}"?`)) {
      hotelStore.deleteUser(userId);
      refreshList();
      showToast(`Đã xóa tài khoản "${userName}"`, 'info');
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter((u) => u.role === 'ROLE_ADMIN').length;
  const staffCount = users.filter((u) => u.role === 'ROLE_STAFF').length;
  const customerCount = users.filter((u) => u.role === 'ROLE_CUSTOMER').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-luxury text-xl sm:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#D4AF37]" />
            <span>Quản Lý Người Dùng & Phân Quyền (RBAC)</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Phân bổ quyền hạn truy cập giữa <strong>Tổng Quản Lý (Admin)</strong>, <strong>Nhân Viên Lễ Tân (Staff)</strong> và <strong>Khách Hàng (Customer)</strong>
          </p>
        </div>

        {currentUser.role === 'ROLE_ADMIN' && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-center"
          >
            <UserPlus className="w-4 h-4 text-[#D4AF37]" />
            <span>Thêm tài khoản mới</span>
          </button>
        )}
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Admin Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0F172A]">ROLE_ADMIN</h4>
                <span className="text-[10px] text-amber-800 font-semibold">Tổng Giám Đốc / Ban Quản Lý</span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-amber-800">{adminCount}</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Toàn quyền hệ thống: Cấu hình giá phòng, quản lý doanh thu hóa đơn, duyệt voucher, phân quyền người dùng và kiểm soát toàn bộ cơ sở dữ liệu.
          </p>
        </div>

        {/* Staff Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0F172A]">ROLE_STAFF</h4>
                <span className="text-[10px] text-blue-800 font-semibold">Nhân Viên Lễ Tân & Buồng Phòng</span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-blue-800">{staffCount}</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Nghiệp vụ vận hành: Quầy lễ tân check-in / check-out, tiếp đón khách, cập nhật tình trạng dọn dẹp buồng phòng, gọi dịch vụ phòng và in hóa đơn thanh toán.
          </p>
        </div>

        {/* Customer Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0F172A]">ROLE_CUSTOMER</h4>
                <span className="text-[10px] text-emerald-800 font-semibold">Khách Hàng Thành Viên</span>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-emerald-800">{customerCount}</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Cổng người dùng: Tự đăng ký tài khoản, tìm kiếm phòng, đặt phòng nghỉ, nhận voucher ưu đãi đặc quyền, sử dụng dịch vụ và gửi đánh giá trải nghiệm.
          </p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#64748B]" />
          <span className="text-xs text-[#64748B] whitespace-nowrap">Lọc vai trò:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#0F172A]"
          >
            <option value="ALL">Tất cả ({users.length})</option>
            <option value="ROLE_ADMIN">Quản Trị Viên ({adminCount})</option>
            <option value="ROLE_STAFF">Nhân Viên ({staffCount})</option>
            <option value="ROLE_CUSTOMER">Khách Hàng ({customerCount})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tài khoản & Người dùng</th>
                <th className="py-3.5 px-4">Số điện thoại</th>
                <th className="py-3.5 px-4">Vai trò hiện tại</th>
                <th className="py-3.5 px-4">Ngày đăng ký</th>
                <th className="py-3.5 px-4 text-center">Phân quyền trực tiếp</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#94A3B8]">
                    Không tìm thấy tài khoản nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'ROLE_ADMIN';
                  const isStaff = u.role === 'ROLE_STAFF';
                  const isCustomer = u.role === 'ROLE_CUSTOMER';

                  return (
                    <tr key={u.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0]"
                          />
                          <div>
                            <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {u.id === currentUser.id && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#94A3B8]" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[#0F172A] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#94A3B8]" />
                          <span>{u.phone || 'Chưa cập nhật'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isAdmin
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : isStaff
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isAdmin && <Crown className="w-3 h-3 text-purple-700" />}
                          {isStaff && <ShieldCheck className="w-3 h-3 text-blue-700" />}
                          {isCustomer && <UserCheck className="w-3 h-3 text-emerald-700" />}
                          <span>
                            {isAdmin ? 'Quản Trị Viên' : isStaff ? 'Nhân Viên Lễ Tân' : 'Khách Hàng'}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px]">
                        {u.createdAt}
                      </td>

                      {/* Direct Role Switching Dropdown */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value as Role)}
                          disabled={currentUser.role !== 'ROLE_ADMIN' || u.id === 1}
                          className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold focus:outline-none focus:border-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <option value="ROLE_ADMIN">Quản Trị (Admin)</option>
                          <option value="ROLE_STAFF">Nhân Viên (Staff)</option>
                          <option value="ROLE_CUSTOMER">Khách Hàng (Customer)</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {u.id !== 1 && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.fullName)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-sm">
                  {editingUser ? 'Chỉnh Sửa Thông Tin Tài Khoản' : 'Tạo Tài Khoản Người Dùng Mới'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Địa chỉ Email đăng nhập *
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@auragrand.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Phân quyền vai trò (Role) *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A] font-semibold"
                >
                  <option value="ROLE_STAFF">ROLE_STAFF - Nhân Viên Lễ Tân & Buồng Phòng</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN - Quản Trị Viên (Toàn quyền)</option>
                  <option value="ROLE_CUSTOMER">ROLE_CUSTOMER - Khách Hàng Thành Viên</option>
                </select>
                <p className="text-[10px] text-[#94A3B8] mt-1">
                  ROLE_STAFF có quyền quản lý lễ tân check-in, buồng phòng và hóa đơn; ROLE_ADMIN có thêm quyền cấu hình giá, voucher và người dùng.
                </p>
              </div>

              {!editingUser && (
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Mật khẩu khởi tạo
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                  <span className="text-[10px] text-[#94A3B8] mt-1 block">Mặc định: 123456</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#CBD5E1] text-[#475569] font-semibold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  {editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
