import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
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
  private apiUrl = 'http://localhost:3000/api';
  private useMock = true; // ← Временный флаг для мок-данных

  // Храним "базу данных" в localStorage
  private get usersDB(): User[] {
    return JSON.parse(localStorage.getItem('mockUsersDB') || '[]');
  }

  private set usersDB(users: User[]) {
    localStorage.setItem('mockUsersDB', JSON.stringify(users));
  }

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
    if (this.useMock) {
      return this.mockRegister(user);
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    if (this.useMock) {
      return this.mockLogin(email, password);
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token || '');
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  // Мок-регистрация
  private mockRegister(user: User): Observable<AuthResponse> {
    return new Observable(observer => {
      // Имитируем задержку сети
      setTimeout(() => {
        const users = this.usersDB;
        
        // Проверяем, нет ли уже пользователя с таким email
        const existingUser = users.find(u => u.email === user.email);
        if (existingUser) {
          observer.next({
            success: false,
            message: 'Пользователь с таким email уже существует'
          });
        } else {
          // Создаем нового пользователя
          const newUser: User = {
            ...user,
            id: Date.now() // Простой ID на основе времени
          };
          
          // Сохраняем в "базу данных"
          users.push(newUser);
          this.usersDB = users;
          
          observer.next({
            success: true,
            message: 'Регистрация успешна!',
            token: 'mock-jwt-token-' + Date.now(),
            user: newUser
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  // Мок-авторизация
  private mockLogin(email: string, password: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.usersDB;
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Сохраняем в localStorage как залогиненного пользователя
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
          this.currentUserSubject.next(user);
          
          observer.next({
            success: true,
            message: 'Вход выполнен успешно!',
            token: 'mock-jwt-token-' + Date.now(),
            user: user
          });
        } else {
          observer.next({
            success: false,
            message: 'Неверный email или пароль'
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Метод для очистки мок-базы (для тестирования)
  clearMockDB(): void {
    localStorage.removeItem('mockUsersDB');
    console.log('Mock база данных очищена');
  }
}
/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
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
  private apiUrl = 'http://localhost:3000/api';

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
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token || '');
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
*/