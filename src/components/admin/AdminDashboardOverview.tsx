import React from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Bed,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { DashboardStats, Booking, Room } from '../../types/hotel';

interface AdminDashboardOverviewProps {
  stats: DashboardStats;
  recentBookings: Booking[];
  rooms: Room[];
  onNavigateTab: (tab: string) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  recentBookings,
  rooms,
  onNavigateTab,
  onSelectBooking,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Welcome & KPI row */}
      <div>
        <h2 className="font-luxury text-2xl font-bold text-[#0F172A] mb-1">
          Báo Cáo Tổng Quan Hoạt Động Khách Sạn
        </h2>
        <p className="text-xs text-[#64748B]">
          Dữ liệu thời gian thực được đồng bộ hóa từ hệ thống cơ sở dữ liệu và quầy lễ tân
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
              Tổng doanh thu tích lũy
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums mb-1">
            {stats.totalRevenue.toLocaleString('vi-VN')} đ
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% so với tháng trước</span>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
              Doanh thu hôm nay
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#B45309] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums mb-1">
            {stats.todayRevenue.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-[#64748B]">
            Bao gồm tiền phòng và dịch vụ phát sinh
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
              Công suất sử dụng phòng
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums mb-1">
            {stats.occupancyRate}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-[#0F172A] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.occupancyRate)}%` }}
            />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
              Tổng lượt đặt phòng
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums mb-1">
            {stats.totalBookings} đơn
          </div>
          <div className="text-[11px] text-[#64748B]">
            {stats.totalCustomers} khách hàng đã lưu trú
          </div>
        </div>
      </div>

      {/* Room Status Matrix Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-luxury text-base font-bold text-[#0F172A]">
              Tình Trạng Buồng Phòng Thời Gian Thực ({rooms.length} phòng)
            </h3>
            <span className="text-xs text-[#64748B]">Tổng hợp theo sơ đồ khách sạn</span>
          </div>
          <button
            onClick={() => onNavigateTab('rooms')}
            className="text-xs font-semibold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 cursor-pointer"
          >
            <span>Quản lý danh sách phòng</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
            <span className="text-[11px] text-emerald-800 font-semibold block">Đang trống (Available)</span>
            <span className="font-mono text-xl font-bold text-emerald-700 tabular-nums">
              {stats.availableRooms} phòng
            </span>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl">
            <span className="text-[11px] text-amber-800 font-semibold block">Đang có khách (Occupied)</span>
            <span className="font-mono text-xl font-bold text-[#B45309] tabular-nums">
              {stats.occupiedRooms} phòng
            </span>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl">
            <span className="text-[11px] text-blue-800 font-semibold block">Đã đặt trước (Reserved)</span>
            <span className="font-mono text-xl font-bold text-blue-700 tabular-nums">
              {rooms.filter(r => r.status === 'RESERVED').length} phòng
            </span>
          </div>

          <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl">
            <span className="text-[11px] text-slate-700 font-semibold block">Dọn dẹp / Bảo trì</span>
            <span className="font-mono text-xl font-bold text-slate-700 tabular-nums">
              {stats.maintenanceRooms} phòng
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Monthly Revenue Bar Visual & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Chart representation */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-luxury text-base font-bold text-[#0F172A]">
                  Biểu Đồ Doanh Thu Theo Tháng
                </h3>
                <span className="text-xs text-[#64748B]">Tăng trưởng doanh thu 5 tháng gần nhất</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#0F172A] bg-[#F1F5F9] px-3 py-1 rounded-lg">
                Năm 2026
              </span>
            </div>

            {/* Custom high-res SVG / Bar chart */}
            <div className="space-y-4">
              {stats.revenueByMonth.map((item, idx) => {
                const maxRev = Math.max(...stats.revenueByMonth.map(m => m.revenue));
                const percentage = Math.round((item.revenue / maxRev) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#334155]">{item.month}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#64748B] text-[11px]">{item.bookings} lượt</span>
                        <span className="font-mono font-bold text-[#0F172A] tabular-nums">
                          {item.revenue.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#F1F5F9] rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#0F172A] to-[#B45309] h-3 rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
            <span>Trung bình mỗi tháng: ~160.000.000 đ</span>
            <span className="font-semibold text-emerald-600">Dự kiến đạt mục tiêu quý</span>
          </div>
        </div>

        {/* Top Hotel Services */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-luxury text-base font-bold text-[#0F172A] mb-1">
              Dịch Vụ Khách Sạn Bán Chạy
            </h3>
            <p className="text-xs text-[#64748B] mb-6">Xếp hạng theo doanh số</p>

            <div className="space-y-4">
              {stats.topServices.map((service, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
                  <div className="flex justify-between font-bold text-[#0F172A] mb-1">
                    <span>{service.name}</span>
                    <span className="text-[#B45309] font-mono tabular-nums">
                      {service.revenue.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Đã phục vụ: <strong className="font-mono text-[#0F172A]">{service.count} lượt</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
            <button
              onClick={() => onNavigateTab('services')}
              className="w-full py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Xem chi tiết bảng giá dịch vụ
            </button>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-luxury text-base font-bold text-[#0F172A]">
              Đặt Phòng Mới Nhất Cần Xử Lý
            </h3>
            <span className="text-xs text-[#64748B]">Cập nhật từ khách hàng trực tuyến</span>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-semibold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả đơn</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
              <tr>
                <th className="py-3 px-6 font-semibold uppercase text-[10px]">Mã Booking</th>
                <th className="py-3 px-6 font-semibold uppercase text-[10px]">Khách hàng</th>
                <th className="py-3 px-6 font-semibold uppercase text-[10px]">Phòng</th>
                <th className="py-3 px-6 font-semibold uppercase text-[10px]">Lưu trú</th>
                <th className="py-3 px-6 font-semibold uppercase text-[10px] text-right">Tổng tiền</th>
                <th className="py-3 px-6 font-semibold uppercase text-[10px]">Trạng thái</th>
                <th className="py-3 px-6 font-semibold uppercase text-[10px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {recentBookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-[#0F172A] tabular-nums">
                    {booking.bookingCode}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-[#0F172A]">{booking.customerName}</div>
                    <div className="text-[11px] text-[#64748B]">{booking.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-medium text-[#0F172A]">Phòng {booking.roomNumber}</span>
                    <div className="text-[10px] text-[#64748B]">{booking.roomTypeName}</div>
                  </td>
                  <td className="py-3.5 px-6 text-[#475569]">
                    <div>{booking.checkInDate} → {booking.checkOutDate}</div>
                    <div className="text-[10px] text-[#64748B]">{booking.nights} đêm · {booking.numGuests} khách</div>
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-[#0F172A] tabular-nums">
                    {booking.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        booking.status === 'CHECKED_IN'
                          ? 'bg-blue-100 text-blue-700'
                          : booking.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : booking.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : booking.status === 'CHECKED_OUT'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status === 'CHECKED_IN'
                        ? 'Đang ở'
                        : booking.status === 'CONFIRMED'
                        ? 'Đã duyệt'
                        : booking.status === 'PENDING'
                        ? 'Chờ duyệt'
                        : booking.status === 'CHECKED_OUT'
                        ? 'Đã xong'
                        : 'Hủy'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => onSelectBooking(booking)}
                      className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[11px] font-semibold text-[#0F172A] hover:bg-white cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
