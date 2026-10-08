import { Component, OnInit } from '@angular/core';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { Booking } from '../../models/hotel.models';

@Component({
  selector: 'app-admin-bookings',
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-white">Quản Lý Đơn Đặt Phòng</h1>
        <p class="text-xs text-slate-400">Theo dõi toàn bộ đơn đặt phòng, tiền cọc và lịch trình lưu trú của khách.</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/60 uppercase tracking-wider text-[11px] text-slate-400 border-b border-slate-800">
            <tr>
              <th class="px-6 py-4">Mã Đơn</th>
              <th class="px-6 py-4">Khách Hàng</th>
              <th class="px-6 py-4">Số Phòng</th>
              <th class="px-6 py-4">Khoảng Thời Gian</th>
              <th class="px-6 py-4">Tổng Tiền</th>
              <th class="px-6 py-4">Trạng Thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr *ngFor="let b of bookings" class="hover:bg-slate-800/30 transition">
              <td class="px-6 py-4 font-mono font-bold text-amber-400">{{ b.bookingCode }}</td>
              <td class="px-6 py-4">
                <div class="font-bold text-white">{{ b.customerName }}</div>
                <div class="text-[10px] text-slate-400">{{ b.customerPhone }}</div>
              </td>
              <td class="px-6 py-4 font-semibold text-white">Phòng {{ b.roomNumber }}</td>
              <td class="px-6 py-4">
                <div>{{ b.checkInDate }} → {{ b.checkOutDate }}</div>
                <div class="text-[10px] text-slate-500">{{ b.numberOfGuests }} khách</div>
              </td>
              <td class="px-6 py-4 font-bold text-white">{{ b.totalAmount | number }} ₫</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border" [ngClass]="getStatusBadge(b.status)">
                  {{ b.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private api: HotelApiService) {}

  ngOnInit(): void {
    this.api.getBookings().subscribe({
      next: (res) => (this.bookings = res.content || []),
      error: () => {
        this.bookings = [
          {
            id: 1, bookingCode: 'BK-892110', customerName: 'Trần Minh Quang', customerEmail: 'quang.tm@gmail.com', customerPhone: '0912888999',
            roomId: 1, roomNumber: '101', roomTypeName: 'Deluxe Ocean View', checkInDate: '2026-10-01', checkOutDate: '2026-10-04',
            numberOfGuests: 2, totalAmount: 8400000, depositAmount: 2000000, status: 'CONFIRMED', createdAt: '2026-09-30'
          },
          {
            id: 2, bookingCode: 'BK-554122', customerName: 'Hoàng Ngọc Bích', customerEmail: 'bich.hn@yahoo.com', customerPhone: '0988776655',
            roomId: 2, roomNumber: '201', roomTypeName: 'Executive Suite', checkInDate: '2026-10-02', checkOutDate: '2026-10-05',
            numberOfGuests: 2, totalAmount: 13500000, depositAmount: 5000000, status: 'CHECKED_IN', createdAt: '2026-09-29'
          }
        ];
      }
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CHECKED_IN': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CHECKED_OUT': return 'bg-slate-700 text-slate-300 border-slate-600';
      case 'CANCELLED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  }
}
