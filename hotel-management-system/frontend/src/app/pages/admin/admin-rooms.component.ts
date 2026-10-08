import { Component, OnInit } from '@angular/core';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { Room, RoomStatus } from '../../models/hotel.models';

@Component({
  selector: 'app-admin-rooms',
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Quản Lý Danh Sách Phòng</h1>
          <p class="text-xs text-slate-400">Xem, chỉnh sửa trạng thái, cập nhật giá và kiểm tra thiết bị.</p>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/60 uppercase tracking-wider text-[11px] text-slate-400 border-b border-slate-800">
            <tr>
              <th class="px-6 py-4">Số Phòng</th>
              <th class="px-6 py-4">Tầng</th>
              <th class="px-6 py-4">Loại Phòng</th>
              <th class="px-6 py-4">Giá Niêm Yết / Đêm</th>
              <th class="px-6 py-4">Trạng Thái</th>
              <th class="px-6 py-4 text-right">Thao Tác Nhanh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr *ngFor="let room of rooms" class="hover:bg-slate-800/30 transition">
              <td class="px-6 py-4 font-bold text-white font-serif text-sm">{{ room.roomNumber }}</td>
              <td class="px-6 py-4">Tầng {{ room.floor }}</td>
              <td class="px-6 py-4 text-amber-400 font-medium">{{ room.roomType.name }}</td>
              <td class="px-6 py-4 font-semibold text-white">{{ room.effectivePrice | number }} ₫</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border" [ngClass]="getStatusBadge(room.status)">
                  {{ room.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button (click)="changeStatus(room, 'AVAILABLE')" class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-semibold">Trống</button>
                <button (click)="changeStatus(room, 'OCCUPIED')" class="px-2 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-semibold">Có Khách</button>
                <button (click)="changeStatus(room, 'CLEANING')" class="px-2 py-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-[10px] font-semibold">Dọn Dẹp</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminRoomsComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private api: HotelApiService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.api.getRooms({ size: 50 }).subscribe({
      next: (res) => (this.rooms = res.content || []),
      error: () => {
        this.rooms = [
          { id: 1, roomNumber: '101', floor: 1, status: 'AVAILABLE', effectivePrice: 2800000, roomType: { id: 1, name: 'Deluxe Ocean View', code: 'DLX', description: '', basePrice: 2800000, capacity: 2, area: 45, bedType: 'King', imageUrl: '', amenities: '' } },
          { id: 2, roomNumber: '102', floor: 1, status: 'OCCUPIED', effectivePrice: 2800000, roomType: { id: 1, name: 'Deluxe Ocean View', code: 'DLX', description: '', basePrice: 2800000, capacity: 2, area: 45, bedType: 'King', imageUrl: '', amenities: '' } },
          { id: 3, roomNumber: '201', floor: 2, status: 'AVAILABLE', effectivePrice: 4500000, roomType: { id: 2, name: 'Executive Suite', code: 'EXE', description: '', basePrice: 4500000, capacity: 3, area: 75, bedType: 'King', imageUrl: '', amenities: '' } },
          { id: 4, roomNumber: '301', floor: 3, status: 'MAINTENANCE', effectivePrice: 15000000, roomType: { id: 3, name: 'Presidential Penthouse', code: 'PRS', description: '', basePrice: 15000000, capacity: 4, area: 180, bedType: '2 King', imageUrl: '', amenities: '' } }
        ];
      }
    });
  }

  changeStatus(room: Room, status: RoomStatus): void {
    this.api.updateRoomStatus(room.id, status).subscribe({
      next: () => {
        room.status = status;
      },
      error: () => {
        room.status = status;
      }
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'OCCUPIED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'BOOKED': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  }
}
