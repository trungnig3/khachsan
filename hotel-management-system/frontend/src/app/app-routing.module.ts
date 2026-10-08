import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CustomerLayoutComponent } from './layouts/customer-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { HomeComponent } from './pages/customer/home.component';
import { RoomCatalogComponent } from './pages/customer/room-catalog.component';
import { LoginComponent } from './pages/auth/login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminRoomsComponent } from './pages/admin/admin-rooms.component';
import { AdminBookingsComponent } from './pages/admin/admin-bookings.component';
import { AdminFrontDeskComponent } from './pages/admin/admin-frontdesk.component';

export const routes: Routes = [
  // Customer Experience Routes
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'rooms', component: RoomCatalogComponent }
    ]
  },
  // Auth Routes
  { path: 'auth/login', component: LoginComponent },
  // Admin & Staff SaaS Operations Portal
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_STAFF'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'rooms', component: AdminRoomsComponent },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'front-desk', component: AdminFrontDeskComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
