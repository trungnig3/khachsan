import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bed,
  Layers,
  CalendarCheck,
  Key,
  Utensils,
  FileText,
  Tag,
  Star,
  RotateCcw,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Menu,
  X,
  Crown,
  LogOut
} from 'lucide-react';
import { Booking, DashboardStats, HotelService, Invoice, Promotion, Review, Room, RoomType, User } from '../../types/hotel';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { RoomManagement } from './RoomManagement';
import { RoomTypeManagement } from './RoomTypeManagement';
import { BookingManagement } from './BookingManagement';
import { FrontDeskCheckInOut } from './FrontDeskCheckInOut';
import { ServiceManagement } from './ServiceManagement';
import { InvoiceManagement } from './InvoiceManagement';
import { PromotionManagement } from './PromotionManagement';
import { ReviewManagement } from './ReviewManagement';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface AdminLayoutProps {
  currentUser: User;
  onSwitchToCustomer: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onPreviewRoom?: (room: Room) => void;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onSwitchToCustomer,
  onViewInvoice,
  onPreviewRoom,
  onLogout,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Live data triggers
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const rooms = hotelStore.getRooms();
  const roomTypes = hotelStore.getRoomTypes();
  const bookings = hotelStore.getBookings();
  const services = hotelStore.getServices();
  const invoices = hotelStore.getInvoices();
  const promotions = hotelStore.getPromotions();
  const reviews = hotelStore.getReviews();
  const stats = hotelStore.getDashboardStats();

  const handleResetData = () => {
    if (window.confirm('Khôi phục toàn bộ cơ sở dữ liệu về dữ liệu mẫu ban đầu?')) {
      hotelStore.resetToDemo();
      showToast('Đã khôi phục dữ liệu mẫu thành công!', 'success');
      handleRefresh();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Tổng Quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Quản Lý Buồng Phòng', icon: Bed, count: rooms.length },
    { id: 'room-types', label: 'Danh Mục Loại Phòng', icon: Layers, count: roomTypes.length },
    { id: 'bookings', label: 'Quản Lý Đặt Phòng', icon: CalendarCheck, count: bookings.length },
    { id: 'front-desk', label: 'Quầy Lễ Tân (Check-in/out)', icon: Key },
    { id: 'services', label: 'Dịch Vụ Khách Sạn', icon: Utensils, count: services.length },
    { id: 'invoices', label: 'Hóa Đơn & Thu Ngân', icon: FileText, count: invoices.length },
    { id: 'promotions', label: 'Khuyến Mãi & Voucher', icon: Tag, count: promotions.length },
    { id: 'reviews', label: 'Đánh Giá Khách Hàng', icon: Star, count: reviews.length },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0F172A] text-white p-4 flex items-center justify-between border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#EAB308]" />
          <span className="font-luxury font-bold text-sm tracking-wider">AURA GRAND ADMIN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#94A3B8] hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Left Sidebar (260px wide, adhering to SaaS reference 3) */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-[#0F172A] text-white flex-shrink-0 border-r border-[#1E293B] flex flex-col justify-between h-auto lg:h-screen lg:sticky lg:top-0 z-30`}
      >
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="hidden lg:flex items-center gap-2.5 mb-8 pb-5 border-b border-[#1E293B]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center shadow-lg">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-luxury font-bold text-base tracking-widest text-[#F8FAFC] block">
                AURA GRAND
              </span>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">
                Hotel SaaS Console
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B45309] text-white shadow-md'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-black/30 text-white' : 'bg-[#1E293B] text-[#94A3B8]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1E293B] space-y-2">
          <button
            onClick={onSwitchToCustomer}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#334155] text-xs font-semibold text-[#CBD5E1] hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>Xem Website Khách Hàng</span>
          </button>

          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-[11px] text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer"
            title="Khôi phục lại dữ liệu mẫu"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset dữ liệu mẫu</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-900/50 bg-red-950/20 text-xs font-semibold text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất hệ thống</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between gap-4">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">Hệ thống Quản trị</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
            <span className="text-[#B45309] font-medium capitalize">
              {navItems.find(i => i.id === activeTab)?.label}
            </span>
          </div>

          {/* Right Header Zone */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 z-50 text-xs">
                  <div className="font-bold text-[#0F172A] mb-2 pb-2 border-b border-[#E2E8F0] flex justify-between items-center">
                    <span>Thông báo mới</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Hệ thống</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2 bg-[#F8FAFC] rounded-lg">
                      <span className="font-bold block text-[#0F172A]">Đơn đặt phòng mới: AG-20260905</span>
                      <span className="text-[11px] text-[#64748B]">Khách hàng Vũ Quốc Khánh vừa đặt phòng 103</span>
                    </div>
                    <div className="p-2 bg-[#F8FAFC] rounded-lg">
                      <span className="font-bold block text-[#0F172A]">Báo cáo công suất: 75%</span>
                      <span className="text-[11px] text-[#64748B]">Hôm nay có 3 phòng dự kiến checkout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current user badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8F0]">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
              />
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-[#0F172A] truncate max-w-[130px]">
                  {currentUser.fullName}
                </span>
                <span className="block text-[10px] text-[#64748B] font-mono">
                  {currentUser.role}
                </span>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-semibold transition-all cursor-pointer shadow-xs ml-1"
                  title="Đăng xuất khỏi hệ thống quản trị"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="p-6 sm:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              stats={stats}
              recentBookings={bookings}
              rooms={rooms}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectBooking={(b) => {
                setActiveTab('bookings');
              }}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomManagement
              rooms={rooms}
              roomTypes={roomTypes}
              onRefresh={handleRefresh}
              onPreviewRoom={onPreviewRoom}
            />
          )}

          {activeTab === 'room-types' && (
            <RoomTypeManagement
              roomTypes={roomTypes}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingManagement
              bookings={bookings}
              onRefresh={handleRefresh}
              onViewInvoice={(b) => {
                const inv = hotelStore.getInvoices().find(i => i.bookingId === b.id);
                if (inv) {
                  onViewInvoice(inv);
                } else {
                  const newInv = hotelStore.createInvoiceFromBooking(b);
                  onViewInvoice(newInv);
                }
              }}
            />
          )}

          {activeTab === 'front-desk' && (
            <FrontDeskCheckInOut
              currentUser={currentUser}
              onRefresh={handleRefresh}
              onViewInvoice={(b) => {
                const inv = hotelStore.getInvoices().find(i => i.bookingId === b.id) || hotelStore.createInvoiceFromBooking(b);
                onViewInvoice(inv);
              }}
            />
          )}

          {activeTab === 'services' && (
            <ServiceManagement
              services={services}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoiceManagement
              invoices={invoices}
              onSelectInvoice={onViewInvoice}
            />
          )}

          {activeTab === 'promotions' && (
            <PromotionManagement
              promotions={promotions}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewManagement
              reviews={reviews}
              onRefresh={handleRefresh}
            />
          )}
        </div>
      </main>
    </div>
  );
};
