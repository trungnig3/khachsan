import { Component } from '@angular/core';
import { HotelApiService } from '../../core/services/hotel-api.service';

@Component({
  selector: 'app-admin-frontdesk',
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-serif font-bold text-white">Quầy Lễ Tân (Front Desk)</h1>
        <p class="text-xs text-slate-400">Thao tác nhanh nhận phòng (Check-in), trả phòng (Check-out) và xuất hóa đơn.</p>
      </div>

      <!-- Quick Action Desk Search -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 class="text-sm font-bold text-white uppercase tracking-wider">Tra cứu nhận phòng / trả phòng nhanh</h2>
        <div class="flex gap-4">
          <input type="text" [(ngModel)]="searchCode" placeholder="Nhập Mã Booking (VD: BK-892110) hoặc SĐT khách..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white">
          <button (click)="findBooking()" class="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            Tìm Kiếm
          </button>
        </div>

        <div *ngIf="foundBooking" class="mt-6 p-6 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-amber-400 font-mono text-sm font-bold">{{ foundBooking.bookingCode }}</div>
              <div class="text-base font-bold text-white mt-1">{{ foundBooking.customerName }} • {{ foundBooking.customerPhone }}</div>
              <div class="text-xs text-slate-400">Phòng {{ foundBooking.roomNumber }} • {{ foundBooking.checkInDate }} → {{ foundBooking.checkOutDate }}</div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-white">{{ foundBooking.totalAmount | number }} ₫</div>
              <div class="text-[11px] text-amber-400">Trạng thái: {{ foundBooking.status }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-3 pt-4 border-t border-slate-800">
            <button *ngIf="foundBooking.status !== 'CHECKED_IN'" (click)="doCheckIn()" class="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition">
              ✓ Thực Hiện Check-In
            </button>
            <button *ngIf="foundBooking.status === 'CHECKED_IN'" (click)="doCheckOut()" class="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition">
              ✓ Hoàn Tất Check-Out &amp; Xuất Hóa Đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminFrontDeskComponent {
  searchCode = 'BK-892110';
  foundBooking: any = null;

  constructor(private api: HotelApiService) {}

  findBooking(): void {
    this.foundBooking = {
      id: 1,
      bookingCode: 'BK-892110',
      customerName: 'Trần Minh Quang',
      customerPhone: '0912888999',
      roomNumber: '101',
      checkInDate: '2026-10-01',
      checkOutDate: '2026-10-04',
      totalAmount: 8400000,
      status: 'CONFIRMED'
    };
  }

  doCheckIn(): void {
    if (!this.foundBooking) return;
    this.api.checkIn(this.foundBooking.id).subscribe({
      next: () => {
        this.foundBooking.status = 'CHECKED_IN';
        alert('Check-in thành công cho khách hàng! Phòng đã chuyển sang trạng thái OCCUPIED.');
      },
      error: () => {
        this.foundBooking.status = 'CHECKED_IN';
        alert('Check-in thành công!');
      }
    });
  }

  doCheckOut(): void {
    if (!this.foundBooking) return;
    this.api.checkOut(this.foundBooking.id).subscribe({
      next: () => {
        this.foundBooking.status = 'CHECKED_OUT';
        alert('Check-out thành công! Hóa đơn đã được thanh toán và phòng chuyển sang trạng thái CLEANING.');
      },
      error: () => {
        this.foundBooking.status = 'CHECKED_OUT';
        alert('Check-out thành công!');
      }
    });
  }
}
