export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  idCard?: string;
  address?: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  phone: string;
  roles: string[];
}

export interface RoomType {
  id: number;
  name: string;
  code: string;
  description: string;
  basePrice: number;
  capacity: number;
  area: number;
  bedType: string;
  imageUrl: string;
  amenities: string;
}

export type RoomStatus = 'AVAILABLE' | 'BOOKED' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';

export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  status: RoomStatus;
  priceOverride?: number;
  effectivePrice?: number;
  imageUrl?: string;
  description?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface Booking {
  id: number;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  numberOfGuests: number;
  totalAmount: number;
  depositAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalBookings: number;
  pendingBookings: number;
  checkedInBookings: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  totalCustomers: number;
}
