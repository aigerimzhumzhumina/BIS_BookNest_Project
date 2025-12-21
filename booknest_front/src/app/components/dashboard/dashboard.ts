import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth';
import { ApiService, CurrentBook, FavoriteBook, UserProfile, Chart } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header";
import { Book } from '../../services/book';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { MediaUrlPipe } from '../../pipes/media-url-pipe';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, TranslatePipe, MediaUrlPipe]
})
export class DashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;
  currentBook: CurrentBook | null = null;
  favoriteBooks: FavoriteBook[] = [];
  favouriteBook: Book | null = null;
  userChart: Chart[] = [];
  isEditMode: boolean = false;
  isLoadingProfile: boolean = true;
  isLoadingCurrentBook: boolean = true;
  isLoadingFavorites: boolean = true;
  isLoadingCharts = true;
  editUser: Partial<User> = {};


  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCurrentBook();
    this.loadFavoriteBooks();
    this.loadUserCharts();
  }
  loadUserData(): void {
    this.isLoadingProfile = true;
    
    this.apiService.getUserProfile().subscribe({
      next: (profile) => {
        this.currentUser = {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar || 'assets/avatars/default-avatar.png',
          age: profile.age,
          city: profile.city,
          bio: profile.bio,
          joined_date: profile.joined_date
        };
        this.editUser = { ...this.currentUser };
        this.isLoadingProfile = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        
        // Если профиль не найден, создаем шаблонный
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          this.currentUser = {
            id: currentUser.id || 0,
            username: currentUser.username,
            email: currentUser.email,
            avatar: 'assets/avatars/default-avatar.png',
            joined_date: new Date().toISOString().split('T')[0]
          };
          this.editUser = { ...this.currentUser };
        }
        this.isLoadingProfile = false;
      }
    });
  }

  loadCurrentBook(): void {
    this.isLoadingCurrentBook = true;
    
    this.apiService.getCurrentBook().subscribe({
      next: (book) => {
        this.currentBook = book;
        this.isLoadingCurrentBook = false;
      },
      error: (error) => {
        console.error('Error loading current book:', error);
        this.currentBook = null;
        this.isLoadingCurrentBook = false;
      }
    });
  }

  loadFavoriteBooks(): void {
    this.isLoadingFavorites = true;
    
    this.apiService.getFavoriteBooks().subscribe({
      next: (favorites) => {
        this.favoriteBooks = favorites;
        this.isLoadingFavorites = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.favoriteBooks = [];
        this.isLoadingFavorites = false;
      }
    });
  }

  loadUserCharts(): void {
    this.isLoadingCharts = true;
    
    this.apiService.getUserCharts().subscribe({
      next: (charts) => {
        this.userChart = charts;
        this.isLoadingCharts = false;
      },
      error: (error) => {
        console.error('Error loading charts:', error);
        this.userChart = [];
        this.isLoadingCharts = false;
      }
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Отмена изменений
      this.editUser = { ...this.currentUser! };
    }
    this.isEditMode = !this.isEditMode;
  }

  saveProfile(): void {
    if (!this.currentUser) return;
    
    // Отправка обновленных данных на бэкенд
    this.apiService.updateUserProfile(this.editUser).subscribe({
      next: (updatedProfile) => {
        this.currentUser = {
          ...this.currentUser!,
          username: updatedProfile.username,
          email: updatedProfile.email,
          avatar: updatedProfile.avatar || this.editUser.avatar || 'assets/avatars/default-avatar.png',
          age: updatedProfile.age,
          city: updatedProfile.city,
          bio: updatedProfile.bio,
          joined_date: updatedProfile.joined_date
        };
        this.editUser = { ...this.currentUser };
        this.isEditMode = false;
        console.log('User profile updated successfully!');
      },
      error: (error) => {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
      }
    });
  }


  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please, select a valid image file.');
      return;
  }
    const maxSize = 5 * 1024 * 1024; // 5MB в байтах
    if (file.size > maxSize) {
      alert('The selected file is too large. Maximum size is 5MB.');
      return;
    }

    // Показываем preview локально (для мгновенной обратной связи)
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Временно показываем локальный preview
      const newAvatarUrl = e.target.result;
      if (this.editUser) {
        this.editUser.avatar = newAvatarUrl;
      }
      if (this.currentUser) {
        this.currentUser.avatar = newAvatarUrl;
      }
    };
    reader.readAsDataURL(file);
    
    // Загружаем на сервер
    this.apiService.uploadAvatar(file).subscribe({
      next: (response) => {
        console.log('Avatar uploaded successfully:', response);
        // Обновляем с URL от сервера
        if (this.currentUser && this.editUser) {
          this.currentUser.avatar = response.avatar_url;
          this.editUser.avatar = response.avatar_url;
        }
        this.currentUser = { ...this.currentUser! };
      },
      error: (error) => {
        console.error('Error uploading avatar:', error);
        alert('Error uploading avatar. Please try again.');
        // Возвращаем старый аватар в случае ошибки
        if (this.currentUser && this.editUser) {
          this.editUser.avatar = this.currentUser.avatar;
        }
      }
    });
  }

  onImageError(event: any): void {
    console.log('Image failed to load, using fallback');
    event.target.src = 'assets/avatars/default-avatar.png';
    event.target.src = 'assets/books/placeholder-book.svg';
  }
  
  continueReading(): void {
    if (this.currentBook) {
      this.router.navigate(['/book', this.currentBook.id]);
    }
  }

  navigateToBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  removeFromFavorites(bookId: number): void {
    this.apiService.removeFromFavorites(bookId).subscribe({
      next: () => {
        this.favoriteBooks = this.favoriteBooks.filter(fav => fav.book.id !== bookId);
        console.log('Removed from favorites');
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
      }
    });
  }

  navigateToChart(chartId: number): void {
    this.router.navigate(['/chart', chartId]);
  }

  deleteChart(chartId: number): void {
    if (confirm('Вы уверены, что хотите удалить этот чарт?')) {
      this.apiService.deleteChart(chartId).subscribe({
        next: () => {
          this.userChart = this.userChart.filter(chart => chart.id !== chartId);
          console.log('Chart deleted');
        },
        error: (error) => {
          console.error('Error deleting chart:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
