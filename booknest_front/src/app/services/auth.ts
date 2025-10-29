import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Django backend URL - ADD TRAILING SLASHES TO ENDPOINTS
  private apiUrl = 'http://localhost:8000/api/auth';
  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(user: User): Observable<AuthResponse> {
    // ADD TRAILING SLASH to register endpoint
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, {
      username: user.username,
      email: user.email,
      password: user.password
    }).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // ADD TRAILING SLASH to login endpoint
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, { 
      email, 
      password 
    }).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    const token = localStorage.getItem('token');
    
    // Optional: Call backend logout endpoint
    if (token) {
      // ADD TRAILING SLASH to logout endpoint
      this.http.post(`${this.apiUrl}/logout/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: () => console.log('Logged out from backend'),
        error: (error) => console.error('Logout error:', error)
      });
    }
    
    // Clear local storage and state
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Optional: Add profile method with trailing slash
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/`);
  }
}