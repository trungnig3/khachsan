import React, { useState } from 'react';
import {
  Code,
  Send,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  tag: string;
  roles: string[];
  parameters?: string[];
  requestBody?: string;
  responseSample: string;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  // Auth
  {
    method: 'POST',
    path: '/api/auth/login',
    summary: 'Xác thực người dùng & phát sinh JWT Token',
    tag: 'Authentication',
    roles: ['PUBLIC'],
    requestBody: JSON.stringify({ email: 'admin@auragrand.vn', password: 'Password@123' }, null, 2),
    responseSample: JSON.stringify({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      type: 'Bearer',
      id: 1,
      email: 'admin@auragrand.vn',
      fullName: 'Hoàng Minh Quân',
      role: 'ROLE_ADMIN'
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    summary: 'Đăng ký tài khoản khách hàng mới',
    tag: 'Authentication',
    roles: ['PUBLIC'],
    requestBody: JSON.stringify({
      fullName: 'Trần Văn Nam',
      email: 'nam.tran@gmail.com',
      phone: '0912345678',
      password: 'Password@123'
    }, null, 2),
    responseSample: JSON.stringify({
      message: 'Đăng ký tài khoản thành công',
      userId: 15
    }, null, 2),
  },
  // Rooms
  {
    method: 'GET',
    path: '/api/rooms',
    summary: 'Lấy danh sách phòng có phân trang, lọc theo tầng, loại phòng & trạng thái',
    tag: 'Room Controller',
    roles: ['PUBLIC'],
    parameters: ['page=0', 'size=10', 'floor=2', 'roomTypeId=1', 'status=AVAILABLE', 'sort=pricePerNight,asc'],
    responseSample: JSON.stringify({
      content: [
        {
          id: 101,
          roomNumber: '101',
          roomTypeId: 1,
          roomTypeName: 'Deluxe Ocean View',
          floor: 1,
          pricePerNight: 2200000,
          status: 'AVAILABLE',
          cleanliness: 'CLEAN'
        }
      ],
      page: 0,
      size: 10,
      totalElements: 24,
      totalPages: 3
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/rooms',
    summary: 'Tạo phòng mới vào cơ sở dữ liệu (Yêu cầu quyền ADMIN)',
    tag: 'Room Controller',
    roles: ['ROLE_ADMIN'],
    requestBody: JSON.stringify({
      roomNumber: '305',
      roomTypeId: 2,
      floor: 3,
      pricePerNight: 3800000,
      status: 'AVAILABLE',
      cleanliness: 'CLEAN',
      description: 'Phòng hướng biển ban công kính'
    }, null, 2),
    responseSample: JSON.stringify({
      id: 125,
      roomNumber: '305',
      status: 'AVAILABLE',
      message: 'Phòng đã được tạo thành công'
    }, null, 2),
  },
  {
    method: 'PUT',
    path: '/api/rooms/{id}',
    summary: 'Cập nhật thông tin hoặc trạng thái buồng phòng',
    tag: 'Room Controller',
    roles: ['ROLE_ADMIN', 'ROLE_STAFF'],
    requestBody: JSON.stringify({
      status: 'MAINTENANCE',
      cleanliness: 'DIRTY'
    }, null, 2),
    responseSample: JSON.stringify({
      id: 101,
      roomNumber: '101',
      status: 'MAINTENANCE',
      updatedAt: '2026-09-30T10:15:00Z'
    }, null, 2),
  },
  // Bookings
  {
    method: 'POST',
    path: '/api/bookings',
    summary: 'Tạo đặt phòng mới (Có kiểm tra trùng lịch overlap)',
    tag: 'Booking Controller',
    roles: ['PUBLIC', 'ROLE_CUSTOMER'],
    requestBody: JSON.stringify({
      roomId: 103,
      checkInDate: '2026-10-15',
      checkOutDate: '2026-10-18',
      numGuests: 2,
      customerName: 'Nguyễn Văn An',
      customerEmail: 'an.nguyen@gmail.com',
      customerPhone: '0901234567',
      promoCode: 'WELCOME10',
      paymentMethod: 'BANK_TRANSFER'
    }, null, 2),
    responseSample: JSON.stringify({
      bookingCode: 'AG-2026101501',
      roomId: 103,
      nights: 3,
      totalAmount: 6600000,
      discountAmount: 500000,
      taxAmount: 488000,
      status: 'CONFIRMED',
      paymentStatus: 'PAID'
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/bookings/{id}/check-in',
    summary: 'Lễ tân thực hiện thủ tục Check-in và phát thẻ phòng',
    tag: 'Booking Controller',
    roles: ['ROLE_ADMIN', 'ROLE_STAFF'],
    responseSample: JSON.stringify({
      bookingCode: 'AG-20260901',
      status: 'CHECKED_IN',
      checkedInAt: '2026-09-30T14:00:00Z',
      roomStatus: 'OCCUPIED'
    }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/bookings/{id}/check-out',
    summary: 'Lễ tân quyết toán hóa đơn Check-out và chuyển phòng sang Dọn buồng',
    tag: 'Booking Controller',
    roles: ['ROLE_ADMIN', 'ROLE_STAFF'],
    requestBody: JSON.stringify({
      additionalServiceCharges: 250000,
      notes: 'Khách hoàn trả đủ thẻ từ'
    }, null, 2),
    responseSample: JSON.stringify({
      bookingCode: 'AG-20260901',
      status: 'CHECKED_OUT',
      checkedOutAt: '2026-09-30T11:45:00Z',
      roomStatus: 'CLEANING',
      invoiceCode: 'INV-2026-042'
    }, null, 2),
  },
  // Invoices & Payments
  {
    method: 'GET',
    path: '/api/invoices',
    summary: 'Lấy danh sách hóa đơn điện tử VAT',
    tag: 'Invoice Controller',
    roles: ['ROLE_ADMIN', 'ROLE_STAFF'],
    responseSample: JSON.stringify([
      {
        invoiceCode: 'INV-2026-001',
        bookingCode: 'AG-20260901',
        customerName: 'Nguyễn Văn An',
        totalAmount: 6912000,
        status: 'PAID',
        issueDate: '2026-09-28'
      }
    ], null, 2),
  },
  // Dashboard Stats
  {
    method: 'GET',
    path: '/api/dashboard/statistics',
    summary: 'Thống kê KPI doanh thu, công suất phòng và dịch vụ phục vụ',
    tag: 'Dashboard Controller',
    roles: ['ROLE_ADMIN'],
    responseSample: JSON.stringify({
      totalRevenue: 345000000,
      todayRevenue: 18500000,
      occupancyRate: 75,
      totalBookings: 68,
      occupiedRooms: 12,
      availableRooms: 10,
      maintenanceRooms: 2
    }, null, 2),
  }
];

export const ApiExplorer: React.FC = () => {
  const { showToast } = useToast();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [activeFilterTag, setActiveFilterTag] = useState<string>('ALL');

  const tags = ['ALL', 'Authentication', 'Room Controller', 'Booking Controller', 'Invoice Controller', 'Dashboard Controller'];

  const filteredEndpoints = API_ENDPOINTS.filter(e => activeFilterTag === 'ALL' || e.tag === activeFilterTag);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
              OpenAPI 3.0 / Swagger UI
            </span>
            <span className="text-xs text-[#64748B]">Spring Boot 3 RESTful API Specification</span>
          </div>
          <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
            Tài Liệu API & Kiến Trúc Backend Spring Boot
          </h2>
          <p className="text-xs text-[#64748B]">
            Toàn bộ REST Endpoints phục vụ kết nối Frontend với Java Spring Boot + Spring Security JWT + JPA Hibernate
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActiveFilterTag(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilterTag === t
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Endpoints Accordion List */}
      <div className="space-y-3">
        {filteredEndpoints.map((ep, idx) => {
          const isExpanded = expandedIndex === idx;
          const methodColor =
            ep.method === 'GET'
              ? 'bg-blue-600 text-white'
              : ep.method === 'POST'
              ? 'bg-emerald-600 text-white'
              : ep.method === 'PUT'
              ? 'bg-amber-600 text-white'
              : 'bg-red-600 text-white';

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all"
            >
              {/* Endpoint Header Bar */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#F8FAFC]"
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md ${methodColor} tracking-wider`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0F172A]">
                    {ep.path}
                  </span>
                  <span className="text-xs text-[#64748B] hidden md:inline">
                    · {ep.summary}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    {ep.roles.join(', ')}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[#64748B]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
              </div>

              {/* Expanded Payload & Response Documentation */}
              {isExpanded && (
                <div className="p-5 border-t border-[#F1F5F9] bg-[#F8FAFC] space-y-4 text-xs">
                  <p className="font-medium text-[#334155]">{ep.summary}</p>

                  {ep.parameters && (
                    <div>
                      <span className="font-bold text-[#475569] block mb-1">Tham số truy vấn (Query Parameters):</span>
                      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                        {ep.parameters.map((param, pIdx) => (
                          <span key={pIdx} className="bg-white border border-[#CBD5E1] px-2 py-0.5 rounded text-[#0F172A]">
                            {param}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {ep.requestBody && (
                    <div>
                      <span className="font-bold text-[#475569] block mb-1">Dữ liệu gửi lên (Request Body JSON):</span>
                      <pre className="p-3 bg-[#0F172A] text-[#F8FAFC] rounded-xl font-mono text-[11px] overflow-x-auto">
                        {ep.requestBody}
                      </pre>
                    </div>
                  )}

                  <div>
                    <span className="font-bold text-[#475569] block mb-1">Mẫu phản hồi thành công (HTTP 200 OK):</span>
                    <pre className="p-3 bg-[#0F172A] text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
                      {ep.responseSample}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
