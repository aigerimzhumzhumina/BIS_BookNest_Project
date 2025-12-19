import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth';
import { ApiService, CurrentBook, FavoriteBook, UserProfile } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header";
import { Book } from '../../services/book';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentBook: CurrentBook | null = null;
  favoriteBooks: FavoriteBook[] = [];
  favouriteBook: Book | null = null;
  isEditMode: boolean = false;
  editUser: Partial<User> = {};

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCurrentBook();
    this.loadFavoriteBooks();
  }
  loadUserData(): void {
    this.apiService.getUserProfile().subscribe({
      next: profile => this.currentUser = profile,
      error: err => console.error('Profile load error', err)
    });
    this.editUser = { ...this.currentUser };
  }

  loadCurrentBook(): void {
    this.apiService.getCurrentBook().subscribe({
      next: bookOrNull => this.currentBook = bookOrNull,
      error: err => console.error('Current book load error', err)
    });
  }

  loadFavoriteBooks(): void {
    this.apiService.getFavoriteBooks().subscribe({
      next: favs => this.favoriteBooks = favs,
      error: err => console.error('Favorite books load error', err)
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
    this.apiService.updateUserProfile(this.editUser).subscribe({
      next: updatedProfile => {
        this.currentUser = updatedProfile;
        this.isEditMode = false;
        console.log('Profile updated successfully', this.editUser);
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
        console.log(`Book with ID ${bookId} removed from favorites`);
        this.favoriteBooks = this.favoriteBooks.filter(book => book.id !== bookId);
      }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
