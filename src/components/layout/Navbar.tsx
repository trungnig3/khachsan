import React, { useState } from 'react';
import {
  ShieldCheck,
  User as UserIcon,
  Calendar,
  Crown,
  ChevronDown,
  LogOut,
  LogIn,
  LayoutDashboard,
  UserPlus,
  Menu,
  X,
  Utensils,
  Tag,
  Star,
  BedDouble,
  Cpu
} from 'lucide-react';
import { User } from '../../types/hotel';

interface NavbarProps {
  currentView: 'customer' | 'admin' | 'my-bookings';
  onViewChange: (view: 'customer' | 'admin' | 'my-bookings') => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  demoUsers: User[];
  onOpenBookingModal?: () => void;
  onOpenLoginModal?: () => void;
  onOpenRegisterModal?: () => void;
  onOpenSoaHub?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  currentUser,
  onUserChange,
  demoUsers,
  onOpenBookingModal,
  onOpenLoginModal,
  onOpenRegisterModal,
  onOpenSoaHub,
  onLogout,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSelect = (user: User) => {
    onUserChange(user);
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_STAFF') {
      onViewChange('admin');
    } else {
      onViewChange('customer');
    }
  };

  const handleLogoutClick = () => {
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
    onLogout?.();
  };

  // Seamless navigation handler that works from ANY page (including 'my-bookings' or 'admin')
  const handleNavigate = (target: 'rooms' | 'services' | 'promotions' | 'reviews' | 'home') => {
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
    if (currentView !== 'customer') {
      onViewChange('customer');
      setTimeout(() => {
        if (target === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 120);
    } else {
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#334155]/50 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={() => handleNavigate('home')}
            className="text-left group flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center shadow-lg shadow-amber-950/40">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-luxury text-xl font-bold tracking-widest text-[#F8FAFC] group-hover:text-[#EAB308] transition-colors block">
                AURA GRAND
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-medium block">
                Luxury Hotel & Resort
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Buttons that safely navigate and scroll) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#CBD5E1]">
          <button
            onClick={() => handleNavigate('rooms')}
            className={`transition-colors hover:text-[#EAB308] cursor-pointer ${
              currentView === 'customer' ? 'text-[#EAB308] font-semibold' : ''
            }`}
          >
            Trang chủ & Phòng
          </button>
          <button
            onClick={() => handleNavigate('services')}
            className="transition-colors hover:text-[#EAB308] cursor-pointer"
          >
            Dịch vụ & Spa
          </button>
          <button
            onClick={() => handleNavigate('promotions')}
            className="transition-colors hover:text-[#EAB308] cursor-pointer"
          >
            Ưu đãi đặc quyền
          </button>
          <button
            onClick={() => handleNavigate('reviews')}
            className="transition-colors hover:text-[#EAB308] cursor-pointer"
          >
            Đánh giá
          </button>
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenLoginModal?.();
              } else {
                onViewChange('my-bookings');
              }
            }}
            className={`transition-colors hover:text-[#EAB308] flex items-center gap-1.5 cursor-pointer ${
              currentView === 'my-bookings' ? 'text-[#EAB308] font-semibold' : ''
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Phòng đã đặt</span>
          </button>

          {/* SOA Service Hub Button */}
          {onOpenSoaHub && (
            <button
              onClick={onOpenSoaHub}
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Mở Trung tâm Dịch vụ SOA & Kiểm thử API"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>SOA Services</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-3">
          {/* Portal Switcher Button - Only for logged-in ADMIN or STAFF */}
          {currentUser && (currentUser.role === 'ROLE_ADMIN' || currentUser.role === 'ROLE_STAFF') && (
            <button
              onClick={() => onViewChange(currentView === 'admin' ? 'customer' : 'admin')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#475569] text-xs font-semibold text-[#E2E8F0] hover:bg-[#1E293B] hover:border-[#64748B] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#EAB308]" />
              <span className="hidden sm:inline">
                {currentView === 'admin' ? 'Chuyển sang Khách hàng' : 'Bảng Quản Trị (Admin)'}
              </span>
              <span className="sm:hidden">
                {currentView === 'admin' ? 'Khách' : 'Admin'}
              </span>
            </button>
          )}

          {/* User state: Logged in vs Logged out */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.fullName}
                  className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]"
                />
                <div className="text-left hidden md:block">
                  <span className="block text-[11px] font-semibold text-white truncate max-w-[120px]">
                    {currentUser.fullName}
                  </span>
                  <span className="block text-[9px] text-[#94A3B8]">
                    {currentUser.role === 'ROLE_ADMIN' ? 'Tổng Giám Đốc' : currentUser.role === 'ROLE_STAFF' ? 'Lễ Tân' : 'Khách Hàng'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              {/* Dropdown Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-[#334155] rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#1E293B] text-[#94A3B8]">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#64748B] block">
                      Đang đăng nhập:
                    </span>
                    <span className="text-white font-bold text-xs block truncate mt-0.5">
                      {currentUser.fullName} ({currentUser.email})
                    </span>
                    <span className="text-[10px] text-[#EAB308] font-semibold mt-0.5 block">
                      Vai trò: {currentUser.role === 'ROLE_ADMIN' ? 'Tổng Quản Lý (Admin)' : currentUser.role === 'ROLE_STAFF' ? 'Nhân Viên Lễ Tân (Staff)' : 'Khách Hàng (Customer)'}
                    </span>
                  </div>

                  {/* Navigation based on role */}
                  <div className="py-1 border-b border-[#1E293B] space-y-1">
                    {(currentUser.role === 'ROLE_ADMIN' || currentUser.role === 'ROLE_STAFF') ? (
                      <button
                        onClick={() => {
                          onViewChange('admin');
                          setShowRoleMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-amber-400 hover:bg-[#1E293B] transition-colors font-medium cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Mở Bảng Quản Trị Khách Sạn</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onViewChange('my-bookings');
                          setShowRoleMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] transition-colors font-medium cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Lịch sử đặt phòng của tôi</span>
                      </button>
                    )}
                  </div>

                  {/* Demo account switcher */}
                  <div className="px-3 pt-2 text-[10px] uppercase font-semibold tracking-wider text-[#64748B]">
                    Chuyển tài khoản mẫu:
                  </div>
                  <div className="space-y-1 py-1">
                    {demoUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleRoleSelect(u)}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          currentUser.id === u.id
                            ? 'bg-[#1E293B] text-[#EAB308] font-semibold'
                            : 'text-[#CBD5E1] hover:bg-[#1E293B]/60'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.fullName}
                          className="w-6 h-6 rounded-full object-cover border border-[#475569]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-white text-[11px]">{u.fullName}</div>
                          <div className="text-[9px] text-[#94A3B8]">
                            {u.role === 'ROLE_ADMIN' ? 'Admin' : u.role === 'ROLE_STAFF' ? 'Staff' : 'Customer'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* LOGOUT BUTTON */}
                  <div className="pt-2 border-t border-[#1E293B]">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors font-semibold cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Đăng xuất tài khoản</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-300">
                        Thoát
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated: Show Login and Register buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>Đăng nhập</span>
              </button>
              <button
                onClick={onOpenRegisterModal || onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B45309] text-slate-900 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-900" />
                <span>Đăng ký</span>
              </button>
            </div>
          )}

          {/* Book Now primary CTA */}
          {onOpenBookingModal && (
            <button
              onClick={onOpenBookingModal}
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
            >
              Đặt phòng
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1120] border-b border-[#334155] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 text-xs">
          <button
            onClick={() => handleNavigate('rooms')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800 text-white flex items-center gap-2.5 font-medium"
          >
            <BedDouble className="w-4 h-4 text-[#D4AF37]" />
            <span>Trang chủ & Danh mục phòng</span>
          </button>
          <button
            onClick={() => handleNavigate('services')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800 text-white flex items-center gap-2.5 font-medium"
          >
            <Utensils className="w-4 h-4 text-[#D4AF37]" />
            <span>Dịch vụ & Spa cao cấp</span>
          </button>
          <button
            onClick={() => handleNavigate('promotions')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800 text-white flex items-center gap-2.5 font-medium"
          >
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span>Ưu đãi đặc quyền & Voucher</span>
          </button>
          <button
            onClick={() => handleNavigate('reviews')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800 text-white flex items-center gap-2.5 font-medium"
          >
            <Star className="w-4 h-4 text-[#D4AF37]" />
            <span>Đánh giá từ du khách</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (!currentUser) {
                onOpenLoginModal?.();
              } else {
                onViewChange('my-bookings');
              }
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800 text-white flex items-center gap-2.5 font-medium"
          >
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Lịch sử phòng đã đặt</span>
          </button>
          {onOpenSoaHub && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSoaHub();
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2.5 font-semibold"
            >
              <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>SOA Services (Trung tâm Hướng Dịch Vụ)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

