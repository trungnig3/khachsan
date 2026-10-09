import { hotelStore } from './hotelStore';

export interface SoaServiceEndpoint {
  id: string;
  serviceName: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestHeaders: Record<string, string>;
  samplePayload: any;
  responseSchema: any;
  status: 'ONLINE' | 'HEALTHY' | 'MAINTENANCE';
  slaLatencyMs: number;
}

export const SOA_SERVICES_CATALOG: SoaServiceEndpoint[] = [
  {
    id: 'auth-login',
    serviceName: 'Auth & Identity Service (Xác thực & Phân quyền SOA)',
    name: 'Xác thực người dùng & Cấp Token JWT',
    method: 'POST',
    path: '/api/v1/auth/login',
    description: 'Xác thực thông tin đăng nhập và cấp JWT Bearer Token theo chuẩn OAuth2 / SOA Security.',
    requestHeaders: { 'Content-Type': 'application/json' },
    samplePayload: {
      username: 'admin@auragrand.com',
      password: 'password123'
    },
    responseSchema: {
      service: 'auth-service',
      version: '1.0.0',
      status: 200,
      message: 'Xác thực thành công!',
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        type: 'Bearer',
        user: { id: 'u1', email: 'admin@auragrand.com', role: 'ROLE_ADMIN' }
      }
    },
    status: 'HEALTHY',
    slaLatencyMs: 18
  },
  {
    id: 'auth-register',
    serviceName: 'Auth & Identity Service (Xác thực & Phân quyền SOA)',
    name: 'Đăng ký tài khoản Khách hàng mới',
    method: 'POST',
    path: '/api/v1/auth/register',
    description: 'Khởi tạo hồ sơ khách hàng mới và cấp quyền ROLE_CUSTOMER.',
    requestHeaders: { 'Content-Type': 'application/json' },
    samplePayload: {
      fullName: 'Trần Văn Nam',
      email: 'nam.tran@example.com',
      phone: '0988123456',
      password: 'CustomerPassword123!'
    },
    responseSchema: {
      service: 'auth-service',
      version: '1.0.0',
      status: 201,
      message: 'Đăng ký tài khoản thành công!',
      data: { id: 'u4', email: 'nam.tran@example.com', role: 'ROLE_CUSTOMER' }
    },
    status: 'HEALTHY',
    slaLatencyMs: 25
  },
  {
    id: 'room-search',
    serviceName: 'Room & Catalog Service (Tra cứu & Quản lý Phòng)',
    name: 'Truy vấn danh sách phòng theo bộ lọc',
    method: 'GET',
    path: '/api/v1/rooms/search?checkIn=2026-10-10&checkOut=2026-10-12&type=SUITE&guests=2',
    description: 'Dịch vụ tìm kiếm phòng khả dụng theo khoảng thời gian, loại phòng và số khách.',
    requestHeaders: { 'Accept': 'application/json' },
    samplePayload: null,
    responseSchema: {
      service: 'room-catalog-service',
      version: '1.0.0',
      status: 200,
      message: 'Truy vấn danh sách phòng thành công',
      totalAvailable: 4,
      data: [
        { id: '101', number: 'P101', typeName: 'Presidential Suite', pricePerNight: 5500000, status: 'AVAILABLE' }
      ]
    },
    status: 'HEALTHY',
    slaLatencyMs: 12
  },
  {
    id: 'booking-create',
    serviceName: 'Booking & Reservation Service (Đặt phòng & Điều phối)',
    name: 'Khởi tạo đơn đặt phòng mới (Service Orchestration)',
    method: 'POST',
    path: '/api/v1/bookings/create',
    description: 'Tiếp nhận yêu cầu đặt phòng, tự động liên kết với Payment Service & Housekeeping Service.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
    },
    samplePayload: {
      roomId: '101',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'customer@auragrand.com',
      customerPhone: '0901234567',
      checkInDate: '2026-10-10',
      checkOutDate: '2026-10-12',
      guestsCount: 2,
      specialRequests: 'Cần phòng tầng cao, view biển'
    },
    responseSchema: {
      service: 'booking-service',
      version: '1.0.0',
      status: 201,
      message: 'Đặt phòng thành công và gửi thông báo xác nhận!',
      data: {
        bookingCode: 'AG-202610-8812',
        status: 'CONFIRMED',
        totalAmount: 11000000,
        paymentStatus: 'PENDING'
      }
    },
    status: 'HEALTHY',
    slaLatencyMs: 42
  },
  {
    id: 'housekeeping-update',
    serviceName: 'Housekeeping Service (Quản lý Buồng phòng & Bảo trì)',
    name: 'Cập nhật trạng thái dọn dẹp & lẻ tiền lẻ buồng phòng',
    method: 'POST',
    path: '/api/v1/housekeeping/update-status',
    description: 'Dịch vụ cập nhật trạng thái phòng (SẠCH, ĐANG DỌN, CẦN BẢO TRÌ) và phụ phí buồng phòng.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
    },
    samplePayload: {
      roomId: '101',
      status: 'CLEAN',
      assignedStaff: 'Lễ Tân - Nguyễn Thị Mai',
      cleaningNotes: 'Đã bổ sung bộ khăn tắm cao cấp & hoa tươi',
      extraFee: 50000
    },
    responseSchema: {
      service: 'housekeeping-service',
      version: '1.0.0',
      status: 200,
      message: 'Cập nhật trạng thái buồng phòng thành công!',
      data: { roomId: '101', isCleaned: true, extraFee: 50000, updatedBy: 'Lễ Tân' }
    },
    status: 'HEALTHY',
    slaLatencyMs: 15
  },
  {
    id: 'services-order',
    serviceName: 'Amenity & Spa Service (Tiện ích & Dịch vụ Spa)',
    name: 'Đặt dịch vụ bổ sung (Spa / Nước uống / Xe đưa đón)',
    method: 'POST',
    path: '/api/v1/services/order',
    description: 'Tích hợp dịch vụ bổ sung vào hóa đơn phòng nghỉ.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
    },
    samplePayload: {
      bookingId: 'BK-1001',
      serviceId: 'srv-spa-01',
      serviceName: 'Liệu trình Spa Thảo Dược 60 phút',
      quantity: 2,
      unitPrice: 850000
    },
    responseSchema: {
      service: 'amenity-service',
      version: '1.0.0',
      status: 200,
      message: 'Ghi nhận đơn dịch vụ Spa thành công!',
      data: { orderId: 'ORD-552', totalCharge: 1700000, status: 'PROCESSING' }
    },
    status: 'HEALTHY',
    slaLatencyMs: 20
  },
  {
    id: 'payment-process',
    serviceName: 'Payment & Invoice Service (Thanh toán & Hóa đơn)',
    name: 'Thanh toán trực tuyến & Xuất Hóa đơn VAT (e-Invoice)',
    method: 'POST',
    path: '/api/v1/payments/process',
    description: 'Dịch vụ xử lý thanh toán qua VNPay/Chuyển khoản & tự động tạo hóa đơn đỏ GTGT.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
    },
    samplePayload: {
      bookingId: 'BK-1001',
      paymentMethod: 'VNPAY_QR',
      taxCode: '0101234567',
      companyName: 'Công ty TNHH Tập đoàn Công nghệ SOA',
      amount: 11000000
    },
    responseSchema: {
      service: 'payment-invoice-service',
      version: '1.0.0',
      status: 200,
      message: 'Thanh toán thành công! Hóa đơn điện tử GTGT đã được cấp.',
      data: {
        invoiceNo: 'HD-2026-00921',
        transactionId: 'VNP-88392102',
        subtotal: 10000000,
        vatAmount: 1000000,
        totalAmount: 11000000
      }
    },
    status: 'HEALTHY',
    slaLatencyMs: 35
  }
];

