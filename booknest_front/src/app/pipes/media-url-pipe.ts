import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mediaUrl',
  standalone: true
})
export class MediaUrlPipe implements PipeTransform {
  private mediaUrl = 'http://localhost:8000'; // Должен совпадать с вашим Django сервером

  transform(relativePath: string | undefined): string {
    if (!relativePath) {
      return 'assets/books/placeholder-book.svg';
    }
    
    // Если путь уже полный URL
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    
    // Если путь начинается с /media или /static
    if (relativePath.startsWith('/media') || relativePath.startsWith('/static')) {
      return `${this.mediaUrl}${relativePath}`;
    }
    
    // Если путь относительный
    if (relativePath.startsWith('media/') || relativePath.startsWith('static/')) {
      return `${this.mediaUrl}/${relativePath}`;
    }
    
    // Если это локальный путь к assets
    if (relativePath.startsWith('assets/')) {
      return relativePath;
    }
    
    // По умолчанию
    return `${this.mediaUrl}/media/${relativePath}`;
  }
}