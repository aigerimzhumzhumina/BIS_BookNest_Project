import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService, Book, SearchFilters } from '../../services/api';
import { HeaderComponent } from "../header/header";
import { TranslatePipe } from '../../pipes/translate-pipe';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, TranslatePipe],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  isLoading: boolean = false;
  showFilters: boolean = false;
  
  // Доступные фильтры
  availableGenres: string[] = [];
  availableTropes: string[] = [];
  availableCountries: string[] = [];
  availableAuthors: string[] = [];
  availableYears: number[] = [];
  availableAgeRatings: string[] = ['0+', '6+', '12+', '16+', '18+'];
  
  // Выбранные фильтры
  selectedGenres: string[] = [];
  selectedTropes: string[] = [];
  selectedCountries: string[] = [];
  selectedAuthors: string[] = [];
  selectedAgeRatings: string[] = [];
  yearFrom: number | null = null;
  yearTo: number | null = null;
  pagesFrom: number | null = null;
  pagesTo: number | null = null;
  
  sortBy: string = 'rating'; // 'rating', 'title', 'year', 'pages'
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 20;
  totalBooks: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFiltersData();
    this.searchBooks();
  }

  loadFiltersData(): void {
    this.apiService.getGenres().subscribe({
      next: (genres) => this.availableGenres = genres,
      error: (error) => console.error('Error loading genres:', error)
    });

    this.apiService.getTropes().subscribe({
      next: (tropes) => this.availableTropes = tropes,
      error: (error) => console.error('Error loading tropes:', error)
    });

    this.apiService.getCountries().subscribe({
      next: (countries) => this.availableCountries = countries,
      error: (error) => console.error('Error loading countries:', error)
    });

    this.apiService.getAuthors().subscribe({
      next: (authors) => this.availableAuthors = authors,
      error: (error) => console.error('Error loading authors:', error)
    });
    
    // Генерация списка годов (например, с 1800 по текущий год)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1800; year--) {
      this.availableYears.push(year);
    }
  }

  searchBooks(): void {
    this.isLoading = true;
    
    const filters: SearchFilters = {
      query: this.searchQuery || undefined,
      genres: this.selectedGenres.length > 0 ? this.selectedGenres : undefined,
      tropes: this.selectedTropes.length > 0 ? this.selectedTropes : undefined,
      countries: this.selectedCountries.length > 0 ? this.selectedCountries : undefined,
      authors: this.selectedAuthors.length > 0 ? this.selectedAuthors : undefined,
      age_rating: this.selectedAgeRatings.length > 0 ? this.selectedAgeRatings : undefined,
      year_from: this.yearFrom || undefined,
      year_to: this.yearTo || undefined,
      pages_from: this.pagesFrom || undefined,
      pages_to: this.pagesTo || undefined,
      sort_by: this.sortBy
    };

    this.apiService.searchBooks(filters, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.books = response.books;
        this.totalBooks = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchInput(): void {
    this.currentPage = 1;
    this.searchBooks();
  }

  toggleFilter(filterArray: string[], value: string): void {
    const index = filterArray.indexOf(value);
    if (index > -1) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(value);
    }
    this.currentPage = 1;
    this.searchBooks();
  }

  isFilterSelected(filterArray: string[], value: string): boolean {
    return filterArray.includes(value);
  }

  clearAllFilters(): void {
    this.selectedGenres = [];
    this.selectedTropes = [];
    this.selectedCountries = [];
    this.selectedAuthors = [];
    this.selectedAgeRatings = [];
    this.yearFrom = null;
    this.yearTo = null;
    this.pagesFrom = null;
    this.pagesTo = null;
    this.searchQuery = '';
    this.currentPage = 1;
    this.searchBooks();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.searchBooks();
  }

  navigateToBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  toggleFiltersPanel(): void {
    this.showFilters = !this.showFilters;
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalBooks) {
      this.currentPage++;
      this.searchBooks();
      window.scrollTo(0, 0);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchBooks();
      window.scrollTo(0, 0);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalBooks / this.pageSize);
  }
}