export class SoaGatewayService {
  static executeEndpoint(endpointId: string, customPayload?: any) {
    const ep = SOA_SERVICES_CATALOG.find(e => e.id === endpointId);
    if (!ep) {
      return {
        service: 'api-gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 404,
        message: 'SOA Endpoint target not found in Service Discovery Registry',
        data: null
      };
    }

    const start = performance.now();
    const payload = customPayload || ep.samplePayload;

    // Simulate real execution according to endpoint
    let resData: any = ep.responseSchema;
    
    if (ep.id === 'auth-login') {
      const user = hotelStore.getUsers().find(u => u.email === payload?.username) || hotelStore.getUsers()[0];
      resData = {
        service: 'auth-service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 200,
        message: `Xác thực thành công vai trò ${user.role}!`,
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          type: 'Bearer Token (SOA Authorization)',
          user: user
        }
      };
    } else if (ep.id === 'room-search') {
      const rooms = hotelStore.getRooms();
      resData = {
        service: 'room-catalog-service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 200,
        message: `Đã tìm thấy ${rooms.length} phòng khả dụng trong hệ thống SOA`,
        totalAvailable: rooms.length,
        data: rooms
      };
    } else if (ep.id === 'booking-create') {
      const rooms = hotelStore.getRooms();
      const targetRoom = rooms.find(r => r.id === payload?.roomId) || rooms[0];
      resData = {
        service: 'booking-service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 201,
        message: 'Kịch bản Service Orchestration: Khởi tạo Đơn đặt phòng & Thông báo thành công!',
        data: {
          bookingCode: 'AG-' + Math.floor(100000 + Math.random() * 900000),
          roomId: targetRoom.id,
          roomNumber: targetRoom.roomNumber,
          customerName: payload?.customerName || 'Khách hàng SOA',
          checkInDate: payload?.checkInDate || '2026-10-10',
          checkOutDate: payload?.checkOutDate || '2026-10-12',
          totalAmount: targetRoom.pricePerNight * 2,
          status: 'CONFIRMED'
        }
      };
    } else if (ep.id === 'housekeeping-update') {
      resData = {
        service: 'housekeeping-service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 200,
        message: 'Đã cập nhật trạng thái dọn dẹp buồng phòng!',
        data: {
          roomId: payload?.roomId || '101',
          status: payload?.status || 'CLEAN',
          extraFee: Number(payload?.extraFee) || 50000,
          notes: payload?.cleaningNotes || 'Đã kiểm tra sạch sẽ',
          updatedAt: new Date().toLocaleString('vi-VN')
        }
      };
    }

