import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService, Book } from '../../services/api';
import { HeaderComponent } from "../header/header";

interface Comment {
  id: number;
  user: {
    username: string;
    avatar: string;
  };
  comment: string;
  rating?: number;
  created_date: string;
}

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  isLoading: boolean = true;
  isFavorite: boolean = false;
  isAddingToFavorite: boolean = false;
  
  // Комментарии
  comments: Comment[] = [];
  newComment: string = '';
  newRating: number = 0;
  isSubmittingComment: boolean = false;
  
  // Чарты пользователя для добавления книги
  userCharts: any[] = [];
  showChartSelector: boolean = false;
  selectedChartId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const bookId = +params['id'];
      if (bookId) {
        this.loadBookDetails(bookId);
        this.checkIfFavorite(bookId);
        this.loadComments(bookId);
        this.loadUserCharts();
      }
    });
  }

  loadBookDetails(bookId: number): void {
    this.isLoading = true;
    this.apiService.getBookById(bookId).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.isLoading = false;
      }
    });
  }

  checkIfFavorite(bookId: number): void {
    this.apiService.checkIfFavorite(bookId).subscribe({
      next: (response) => {
        this.isFavorite = response.is_favorite;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      }
    });
  }

  loadComments(bookId: number): void {
    this.apiService.getBookComments(bookId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      }
    });
  }

  loadUserCharts(): void {
    this.apiService.getUserCharts().subscribe({
      next: (charts) => {
        this.userCharts = charts;
      },
      error: (error) => {
        console.error('Error loading user charts:', error);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.book) return;
    
    this.isAddingToFavorite = true;
    
    if (this.isFavorite) {
      // Удалить из избранного
      this.apiService.removeFromFavorites(this.book.id).subscribe({
        next: () => {
          this.isFavorite = false;
          this.isAddingToFavorite = false;
          console.log('Removed from favorites');
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
          this.isAddingToFavorite = false;
        }
      });
    } else {
      // Добавить в избранное
      this.apiService.addToFavorites(this.book.id).subscribe({
        next: () => {
          this.isFavorite = true;
          this.isAddingToFavorite = false;
          console.log('Added to favorites');
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
          this.isAddingToFavorite = false;
        }
      });
    }
  }

  startReading(): void {
    if (!this.book) return;
    
    // Обновление прогресса чтения
    this.apiService.updateReadingProgress(this.book.id, 1).subscribe({
      next: () => {
        // Переход к странице чтения (это может быть отдельный компонент для чтения)
        console.log('Starting to read:', this.book?.title);
        // this.router.navigate(['/read', this.book.id]);
      },
      error: (error) => {
        console.error('Error starting reading:', error);
      }
    });
  }

  setRating(rating: number): void {
    this.newRating = rating;
  }

  submitComment(): void {
    if (!this.book || !this.newComment.trim()) return;
    
    this.isSubmittingComment = true;
    
    this.apiService.addComment(this.book.id, this.newComment, this.newRating || undefined).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.newComment = '';
        this.newRating = 0;
        this.isSubmittingComment = false;
      },
      error: (error) => {
        console.error('Error submitting comment:', error);
        this.isSubmittingComment = false;
      }
    });
  }

  toggleChartSelector(): void {
    this.showChartSelector = !this.showChartSelector;
  }

  addToChart(chartId: number): void {
    if (!this.book) return;
    
    this.apiService.addBookToChart(chartId, this.book.id).subscribe({
      next: () => {
        console.log('Book added to chart');
        this.showChartSelector = false;
        this.selectedChartId = chartId;
      },
      error: (error) => {
        console.error('Error adding book to chart:', error);
      }
    });
  }

  createNewChart(): void {
    this.router.navigate(['/create-chart'], {
      queryParams: { bookId: this.book?.id }
    });
  }

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars ? 'full' : 'empty');
    }
    return stars;
  }

  getCommentStars(rating: number): string[] {
    return this.getStars(rating);
  }
}
