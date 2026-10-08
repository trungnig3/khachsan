export type Role = 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface RoomType {
  id: number;
  name: string;
  code: string;
  description: string;
  basePrice: number; // VND per night
  maxGuests: number;
  area: number; // m2
  bedType: string;
  amenities: string[];
  imageUrl: string;
  featured?: boolean;
}

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'CLEANING';

export interface Room {
  id: number;
  roomNumber: string; // e.g. "101", "205", "501"
  roomTypeId: number;
  roomTypeName?: string;
  floor: number;
  pricePerNight: number;
  status: RoomStatus;
  cleanliness: 'CLEAN' | 'DIRTY' | 'INSPECTED';
  description: string;
  imageUrl: string;
  images: string[];
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface BookingServiceItem {
  serviceId: number;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Booking {
  id: number;
  bookingCode: string; // e.g. "AG-20260901"
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  numGuests: number;
  roomPricePerNight: number;
  totalRoomPrice: number;
  servicesTotal: number;
  discountAmount: number;
  taxAmount: number; // 8% VAT
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'VNPAY';
  services: BookingServiceItem[];
  specialRequests?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  createdAt: string;
}

export interface HotelService {
  id: number;
  name: string;
  category: 'DINING' | 'WELLNESS' | 'TRANSPORT' | 'LAUNDRY' | 'CONCIERGE';
  description: string;
  price: number;
  unit: string; // "lượt", "người / ngày", "chuyến", "kg"
  imageUrl: string;
  available: boolean;
}

export interface Invoice {
  id: number;
  invoiceCode: string;
  bookingId: number;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  roomCharges: number;
  serviceCharges: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
  paymentMethod: string;
  issueDate: string;
}

export interface Promotion {
  id: number;
  code: string;
  title: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number; // % e.g. 15, or fixed VND e.g. 500000
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface Review {
  id: number;
  bookingId?: number;
  customerName: string;
  avatar?: string;
  roomTypeName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  approved: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'payment' | 'service' | 'system';
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalBookings: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  totalCustomers: number;
  occupancyRate: number;
  revenueByMonth: { month: string; revenue: number; bookings: number }[];
  occupancyByRoomType: { typeName: string; count: number; occupied: number }[];
  topServices: { name: string; count: number; revenue: number }[];
}
