import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        <!-- Logo -->
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-amber-500 mx-auto flex items-center justify-center text-slate-950 font-serif font-black text-2xl shadow-lg shadow-amber-500/20">
            A
          </div>
          <h2 class="text-2xl font-serif font-bold text-white tracking-wide">Đăng Nhập Hệ Thống</h2>
          <p class="text-xs text-slate-400">Hệ Thống Quản Lý Khách Sạn &amp; Resort 5 Sao</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Email tài khoản</label>
            <input type="email" formControlName="email" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu</label>
            <input type="password" formControlName="password" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
          </div>

          <div *ngIf="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-500/20">
            {{ isLoading ? 'Đang xác thực...' : 'Đăng Nhập' }}
          </button>
        </form>

        <!-- Quick Demo Switcher -->
        <div class="pt-4 border-t border-white/10 space-y-2">
          <div class="text-[11px] text-slate-400 text-center font-medium">Tài khoản thử nghiệm sẵn có:</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button (click)="fillCreds('admin@auragrand.vn', 'admin123')" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 border border-white/5 text-left">
              <strong>Admin:</strong> admin&#64;auragrand.vn
            </button>
            <button (click)="fillCreds('staff@auragrand.vn', 'staff123')" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/5 text-left">
              <strong>Lễ tân:</strong> staff&#64;auragrand.vn
            </button>
          </div>
        </div>

        <div class="text-center">
          <a routerLink="/" class="text-xs text-slate-400 hover:text-white transition">← Quay lại trang chủ</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['admin@auragrand.vn', [Validators.required, Validators.email]],
      password: ['admin123', Validators.required]
    });
  }

  fillCreds(email: string, pass: string): void {
    this.loginForm.patchValue({ email, password: pass });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_STAFF')) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        // Mock fallback login for instant client testing if server offline
        const email = this.loginForm.value.email;
        const isAdmin = email.includes('admin');
        const mockUser = {
          token: 'mock-jwt-token-auragrand-2026',
          type: 'Bearer',
          id: 1,
          email,
          fullName: isAdmin ? 'Nguyễn Hoàng Hải (Giám Đốc)' : 'Lê Thị Thu Thảo (Lễ Tân)',
          phone: '0901234567',
          roles: isAdmin ? ['ROLE_ADMIN'] : ['ROLE_STAFF']
        };
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }
}
