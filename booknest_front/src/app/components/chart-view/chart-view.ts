import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService, Chart } from '../../services/api';
import { MediaUrlPipe } from '../../pipes/media-url-pipe';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { HeaderComponent } from "../header/header";

@Component({
  selector: 'app-chart-view',
  standalone: true,
  imports: [CommonModule, RouterModule, MediaUrlPipe, TranslatePipe, HeaderComponent],
  templateUrl: './chart-view.html',
  styleUrls: ['./chart-view.css']
})
export class ChartViewComponent implements OnInit {
  chart: Chart | null = null;
  isLoading: boolean = true;
  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const chartId = +params['id'];
      if (chartId) {
        this.loadChart(chartId);
      }
    });
  }

  loadChart(chartId: number): void {
    this.isLoading = true;
    
    this.apiService.getChartById(chartId).subscribe({
      next: (chart) => {
        this.chart = chart;
        this.isLoading = false;
        // Проверка, является ли текущий пользователь владельцем
        // (можно добавить поле owner_id в Chart интерфейс)
        this.isOwner = true; // Временно, пока не добавите проверку
      },
      error: (error) => {
        console.error('Error loading chart:', error);
        this.isLoading = false;
      }
    });
  }

  navigateToBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  editChart(): void {
    if (this.chart) {
      this.router.navigate(['/create-chart'], {
        queryParams: { chartId: this.chart.id }
      });
    }
  }

  deleteChart(): void {
    if (!this.chart) return;
    
    if (confirm('Вы уверены, что хотите удалить этот чарт?')) {
      this.apiService.deleteChart(this.chart.id).subscribe({
        next: () => {
          console.log('Chart deleted');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error deleting chart:', error);
        }
      });
    }
  }

  onImageError(event: any): void {
    event.target.src = 'assets/books/placeholder-book.svg';
  }
}