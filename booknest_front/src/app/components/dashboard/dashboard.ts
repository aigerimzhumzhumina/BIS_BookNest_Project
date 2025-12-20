import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth';
import { ApiService, CurrentBook, FavoriteBook, UserProfile } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header";
import { Book } from '../../services/book';
import { TranslatePipe } from '../../pipes/translate-pipe';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, TranslatePipe]
})
export class DashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;
  currentBook: CurrentBook | null = null;
  favoriteBooks: FavoriteBook[] = [];
  favouriteBook: Book | null = null;
  isEditMode: boolean = false;
  isLoadingProfile: boolean = true;
  isLoadingCurrentBook: boolean = true;
  isLoadingFavorites: boolean = true;
  editUser: Partial<User> = {};


  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCurrentBook();
    this.loadFavoriteBooks();
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
          avatar: updatedProfile.avatar || this.currentUser!.avatar,
          age: updatedProfile.age,
          city: updatedProfile.city,
          bio: updatedProfile.bio,
          joined_date: updatedProfile.joined_date
        };
        this.isEditMode = false;
        console.log('User profile updated successfully!');
      },
      error: (error) => {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
      }
    });
  }

  /*
  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editUser.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Здесь также нужно отправить файл на бэкенд
      // Например: this.apiService.uploadAvatar(file).subscribe(...)
    }
  }
  */
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

  logout(): void {
    this.authService.logout();
  }
}
