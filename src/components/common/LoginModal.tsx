import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  ShieldCheck,
  UserCheck,
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UserPlus,
  Phone,
  User as UserIcon,
  ShieldAlert,
  Gift
} from 'lucide-react';
import { User } from '../../types/hotel';
import { DEMO_USERS, hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  redirectTarget?: 'customer' | 'admin' | 'my-bookings';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  redirectTarget,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);

  // Sync tab when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
    }
  }, [isOpen, initialMode]);

  // Login form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('123456');

  // Register form states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen) return null;

  const handleSelectDemoUser = (user: User) => {
    hotelStore.setCurrentUser(user);
    onLoginSuccess(user);
    showToast(`Đăng nhập thành công với tài khoản ${user.fullName} (${user.role})!`, 'success');
    onClose();
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Vui lòng nhập địa chỉ email', 'warning');
      return;
    }

    const allUsers = hotelStore.getUsers();
    const foundUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail) ||
      DEMO_USERS.find(u => u.email.toLowerCase() === cleanEmail);

    if (foundUser) {
      handleSelectDemoUser(foundUser);
    } else {
      // Auto-register as Customer if email not found
      const result = hotelStore.registerCustomer({
        fullName: cleanEmail.split('@')[0] || 'Khách Hàng',
        email: cleanEmail,
        phone: '0901234567',
        password: passwordInput,
      });
      if (result.user) {
        onLoginSuccess(result.user);
        showToast(`Đăng nhập thành công! Đã tạo tài khoản khách hàng mới cho ${result.user.email}`, 'success');
        onClose();
      }
    }
  };

  const handleFormRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regFullName.trim()) {
      showToast('Vui lòng nhập họ và tên của quý khách', 'warning');
      return;
    }
    if (!regEmail.trim()) {
      showToast('Vui lòng nhập địa chỉ email hợp lệ', 'warning');
      return;
    }
    if (!regPhone.trim()) {
      showToast('Vui lòng nhập số điện thoại liên hệ', 'warning');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Mật khẩu cần tối thiểu 6 ký tự', 'warning');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Vui lòng đồng ý với điều khoản thành viên Aura Grand', 'warning');
      return;
    }

    const result = hotelStore.registerCustomer({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
    });

    if (!result.success || !result.user) {
      showToast(result.error || 'Đăng ký không thành công', 'error');
      return;
    }

    showToast(`Chào mừng ${result.user.fullName}! Đăng ký thành viên Khách Hàng thành công.`, 'success');
    onLoginSuccess(result.user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E2E8F0] overflow-hidden relative animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#0F172A]" />
            </div>
            <span className="font-luxury text-lg font-bold tracking-widest text-[#F8FAFC]">
              AURA GRAND
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {activeTab === 'login' ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Thành Viên Khách Hàng'}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            {activeTab === 'login'
              ? 'Đăng nhập để đặt phòng, quản lý dịch vụ và phân quyền hệ thống'
              : 'Tạo tài khoản khách hàng để nhận ưu đãi đặc quyền và quản lý đặt phòng'}
          </p>

          {/* Tab Switcher in Header */}
          <div className="flex items-center gap-2 mt-4 bg-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-[#0F172A] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-[#D4AF37] text-[#0F172A] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng Ký Khách Hàng</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Login Content */}
        {activeTab === 'login' && (
          <div className="p-6 sm:p-7 space-y-6">
            {/* Quick 1-Click Demo Accounts with RBAC descriptions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  1. Đăng nhập nhanh theo phân quyền
                </span>
                <span className="text-[10px] text-[#D4AF37] font-semibold">1-Chạm</span>
              </div>

              <div className="space-y-2.5">
                {/* Admin Card */}
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(DEMO_USERS[0])}
                  className="w-full text-left p-3 rounded-2xl border border-[#E2E8F0] hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#0F172A] truncate">
                          {DEMO_USERS[0].fullName}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                          ADMIN
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        Toàn quyền Quản Trị Khách Sạn (Bảng giá, Doanh thu, User)
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* Staff Card */}
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(DEMO_USERS[1])}
                  className="w-full text-left p-3 rounded-2xl border border-[#E2E8F0] hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#0F172A] truncate">
                          {DEMO_USERS[1].fullName}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                          STAFF
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        Nhân Viên Lễ Tân & Vận Hành (Check-in/out, Dọn phòng)
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* Customer Card */}
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(DEMO_USERS[2])}
                  className="w-full text-left p-3 rounded-2xl border border-[#E2E8F0] hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#0F172A] truncate">
                          {DEMO_USERS[2].fullName}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          CUSTOMER
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        Khách Hàng (Đặt phòng, Xem hóa đơn, Đánh giá dịch vụ)
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <span className="w-full border-t border-[#E2E8F0]" />
              <span className="absolute bg-white px-3 text-[10px] uppercase font-semibold text-[#94A3B8]">
                2. Hoặc đăng nhập tài khoản riêng
              </span>
            </div>

            {/* Form Login */}
            <form onSubmit={handleFormLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="admin@auragrand.vn, staff@... hoặc email cá nhân"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4 text-[#EAB308]" />
                <span>Đăng nhập ngay</span>
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#64748B]">Chưa có tài khoản khách hàng? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-[11px] font-bold text-[#B45309] hover:underline cursor-pointer"
                >
                  Đăng ký miễn phí ngay
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Register for Customer Content */}
        {activeTab === 'register' && (
          <div className="p-6 sm:p-7 space-y-4">
            {/* VIP Welcome badge */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B45309] text-slate-900 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#0F172A] block">Đặc Quyền Thành Viên Mới</span>
                <span className="text-[11px] text-[#64748B]">
                  Nhận ngay Voucher giảm 15% cho lần đặt phòng đầu tiên và tích lũy điểm VIP.
                </span>
              </div>
            </div>

            <form onSubmit={handleFormRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Họ và tên quý khách *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Địa chỉ Email đăng ký *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="email@vidu.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Số điện thoại di động *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="0901234567"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">
                    Xác nhận mật khẩu *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#D4AF37] focus:ring-0 accent-[#0F172A]"
                  />
                  <span className="text-[11px] text-[#64748B] leading-snug">
                    Tôi đồng ý với chính sách lưu trú và điều khoản thành viên khách hàng tại Aura Grand.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-[#EAB308] to-[#B45309] text-slate-900 font-bold rounded-xl shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <UserPlus className="w-4 h-4 text-slate-900" />
                <span>Hoàn tất đăng ký & Đăng nhập</span>
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#64748B]">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[11px] font-bold text-[#0F172A] hover:underline cursor-pointer"
                >
                  Đăng nhập tại đây
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

