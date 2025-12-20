import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header";
import { TranslatePipe } from '../../pipes/translate-pipe';
interface BookCollection {
  id: number;
  title: string;
  description: string;
  image: string;
  books: Book[];
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  collections: BookCollection[] = [];
  selectedCollection: BookCollection | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    // Здесь - запрос к бэкенду
    // Пока используем моковые данные
    this.collections = [
      {
        id: 1,
        title: 'Bestsellers 2025',
        description: 'The most popular books of the year',
        image: 'assets/collections/bestsellers.jpg',
        books: [
          { id: 1, title: 'Sunrise on the Reaping', author: 'Suzanne Collins', cover: 'assets/books/book1.jpg', rating: 4.8 },
          { id: 2, title: 'My Friends', author: 'Fredrik Backman', cover: 'assets/books/book2.jpg', rating: 4.6 }
        ]
      },
      {
        id: 2,
        title: 'CLassics',
        description: 'Eternal works of world literature',
        image: 'assets/collections/classics.jpg',
        books: []
      },
      {
        id: 3,
        title: 'Fantastics',
        description: 'The best science fiction works',
        image: 'assets/collections/scifi.jpg',
        books: []
      }
    ];
  }

  openCollection(collection: BookCollection): void {
    this.selectedCollection = collection;
  }

  closeCollection(): void {
    this.selectedCollection = null;
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

}
