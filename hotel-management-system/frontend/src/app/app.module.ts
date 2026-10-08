import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Interceptors & Guards
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthGuard } from './core/guards/auth.guard';

// Layouts
import { CustomerLayoutComponent } from './layouts/customer-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';

// Customer Pages
import { HomeComponent } from './pages/customer/home.component';
import { RoomCatalogComponent } from './pages/customer/room-catalog.component';

// Auth Pages
import { LoginComponent } from './pages/auth/login.component';

// Admin Pages
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminRoomsComponent } from './pages/admin/admin-rooms.component';
import { AdminBookingsComponent } from './pages/admin/admin-bookings.component';
import { AdminFrontDeskComponent } from './pages/admin/admin-frontdesk.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerLayoutComponent,
    AdminLayoutComponent,
    HomeComponent,
    RoomCatalogComponent,
    LoginComponent,
    AdminDashboardComponent,
    AdminRoomsComponent,
    AdminBookingsComponent,
    AdminFrontDeskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
