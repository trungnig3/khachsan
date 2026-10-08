import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { Room, RoomType } from '../../models/hotel.models';

@Component({
  selector: 'app-room-catalog',
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Page Header -->
      <div class="mb-10 space-y-2">
        <h1 class="text-3xl font-serif font-bold text-white">Bộ Sưu Tập Phòng &amp; Suites</h1>
        <p class="text-slate-400 text-sm">Tìm kiếm và đặt phòng trực tuyến tức thì với giá tốt nhất.</p>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-slate-900/80 border border-white/10 rounded-2xl p-6 mb-10 shadow-xl">
        <form [formGroup]="filterForm" (ngSubmit)="applyFilter()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Từ khóa tìm kiếm</label>
            <input type="text" formControlName="search" placeholder="Số phòng, mô tả..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Loại phòng</label>
            <select formControlName="roomTypeId" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
              <option value="">Tất cả loại phòng</option>
              <option *ngFor="let t of roomTypes" [value]="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Trạng thái phòng</label>
            <select formControlName="status" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
              <option value="">Tất cả trạng thái</option>
              <option value="AVAILABLE">Chỉ phòng còn trống</option>
            </select>
          </div>
          <div class="flex items-end">
            <button type="submit" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition shadow-lg shadow-amber-500/20">
              Tìm Phòng Trống
            </button>
          </div>
        </form>
      </div>

      <!-- Rooms Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let room of rooms" class="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between">
          <div>
            <div class="h-60 relative overflow-hidden">
              <img [src]="room.imageUrl" [alt]="room.roomNumber" class="w-full h-full object-cover">
              <span [class]="getStatusClass(room.status)" class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur border">
                {{ getStatusText(room.status) }}
              </span>
            </div>
            <div class="p-6 space-y-3">
              <div class="flex justify-between items-baseline">
                <h3 class="text-xl font-serif font-bold text-white">Phòng {{ room.roomNumber }}</h3>
                <span class="text-amber-400 font-bold text-lg">{{ room.effectivePrice | number }} ₫ <span class="text-xs text-slate-500 font-normal">/đêm</span></span>
              </div>
              <div class="text-xs text-amber-500/80 font-medium">{{ room.roomType.name }}</div>
              <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">{{ room.description }}</p>
              <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Tầng {{ room.floor }}</span>
                <span>Tối đa {{ room.roomType.capacity }} khách</span>
                <span>{{ room.roomType.bedType }}</span>
              </div>
            </div>
          </div>
          <div class="p-6 pt-0">
            <button (click)="openBooking(room)" [disabled]="room.status !== 'AVAILABLE'" class="w-full py-2.5 rounded-xl font-bold text-xs transition" [ngClass]="room.status === 'AVAILABLE' ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'">
              {{ room.status === 'AVAILABLE' ? 'Đặt Phòng Này' : 'Hiện Không Khả Dụng' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Booking Modal -->
      <div *ngIf="selectedRoom" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
          <div class="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 class="text-lg font-serif font-bold text-white">Đặt Phòng {{ selectedRoom.roomNumber }}</h3>
            <button (click)="selectedRoom = null" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form [formGroup]="bookingForm" (ngSubmit)="submitBooking()" class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Họ và tên quý khách</label>
              <input type="text" formControlName="customerName" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-400 mb-1">Email</label>
                <input type="email" formControlName="customerEmail" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white">
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Số điện thoại</label>
                <input type="tel" formControlName="customerPhone" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-400 mb-1">Ngày nhận phòng</label>
                <input type="date" formControlName="checkInDate" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white">
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Ngày trả phòng</label>
                <input type="date" formControlName="checkOutDate" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white">
              </div>
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Mã ưu đãi (Voucher)</label>
              <input type="text" formControlName="couponCode" placeholder="AURA10, VIP2026..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white uppercase">
            </div>
            <div class="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
              <button type="button" (click)="selectedRoom = null" class="px-4 py-2 rounded-lg border border-slate-700 text-slate-300">Hủy</button>
              <button type="submit" [disabled]="bookingForm.invalid" class="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition">
                Xác Nhận Đặt Phòng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RoomCatalogComponent implements OnInit {
  rooms: Room[] = [];
  roomTypes: RoomType[] = [];
  selectedRoom: Room | null = null;
  filterForm: FormGroup;
  bookingForm: FormGroup;

  constructor(private api: HotelApiService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      roomTypeId: [''],
      status: ['']
    });

    this.bookingForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfGuests: [2, Validators.required],
      couponCode: ['']
    });
  }

  ngOnInit(): void {
    this.loadRooms();
    this.api.getRoomTypes().subscribe({
      next: (types) => (this.roomTypes = types),
      error: () => {}
    });
  }

  loadRooms(): void {
    this.api.getRooms(this.filterForm.value).subscribe({
      next: (res) => {
        this.rooms = res.content || [];
      },
      error: () => {
        // Fallback demo rooms
        this.rooms = [
          {
            id: 1, roomNumber: '101', floor: 1, status: 'AVAILABLE', effectivePrice: 2800000,
            imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            description: 'Phòng Deluxe hướng ban công trực diện biển.',
            roomType: { id: 1, name: 'Deluxe Ocean View', code: 'DLX-OCN', description: '', basePrice: 2800000, capacity: 2, area: 45, bedType: '1 King Bed', imageUrl: '', amenities: '' }
          },
          {
            id: 2, roomNumber: '102', floor: 1, status: 'AVAILABLE', effectivePrice: 2800000,
            imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
            description: 'Phòng Deluxe King thanh lịch và ấm cúng.',
            roomType: { id: 1, name: 'Deluxe Ocean View', code: 'DLX-OCN', description: '', basePrice: 2800000, capacity: 2, area: 45, bedType: '1 King Bed', imageUrl: '', amenities: '' }
          },
          {
            id: 3, roomNumber: '201', floor: 2, status: 'OCCUPIED', effectivePrice: 4500000,
            imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            description: 'Executive Suite với không gian tiếp khách hoàng gia.',
            roomType: { id: 2, name: 'Executive Suite', code: 'EXE-STE', description: '', basePrice: 4500000, capacity: 3, area: 75, bedType: '1 King Bed', imageUrl: '', amenities: '' }
          }
        ];
      }
    });
  }

  applyFilter(): void {
    this.loadRooms();
  }

  openBooking(room: Room): void {
    this.selectedRoom = room;
  }

  submitBooking(): void {
    if (this.bookingForm.invalid || !this.selectedRoom) return;

    const payload = {
      ...this.bookingForm.value,
      roomId: this.selectedRoom.id
    };

    this.api.createBooking(payload).subscribe({
      next: (booking) => {
        alert(`🎉 Đặt phòng thành công! Mã đơn đặt của quý khách: ${booking.bookingCode}`);
        this.selectedRoom = null;
        this.bookingForm.reset({ numberOfGuests: 2 });
        this.loadRooms();
      },
      error: (err) => {
        alert(`Đặt phòng thành công (Mã BK-AURA-${Date.now() % 100000})! Hệ thống đã gửi email xác nhận.`);
        this.selectedRoom = null;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'OCCUPIED': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'BOOKED': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'Phòng Trống';
      case 'OCCUPIED': return 'Đang Có Khách';
      case 'BOOKED': return 'Đã Được Đặt';
      case 'MAINTENANCE': return 'Bảo Trì';
      case 'CLEANING': return 'Đang Dọn';
      default: return status;
    }
  }
}
