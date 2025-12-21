import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  genre: string[];
  tropes: string[];
  country: string;
  year: number;
  pages: number;
  rating: number;
  age_rating: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  age?: number;
  city?: string;
  bio?: string;
  joined_date: string;
}

export interface CurrentBook {
  id: number;
  book: Book;
  current_page: number;
  total_pages: number;
  progress: number;
  last_read: string;
}

export interface FavoriteBook {
  id: number;
  book: Book;
  added_date: string;
}

export interface Chart {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  cover_image?: string;
  books: Book[];
  created_date: string;
  is_public: boolean;
}

export interface BookCollection {
  id: number;
  title: string;
  description: string;
  image: string;
  books: Book[];
}

export interface SearchFilters {
  query?: string;
  genres?: string[];
  tropes?: string[];
  countries?: string[];
  year_from?: number;
  year_to?: number;
  age_rating?: string[];
  pages_from?: number;
  pages_to?: number;
  authors?: string[];
  sort_by?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
  // ==================== USER PROFILE ====================
  
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/auth/user/profile/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/auth/user/profile/`, profile, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  uploadAvatar(file: File): Observable<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.post<{ avatar_url: string }>(`${this.apiUrl}/auth/user/avatar/`, formData, {
      headers: headers
    }).pipe(catchError(this.handleError));
  }

  // ==================== CURRENT READING ====================
  
  getCurrentBook(): Observable<CurrentBook | null> {
    return this.http.get<CurrentBook>(`${this.apiUrl}/user/current-book/`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 404) {
          return [null];
        }
        return this.handleError(error);
      })
    );
  }

  updateReadingProgress(bookId: number, currentPage: number): Observable<CurrentBook> {
    return this.http.post<CurrentBook>(`${this.apiUrl}/user/reading-progress/`, {
      book_id: bookId,
      current_page: currentPage
    }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ==================== FAVORITES ====================
  
  getFavoriteBooks(): Observable<FavoriteBook[]> {
    return this.http.get<FavoriteBook[]>(`${this.apiUrl}/user/favorites/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  addToFavorites(bookId: number): Observable<FavoriteBook> {
    return this.http.post<FavoriteBook>(`${this.apiUrl}/user/favorites/`, {
      book_id: bookId
    }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  removeFromFavorites(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/favorites/${bookId}/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  checkIfFavorite(bookId: number): Observable<{ is_favorite: boolean }> {
    return this.http.get<{ is_favorite: boolean }>(`${this.apiUrl}/user/favorites/${bookId}/check/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ==================== BOOKS ====================
  
  getBooks(page: number = 1, pageSize: number = 20): Observable<{ books: Book[], total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<{ books: Book[], total: number }>(`${this.apiUrl}/books/`, {
      params: params
    }).pipe(catchError(this.handleError));
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  searchBooks(filters: SearchFilters, page: number = 1, pageSize: number = 20): Observable<{ books: Book[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (filters.query) {
      params = params.set('query', filters.query);
    }
    if (filters.genres && filters.genres.length > 0) {
      params = params.set('genres', filters.genres.join(','));
    }
    if (filters.tropes && filters.tropes.length > 0) {
      params = params.set('tropes', filters.tropes.join(','));
    }
    if (filters.countries && filters.countries.length > 0) {
      params = params.set('countries', filters.countries.join(','));
    }
    if (filters.year_from) {
      params = params.set('year_from', filters.year_from.toString());
    }
    if (filters.year_to) {
      params = params.set('year_to', filters.year_to.toString());
    }
    if (filters.age_rating && filters.age_rating.length > 0) {
      params = params.set('age_rating', filters.age_rating.join(','));
    }
    if (filters.pages_from) {
      params = params.set('pages_from', filters.pages_from.toString());
    }
    if (filters.pages_to) {
      params = params.set('pages_to', filters.pages_to.toString());
    }
    if (filters.authors && filters.authors.length > 0) {
      params = params.set('authors', filters.authors.join(','));
    }
    if (filters.sort_by) {
      params = params.set('sort_by', filters.sort_by);
    }

    return this.http.get<{ books: Book[], total: number }>(`${this.apiUrl}/books/search/`, {
      params: params
    }).pipe(catchError(this.handleError));
  }

  // ==================== COLLECTIONS ====================
  
  getCollections(): Observable<BookCollection[]> {
    return this.http.get<BookCollection[]>(`${this.apiUrl}/collections/`).pipe(
      catchError(this.handleError)
    );
  }

  getCollectionById(id: number): Observable<BookCollection> {
    return this.http.get<BookCollection>(`${this.apiUrl}/collections/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== CHARTS (User Playlists) ====================
  
  getUserCharts(): Observable<Chart[]> {
    return this.http.get<Chart[]>(`${this.apiUrl}/user/charts/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getChartById(id: number): Observable<Chart> {
    return this.http.get<Chart>(`${this.apiUrl}/user/charts/${id}/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  createChart(chart: { title: string, description?: string, is_public?: boolean }): Observable<Chart> {
    return this.http.post<Chart>(`${this.apiUrl}/user/charts/`, chart, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateChart(id: number, chart: Partial<Chart>): Observable<Chart> {
    return this.http.patch<Chart>(`${this.apiUrl}/user/charts/${id}/`, chart, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteChart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/charts/${id}/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  addBookToChart(chartId: number, bookId: number): Observable<Chart> {
    return this.http.post<Chart>(`${this.apiUrl}/user/charts/${chartId}/books/`, {
      book_id: bookId
    }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  removeBookFromChart(chartId: number, bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/charts/${chartId}/books/${bookId}/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  uploadChartCover(chartId: number, file: File): Observable<{ cover_url: string }> {
    const formData = new FormData();
    formData.append('cover', file);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.post<{ cover_url: string }>(`${this.apiUrl}/user/charts/${chartId}/cover/`, formData, {
      headers: headers
    }).pipe(catchError(this.handleError));
  }

  // ==================== FILTERS DATA ====================
  
  getGenres(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/genres/`).pipe(
      catchError(this.handleError)
    );
  }

  getTropes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/tropes/`).pipe(
      catchError(this.handleError)
    );
  }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/countries/`).pipe(
      catchError(this.handleError)
    );
  }

  getAuthors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/filters/authors/`).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== COMMENTS ====================
  
  getBookComments(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books/${bookId}/comments/`).pipe(
      catchError(this.handleError)
    );
  }

  addComment(bookId: number, comment: string, rating?: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/books/${bookId}/comments/`, {
      comment: comment,
      rating: rating
    }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }
}
