import { Component, OnInit } from '@angular/core';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { Room } from '../../models/hotel.models';

@Component({
  selector: 'app-home',
  template: `
    <div>
      <!-- Hero Banner -->
      <section class="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center" style="background-image: linear-gradient(rgba(7,11,20,0.65), rgba(7,11,20,0.85)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80');">
        <div class="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div class="inline-block px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            ★ ★ ★ ★ ★ Tuyệt Tác Nghỉ Dưỡng Thượng Lưu
          </div>
          <h1 class="text-4xl sm:text-6xl font-serif font-bold text-white tracking-wide leading-tight">
            Khơi Nguồn Kỳ Nghỉ Hoàn Mỹ Tại <span class="text-amber-400">Aura Grand</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Hòa mình giữa đại dương nguyên sơ và chuẩn mực dịch vụ hoàng gia. Trải nghiệm không gian xa hoa được thiết kế dành riêng cho bạn.
          </p>
          <div class="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a routerLink="/rooms" class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition">
              Khám Phá Phòng &amp; Suites
            </a>
            <a href="#services" class="px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition">
              Dịch Vụ Đẳng Cấp
            </a>
          </div>
        </div>
      </section>

      <!-- Featured Rooms Section -->
      <section class="max-w-7xl mx-auto px-4 py-24">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span class="text-xs uppercase tracking-widest text-amber-500 font-bold">Không Gian Nghỉ Dưỡng</span>
          <h2 class="text-3xl font-serif font-bold text-white">Bộ Sưu Tập Phòng Tiêu Biểu</h2>
          <p class="text-sm text-slate-400">Mỗi căn phòng là một tác phẩm nghệ thuật với tầm nhìn toàn cảnh biển trời Phú Quốc.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div *ngFor="let room of featuredRooms" class="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/40 transition group">
            <div class="h-64 overflow-hidden relative">
              <img [src]="room.imageUrl" [alt]="room.roomNumber" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur text-xs font-semibold text-amber-400 border border-amber-500/30">
                {{ room.roomType.name }}
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex justify-between items-baseline">
                <h3 class="text-xl font-serif font-bold text-white">Phòng {{ room.roomNumber }}</h3>
                <div class="text-right">
                  <span class="text-amber-400 font-bold text-lg">{{ room.effectivePrice | number }} ₫</span>
                  <span class="text-slate-400 text-xs">/đêm</span>
                </div>
              </div>
              <p class="text-xs text-slate-400 line-clamp-2">{{ room.description }}</p>
              <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Tầng {{ room.floor }} • {{ room.roomType.capacity }} Khách</span>
                <a routerLink="/rooms" class="text-amber-400 font-semibold hover:underline">Chi tiết →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services & Spa -->
      <section id="services" class="bg-[#090e1c] py-24 border-y border-white/10">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span class="text-xs uppercase tracking-widest text-amber-500 font-bold">Tiện Nghi 5 Sao</span>
            <h2 class="text-3xl font-serif font-bold text-white">Đặc Quyền Nghỉ Dưỡng</h2>
            <p class="text-sm text-slate-400">Tận hưởng liệu trình Spa hoàng gia, ẩm thực Michelin và đưa đón phi trường miễn phí.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let s of services" class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition">
              <div class="text-2xl mb-4">✨</div>
              <h3 class="font-bold text-white text-base mb-2">{{ s.name }}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">{{ s.description }}</p>
              <div class="mt-4 text-xs font-semibold text-amber-400">{{ s.price | number }} ₫ / {{ s.unit }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  featuredRooms: Room[] = [];
  services: any[] = [];

  constructor(private api: HotelApiService) {}

  ngOnInit(): void {
    this.api.getRooms({ size: 3 }).subscribe({
      next: (res) => {
        this.featuredRooms = res.content || [];
      },
      error: () => {
        // Fallback default mockup preview data
        this.featuredRooms = [
          {
            id: 1,
            roomNumber: '101',
            floor: 1,
            status: 'AVAILABLE',
            effectivePrice: 2800000,
            imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            description: 'Phòng Deluxe Ocean sang trọng hướng trực diện hoàng hôn bãi Dài với ban công ngắm sóng biển.',
            roomType: { id: 1, name: 'Deluxe Ocean View', code: 'DLX-OCN', description: '', basePrice: 2800000, capacity: 2, area: 45, bedType: '1 King Bed', imageUrl: '', amenities: 'Wifi, Bồn tắm' }
          },
          {
            id: 2,
            roomNumber: '201',
            floor: 2,
            status: 'AVAILABLE',
            effectivePrice: 4500000,
            imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            description: 'Executive Suite với không gian phòng khách biệt lập, quầy bar cao cấp và dịch vụ quản gia riêng.',
            roomType: { id: 2, name: 'Executive Suite', code: 'EXE-STE', description: '', basePrice: 4500000, capacity: 3, area: 75, bedType: '1 King Bed + 1 Sofa Bed', imageUrl: '', amenities: 'Quản gia riêng, Bồn sục Jacuzzi' }
          },
          {
            id: 3,
            roomNumber: '301',
            floor: 3,
            status: 'AVAILABLE',
            effectivePrice: 15000000,
            imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
            description: 'Dinh thự tổng thống tầng thượng với bể bơi vô cực riêng ngắm toàn cảnh đại dương Phú Quốc.',
            roomType: { id: 3, name: 'Presidential Penthouse', code: 'PRS-PTH', description: '', basePrice: 15000000, capacity: 4, area: 180, bedType: '2 King Beds', imageUrl: '', amenities: 'Bể bơi vô cực riêng, Bếp đầy đủ, Quản gia' }
          }
        ];
      }
    });

    this.api.getServices().subscribe({
      next: (res) => (this.services = res),
      error: () => {
        this.services = [
          { name: 'Aura Luxury Spa & Wellness', description: 'Liệu trình massage đá nóng Himalaya thải độc và phục hồi năng lượng.', price: 1200000, unit: 'gói 90 phút' },
          { name: 'Ẩm Thực Tinh Hoa Michelin', description: 'Bữa tối lãng mạn trên bãi biển ngắm hoàng hôn với hải sản tươi sống.', price: 2500000, unit: '2 người' },
          { name: 'Đưa Đón Sân Bay Bằng Limousine', description: 'Đón tiễn riêng tư tại sân bay quốc tế Phú Quốc trên xe Maybach/Limousine.', price: 800000, unit: 'chuyến' },
          { name: 'Tour Du Thuyền Hoàng Hôn', description: 'Du ngoạn quần đảo An Thới, câu mực đêm và thưởng thức tiệc cocktail nhẹ.', price: 3200000, unit: 'khách' }
        ];
      }
    });
  }
}
