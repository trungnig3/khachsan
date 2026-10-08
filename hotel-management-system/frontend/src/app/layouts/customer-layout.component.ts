import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  template: `
    <div class="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans">
      <!-- Luxury Navigation Bar -->
      <header class="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <!-- Logo & Brand -->
          <a routerLink="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-serif font-black text-xl shadow-lg shadow-amber-500/20">
              A
            </div>
            <div>
              <div class="text-xl font-serif font-bold tracking-widest text-white group-hover:text-amber-400 transition">AURA GRAND</div>
              <div class="text-[10px] tracking-[0.25em] text-amber-500 font-medium">LUXURY RESORT &amp; SUITES</div>
            </div>
          </a>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-amber-400" [routerLinkActiveOptions]="{exact: true}" class="hover:text-amber-400 transition">Trang chủ</a>
            <a routerLink="/rooms" routerLinkActive="text-amber-400" class="hover:text-amber-400 transition">Bộ sưu tập phòng</a>
            <a href="#services" class="hover:text-amber-400 transition">Dịch vụ &amp; Spa</a>
            <a href="#promotions" class="hover:text-amber-400 transition">Ưu đãi</a>
            <a href="#reviews" class="hover:text-amber-400 transition">Đánh giá</a>
          </nav>

          <!-- User / Portal Actions -->
          <div class="flex items-center space-x-4">
            <ng-container *ngIf="authService.currentUser$ | async as user; else guestTpl">
              <span class="text-xs text-slate-300 hidden sm:inline">Xin chào, <strong class="text-amber-400">{{ user.fullName }}</strong></span>
              <a *ngIf="authService.isStaff()" routerLink="/admin/dashboard" class="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold tracking-wide transition shadow">
                Quản trị Resort
              </a>
              <button (click)="logout()" class="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-xs font-medium text-slate-300 transition">
                Đăng xuất
              </button>
            </ng-container>
            <ng-template #guestTpl>
              <a routerLink="/auth/login" class="px-4 py-2 rounded-xl text-xs font-semibold text-white border border-white/20 hover:border-amber-400/50 hover:bg-white/5 transition">
                Đăng nhập
              </a>
              <a routerLink="/rooms" class="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition">
                Đặt phòng ngay
              </a>
            </ng-template>
          </div>
        </div>
      </header>

      <!-- Main Body Router Outlet -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-black/80 border-t border-white/10 py-12 text-slate-400 text-sm">
        <div class="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div class="text-amber-400 font-serif text-lg tracking-widest">AURA GRAND LUXURY RESORT</div>
          <p class="text-xs text-slate-500">Đại lộ Hoàng Hôn, Bãi Dài, Phú Quốc, Kiên Giang, Việt Nam | Hotline: +84 (0) 297 3888 999</p>
          <p class="text-xs text-slate-600">© 2026 Aura Grand Hotel &amp; Resort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class CustomerLayoutComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
