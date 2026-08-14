import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserRegistrationData, UserLoginData, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  
  isAuthenticated = signal<boolean>(this.hasToken());
  currentUser = signal<any>(this.getUser());

  constructor() {
    if (this.hasToken()) {
      this.fetchUser().subscribe({
        error: () => this.clearSession()
      });
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  private getUser(): any {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      localStorage.removeItem('auth_user');
      return null;
    }
  }

  register(data: UserRegistrationData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data);
  }

  login(data: UserLoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data);
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.isAuthenticated.set(true);
  }

  setUser(user: any): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  fetchUser(): Observable<any> {
    const token = this.getToken();
    return this.http.get(`${this.baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      // The backend returns { estado: true, mensaje: '...', usuario: {...} }
      // We tap into it to save the user data
      tap((res: any) => {
        if (res.usuario) {
          this.setUser(res.usuario);
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  clearSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