    const durationMs = Math.round(performance.now() - start) + Math.floor(Math.random() * 10) + 5;

    return {
      httpStatus: resData.status || 200,
      durationMs,
      timestamp: new Date().toISOString(),
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-SOA-Service-Gateway': 'AuraGrand-ESB-v2.4',
        'X-Service-Latency': `${durationMs}ms`,
        'X-Powered-By': 'Spring Boot 3.2 SOA Microservices / Express Node.js'
      },
      body: resData
    };
  }

  static generateOpenApiSpecJson() {
    return JSON.stringify({
      openapi: "3.0.3",
      info: {
        title: "Aura Grand Hotel Management System - SOA Web Services API",
        description: "Hệ thống Web Services hướng dịch vụ (Service-Oriented Architecture - SOA) cho bài tập lớn môn Phát triển phần mềm hướng dịch vụ.",
        version: "2.4.0",
        contact: {
          name: "Ban Phát Triển Kiến Trúc SOA",
          email: "soa-architecture@auragrand.com"
        }
      },
      servers: [
        { url: "https://localhost:8080", description: "Backend Java Spring Boot SOA Server" },
        { url: "/api/v1", description: "Node.js Express API Gateway Proxy" }
      ],
      paths: {
        "/auth/login": {
          post: {
            summary: "SOA Auth - Xác thực tài khoản & Cấp JWT Token",
            requestBody: {
              required: true,
              content: { "application/json": { schema: { type: "object", properties: { username: { type: "string" }, password: { type: "string" } } } } }
            },
            responses: { "200": { description: "Xác thực thành công và trả về JWT Bearer token" } }
          }
        },
        "/rooms/search": {
          get: {
            summary: "SOA Room Catalog - Tìm kiếm phòng theo tiêu chí",
            responses: { "200": { description: "Trả về danh sách các phòng trống khả dụng" } }
          }
        },
        "/bookings/create": {
          post: {
            summary: "SOA Booking - Khởi tạo Đơn đặt phòng (Service Orchestration)",
            responses: { "201": { description: "Đơn đặt phòng đã được tạo thành công" } }
          }
        },
        "/housekeeping/update-status": {
          post: {
            summary: "SOA Housekeeping - Quản lý buồng phòng & Phụ phí",
            responses: { "200": { description: "Trạng thái dọn dẹp đã cập nhật" } }
          }
        }
      }
    }, null, 2);
  }

  static generatePostmanCollectionJson() {
    return JSON.stringify({
      info: {
        name: "Aura Grand Hotel - SOA Services Postman Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: SOA_SERVICES_CATALOG.map(s => ({
        name: `${s.method} ${s.path}`,
        request: {
          method: s.method,
          header: Object.entries(s.requestHeaders).map(([k, v]) => ({ key: k, value: v })),
          url: {
            raw: `{{base_url}}${s.path}`,
            host: ["{{base_url}}"],
            path: s.path.split('/').filter(Boolean)
          },
          body: s.samplePayload ? {
            mode: "raw",
            raw: JSON.stringify(s.samplePayload, null, 2),
            options: { raw: { language: "json" } }
          } : undefined
        }
      }))
    }, null, 2);
  }

  static generateWsdlXml() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions name="HotelManagementSoaService"
    targetNamespace="http://soa.auragrand.com/services/hotel"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
    xmlns:tns="http://soa.auragrand.com/services/hotel"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/">
    <wsdl:types>
        <xsd:schema targetNamespace="http://soa.auragrand.com/services/hotel">
            <xsd:element name="BookingRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="roomId" type="xsd:string"/>
                        <xsd:element name="customerName" type="xsd:string"/>
                        <xsd:element name="checkInDate" type="xsd:date"/>
                        <xsd:element name="checkOutDate" type="xsd:date"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            <xsd:element name="BookingResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="bookingCode" type="xsd:string"/>
                        <xsd:element name="status" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </wsdl:types>
    <wsdl:message name="BookingRequestMessage">
        <wsdl:part name="parameters" element="tns:BookingRequest"/>
    </wsdl:message>
    <wsdl:message name="BookingResponseMessage">
        <wsdl:part name="parameters" element="tns:BookingResponse"/>
    </wsdl:message>
    <wsdl:portType name="HotelServicePortType">
        <wsdl:operation name="createBooking">
            <wsdl:input message="tns:BookingRequestMessage"/>
            <wsdl:output message="tns:BookingResponseMessage"/>
        </wsdl:operation>
    </wsdl:portType>
</wsdl:definitions>`;
  }
}
