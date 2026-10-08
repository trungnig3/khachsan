import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, LogIn, Lock, Crown, ShieldCheck } from 'lucide-react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/customer/HeroBanner';
import { RoomList } from './components/customer/RoomList';
import { RoomDetailModal } from './components/customer/RoomDetailModal';
import { BookingModal } from './components/customer/BookingModal';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { HotelServicesSection } from './components/customer/HotelServicesSection';
import { PromotionsAndReviews } from './components/customer/PromotionsAndReviews';
import { AdminLayout } from './components/admin/AdminLayout';
import { InvoiceModal } from './components/common/InvoiceModal';
import { LoginModal } from './components/common/LoginModal';
import { hotelStore, DEMO_USERS } from './services/hotelStore';
import { Booking, Invoice, Room, User } from './types/hotel';

function MainApp() {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<'customer' | 'admin' | 'my-bookings'>('customer');
  const [currentUser, setCurrentUser] = useState<User | null>(() => hotelStore.getCurrentUser());
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'register'>('login');

  // Search parameters from Hero banner
  const [checkInDate, setCheckInDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const defaultNext = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  };
  const [checkOutDate, setCheckOutDate] = useState<string>(defaultNext());
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedRoomType, setSelectedRoomType] = useState<string>('ALL');

  // Modals state
  const [detailModalRoom, setDetailModalRoom] = useState<Room | null>(null);
  const [bookingModalRoom, setBookingModalRoom] = useState<Room | null>(null);
  const [viewInvoiceModal, setViewInvoiceModal] = useState<Invoice | null>(null);

  const rooms = hotelStore.getRooms();
  const roomTypes = hotelStore.getRoomTypes();
  const services = hotelStore.getServices();
  const promotions = hotelStore.getPromotions();
  const reviews = hotelStore.getReviews();

  const handleHeroSearch = () => {
    const roomsSection = document.getElementById('rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUserChange = (user: User | null) => {
    setCurrentUser(user);
    hotelStore.setCurrentUser(user);
  };

  const handleLogout = () => {
    hotelStore.logout();
    setCurrentUser(null);
    setCurrentView('customer');
    showToast('Đã đăng xuất tài khoản thành công!', 'info');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    hotelStore.setCurrentUser(user);
    setLoginModalOpen(false);
    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_STAFF') {
      setCurrentView('admin');
    } else {
      setCurrentView('customer');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0F172A]">
      {/* Show Navbar on customer and my-bookings views */}
      {currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          currentUser={currentUser}
          onUserChange={handleUserChange}
          demoUsers={DEMO_USERS}
          onOpenBookingModal={() => {
            if (rooms.length > 0) {
              setBookingModalRoom(rooms[0]);
            }
          }}
          onOpenLoginModal={() => {
            setLoginModalMode('login');
            setLoginModalOpen(true);
          }}
          onOpenRegisterModal={() => {
            setLoginModalMode('register');
            setLoginModalOpen(true);
          }}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router */}
      {currentView === 'customer' && (
        <main className="flex-1">
          {/* Hero Banner with Booking search widget */}
          <HeroBanner
            checkInDate={checkInDate}
            setCheckInDate={setCheckInDate}
            checkOutDate={checkOutDate}
            setCheckOutDate={setCheckOutDate}
            guestsCount={guestsCount}
            setGuestsCount={setGuestsCount}
            selectedRoomType={selectedRoomType}
            setSelectedRoomType={setSelectedRoomType}
            roomTypes={roomTypes}
            onSearch={handleHeroSearch}
          />

          {/* Room Catalog with filter & sorting */}
          <RoomList
            rooms={rooms}
            roomTypes={roomTypes}
            onSelectRoom={(r) => setDetailModalRoom(r)}
            onBookRoom={(r) => setBookingModalRoom(r)}
            initialTypeFilter={selectedRoomType}
          />

          {/* Hotel Services & Spa Highlights */}
          <HotelServicesSection services={services} />

          {/* Promotions Vouchers & Customer Reviews */}
          <PromotionsAndReviews
            promotions={promotions}
            reviews={reviews}
            onApplyVoucher={(code) => {
              if (rooms.length > 0) {
                setBookingModalRoom(rooms[0]);
              }
            }}
          />

          <Footer />
        </main>
      )}

      {currentView === 'my-bookings' && (
        <main className="flex-1">
          <CustomerDashboard
            currentUser={currentUser}
            onBackToHome={() => setCurrentView('customer')}
            onSelectBookingInvoice={(b) => {
              const inv = hotelStore.getInvoices().find(i => i.bookingId === b.id) || hotelStore.createInvoiceFromBooking(b);
              setViewInvoiceModal(inv);
            }}
            onNavigateSection={(sec) => {
              setCurrentView('customer');
              setTimeout(() => {
                const el = document.getElementById(sec);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            onLogout={handleLogout}
            onOpenLoginModal={() => {
              setLoginModalMode('login');
              setLoginModalOpen(true);
            }}
          />
          <Footer />
        </main>
      )}

      {currentView === 'admin' && (
        !currentUser ? (
          /* Unauthenticated state for Admin */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[85vh] bg-slate-50">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4 ring-8 ring-amber-50">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-1">
              Yêu Cầu Xác Thực Hệ Thống
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2 font-luxury">
              Vui Lòng Đăng Nhập Trang Quản Trị
            </h2>
            <p className="text-xs text-[#64748B] max-w-md mb-6 leading-relaxed">
              Khu vực quản lý khách sạn SaaS dành riêng cho Ban Quản Lý (ROLE_ADMIN) và Nhân Viên Lễ Tân (ROLE_STAFF).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('customer')}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-[#0F172A] text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Trang Chủ Khách Hàng</span>
              </button>
              <button
                onClick={() => handleUserChange(DEMO_USERS[0])}
                className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-md"
              >
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span>Đăng nhập Tổng Quản Lý (Admin)</span>
              </button>
              <button
                onClick={() => handleUserChange(DEMO_USERS[1])}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Đăng nhập Trưởng Lễ Tân (Staff)</span>
              </button>
            </div>
          </div>
        ) : currentUser.role === 'ROLE_CUSTOMER' ? (
          /* Forbidden state for Customer attempting to access Admin */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[85vh] bg-slate-50">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-red-600 mb-1">
              Phân Quyền Truy Cập (403 Forbidden)
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2 font-luxury">
              Khách Hàng Không Có Quyền Truy Cập Admin!
            </h2>
            <p className="text-xs text-[#64748B] max-w-md mb-6 leading-relaxed">
              Tài khoản hiện tại của bạn là <strong>{currentUser.fullName}</strong> mang vai trò <strong>ROLE_CUSTOMER</strong>.
              Trang quản trị nội bộ này chỉ dành riêng cho <strong>Ban Quản Lý (ROLE_ADMIN)</strong> hoặc <strong>Nhân Viên Lễ Tân (ROLE_STAFF)</strong>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('customer')}
                className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Trang Chủ Khách Hàng</span>
              </button>
              <button
                onClick={() => handleUserChange(DEMO_USERS[0])}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Đổi sang Tài khoản Tổng Quản Lý (Admin)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authorized Admin View */
          <AdminLayout
            currentUser={currentUser}
            onSwitchToCustomer={() => setCurrentView('customer')}
            onViewInvoice={(inv) => setViewInvoiceModal(inv)}
            onPreviewRoom={(r) => setDetailModalRoom(r)}
            onLogout={handleLogout}
          />
        )
      )}

      {/* Room Detail Modal */}
      {detailModalRoom && (
        <RoomDetailModal
          room={detailModalRoom}
          roomType={roomTypes.find(t => t.id === detailModalRoom.roomTypeId)}
          onClose={() => setDetailModalRoom(null)}
          onBook={(r) => {
            setDetailModalRoom(null);
            setBookingModalRoom(r);
          }}
        />
      )}

      {/* Online Booking Modal */}
      {bookingModalRoom && (
        <BookingModal
          room={bookingModalRoom}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialGuests={guestsCount}
          currentUser={currentUser}
          onClose={() => setBookingModalRoom(null)}
          onBookingSuccess={(booking) => {
            // Completed
          }}
        />
      )}

      {/* Printable VAT Invoice Modal */}
      {viewInvoiceModal && (
        <InvoiceModal
          invoice={viewInvoiceModal}
          onClose={() => setViewInvoiceModal(null)}
        />
      )}

      {/* System Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        initialMode={loginModalMode}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
