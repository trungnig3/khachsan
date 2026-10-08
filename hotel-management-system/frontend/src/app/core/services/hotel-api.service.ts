import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room, RoomType, Booking, DashboardStats } from '../../models/hotel.models';

@Injectable({
  providedIn: 'root'
})
export class HotelApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Rooms
  getRooms(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<any>(`${this.base}/rooms`, { params: httpParams });
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.base}/rooms/${id}`);
  }

  createRoom(room: any): Observable<Room> {
    return this.http.post<Room>(`${this.base}/rooms`, room);
  }

  updateRoom(id: number, room: any): Observable<Room> {
    return this.http.put<Room>(`${this.base}/rooms/${id}`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/rooms/${id}`);
  }

  updateRoomStatus(id: number, status: string): Observable<Room> {
    return this.http.patch<Room>(`${this.base}/rooms/${id}/status?status=${status}`, {});
  }

  // Room Types
  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.base}/room-types`);
  }

  // Bookings
  createBooking(booking: any): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings`, booking);
  }

  getBookings(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<any>(`${this.base}/bookings`, { params: httpParams });
  }

  checkIn(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings/${id}/check-in`, {});
  }

  checkOut(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings/${id}/check-out`, {});
  }

  cancelBooking(id: number, reason: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}`, {});
  }

  getMyBookings(email: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/bookings/my-bookings?email=${encodeURIComponent(email)}`);
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard/statistics`);
  }

  // Services & Promotions & Reviews
  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/services`);
  }

  getPromotions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/promotions`);
  }

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/reviews`);
  }
}
