import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { User } from '../../types/hotel';
import { DEMO_USERS, hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  redirectTarget?: 'customer' | 'admin' | 'my-bookings';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  redirectTarget,
}) => {
  const { showToast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('123456');

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
    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === cleanEmail);

    if (foundUser) {
      handleSelectDemoUser(foundUser);
    } else {
      // Create guest customer user if unrecognized
      const newUser: User = {
        id: Date.now(),
        email: cleanEmail || 'guest@auragrand.vn',
        fullName: cleanEmail.split('@')[0] || 'Khách Hàng',
        phone: '0901234567',
        role: 'ROLE_CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      handleSelectDemoUser(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E2E8F0] overflow-hidden relative animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-6 sm:p-7 relative">
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
          <h2 className="text-xl font-bold text-white">Đăng Nhập Tài Khoản</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Chọn một tài khoản mẫu để trải nghiệm đầy đủ các phân quyền hệ thống
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Quick 1-Click Demo Accounts */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-2.5">
              1. Đăng nhập nhanh 1-chạm (Demo Roles)
            </span>

            <div className="space-y-2.5">
              {/* Admin Card */}
              <button
                type="button"
                onClick={() => handleSelectDemoUser(DEMO_USERS[0])}
                className="w-full text-left p-3.5 rounded-2xl border border-[#E2E8F0] hover:border-[#D4AF37] hover:bg-amber-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#0F172A] truncate">
                        {DEMO_USERS[0].fullName}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                        ADMIN
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block truncate">
                      {DEMO_USERS[0].email}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Staff Card */}
              <button
                type="button"
                onClick={() => handleSelectDemoUser(DEMO_USERS[1])}
                className="w-full text-left p-3.5 rounded-2xl border border-[#E2E8F0] hover:border-[#D4AF37] hover:bg-blue-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#0F172A] truncate">
                        {DEMO_USERS[1].fullName}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        STAFF
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block truncate">
                      {DEMO_USERS[1].email}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Customer Card */}
              <button
                type="button"
                onClick={() => handleSelectDemoUser(DEMO_USERS[2])}
                className="w-full text-left p-3.5 rounded-2xl border border-[#E2E8F0] hover:border-[#D4AF37] hover:bg-emerald-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#0F172A] truncate">
                        {DEMO_USERS[2].fullName}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        CUSTOMER
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block truncate">
                      {DEMO_USERS[2].email}
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
              Hoặc đăng nhập bằng Email
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
                  placeholder="admin@auragrand.vn hoặc email của bạn"
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
          </form>
        </div>
      </div>
    </div>
  );
};
