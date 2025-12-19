import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ApiService, Book, Chart } from '../../services/api';
import { HeaderComponent } from "../header/header";

@Component({
  selector: 'app-chart-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './chart-creator.html',
  styleUrls: ['./chart-creator.css']
})
export class ChartCreatorComponent implements OnInit {
  // Создание чарта
  chartTitle: string = '';
  chartDescription: string = '';
  isPublic: boolean = false;
  chartCoverPreview: string = '';
  selectedCoverFile: File | null = null;
  
  // Поиск книг для добавления
  searchQuery: string = '';
  searchResults: Book[] = [];
  isSearching: boolean = false;
  
  // Книги в чарте
  selectedBooks: Book[] = [];
  
  // Существующие чарты пользователя
  userCharts: Chart[] = [];
  editingChartId: number | null = null;
  
  // UI состояния
  isSaving: boolean = false;
  showBookSearch: boolean = false;
  activeTab: string = 'create'; // 'create' или 'manage'

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserCharts();
    
    // Проверка, если передан bookId в query params
    this.route.queryParams.subscribe(params => {
      if (params['bookId']) {
        const bookId = +params['bookId'];
        this.loadBookForChart(bookId);
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

  loadBookForChart(bookId: number): void {
    this.apiService.getBookById(bookId).subscribe({
      next: (book) => {
        this.selectedBooks.push(book);
        this.showBookSearch = false;
      },
      error: (error) => {
        console.error('Error loading book:', error);
      }
    });
  }

  onCoverChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCoverFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.chartCoverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  searchBooks(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.apiService.searchBooks({ query: this.searchQuery }).subscribe({
      next: (response) => {
        this.searchResults = response.books;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error searching books:', error);
        this.isSearching = false;
      }
    });
  }

  addBookToChart(book: Book): void {
    // Проверка, что книга еще не добавлена
    if (!this.selectedBooks.find(b => b.id === book.id)) {
      this.selectedBooks.push(book);
    }
    this.showBookSearch = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  removeBookFromChart(bookId: number): void {
    this.selectedBooks = this.selectedBooks.filter(b => b.id !== bookId);
  }

  createChart(): void {
    if (!this.chartTitle.trim()) {
      alert('Please enter a chart title.');
      return;
    }

    this.isSaving = true;

    // Создание чарта
    this.apiService.createChart({
      title: this.chartTitle,
      description: this.chartDescription || undefined,
      is_public: this.isPublic
    }).subscribe({
      next: (chart) => {
        // Загрузка обложки, если выбрана
        if (this.selectedCoverFile) {
          this.apiService.uploadChartCover(chart.id, this.selectedCoverFile).subscribe({
            next: () => {
              this.addBooksToChart(chart.id);
            },
            error: (error) => {
              console.error('Error uploading cover:', error);
              this.addBooksToChart(chart.id);
            }
          });
        } else {
          this.addBooksToChart(chart.id);
        }
      },
      error: (error) => {
        console.error('Error creating chart:', error);
        this.isSaving = false;
      }
    });
  }

  addBooksToChart(chartId: number): void {
    if (this.selectedBooks.length === 0) {
      this.isSaving = false;
      this.router.navigate(['/dashboard']);
      return;
    }

    // Добавление всех книг в чарт
    let addedCount = 0;
    this.selectedBooks.forEach(book => {
      this.apiService.addBookToChart(chartId, book.id).subscribe({
        next: () => {
          addedCount++;
          if (addedCount === this.selectedBooks.length) {
            this.isSaving = false;
            console.log('Chart created successfully');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Error adding book to chart:', error);
          addedCount++;
          if (addedCount === this.selectedBooks.length) {
            this.isSaving = false;
            this.router.navigate(['/dashboard']);
          }
        }
      });
    });
  }

  editChart(chart: Chart): void {
    this.editingChartId = chart.id;
    this.chartTitle = chart.title;
    this.chartDescription = chart.description || '';
    this.isPublic = chart.is_public;
    this.selectedBooks = [...chart.books];
    this.chartCoverPreview = chart.cover_image || '';
    this.activeTab = 'create';
  }

  deleteChart(chartId: number): void {
    if (confirm('Are you sure you want to delete this chart?')) {
      this.apiService.deleteChart(chartId).subscribe({
        next: () => {
          this.userCharts = this.userCharts.filter(c => c.id !== chartId);
          console.log('Chart deleted');
        },
        error: (error) => {
          console.error('Error deleting chart:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.chartTitle = '';
    this.chartDescription = '';
    this.isPublic = false;
    this.chartCoverPreview = '';
    this.selectedCoverFile = null;
    this.selectedBooks = [];
    this.editingChartId = null;
  }

  toggleBookSearch(): void {
    this.showBookSearch = !this.showBookSearch;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
}