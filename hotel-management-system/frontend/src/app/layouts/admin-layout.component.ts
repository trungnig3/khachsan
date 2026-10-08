import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      <!-- Admin Sidebar -->
      <aside class="w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col shrink-0">
        <div class="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold font-serif">
            A
          </div>
          <div>
            <div class="font-serif font-bold text-sm tracking-wide text-white">AURA GRAND</div>
            <div class="text-[10px] text-amber-400 tracking-wider font-semibold">PORTAL QUẢN TRỊ</div>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1 text-sm font-medium">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-amber-500/10 text-amber-400 border-l-2 border-amber-500" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
            📊 Tổng quan Dashboard
          </a>
          <a routerLink="/admin/rooms" routerLinkActive="bg-amber-500/10 text-amber-400 border-l-2 border-amber-500" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
            🛏️ Quản lý phòng
          </a>
          <a routerLink="/admin/bookings" routerLinkActive="bg-amber-500/10 text-amber-400 border-l-2 border-amber-500" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
            📋 Đơn đặt phòng
          </a>
          <a routerLink="/admin/front-desk" routerLinkActive="bg-amber-500/10 text-amber-400 border-l-2 border-amber-500" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
            🛎️ Lễ tân &amp; Check-in/out
          </a>
          <a routerLink="/" class="flex items-center px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-amber-400 transition mt-6">
            🌐 Xem trang khách hàng
          </a>
        </nav>

        <div class="p-4 border-t border-slate-800">
          <button (click)="logout()" class="w-full flex items-center justify-center px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition">
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      <!-- Main Admin Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header class="h-16 bg-[#0a0f1d]/80 border-b border-slate-800 px-8 flex items-center justify-between">
          <div class="text-sm text-slate-400">Hệ Thống Quản Lý Khách Sạn &amp; Resort 5 Sao</div>
          <div class="flex items-center space-x-3 text-xs">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-slate-300">Server Status: <strong class="text-emerald-400">ONLINE (Spring Boot 3)</strong></span>
          </div>
        </header>
        <div class="p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
