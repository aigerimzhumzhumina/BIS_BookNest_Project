import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService, Language } from '../../services/translation';
import { TranslatePipe } from '../../pipes/translate-pipe';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './header.html',
  standalone: true,
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  showSearch: boolean = false;
  currentUser: User | null = null;
  currentLanguage: Language = 'ru';
  showLanguageMenu: boolean = false;
  languages = [
    { code: 'ru' as Language, name: 'Русский', flag: 'RU' },
    { code: 'en' as Language, name: 'English', flag: 'EN' },
    { code: 'kk' as Language, name: 'Қазақша', flag: 'KZ' }
  ];

  constructor(private router: Router, private authService: AuthService, public translationService: TranslationService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.showSearch = !currentUrl.includes('/login') && !currentUrl.includes('/register');
    });

    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  changeLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
    this.showLanguageMenu = false;
  }

  getCurrentLanguageFlag(): string {
    const current = this.languages.find(l => l.code === this.currentLanguage);
    return current?.flag || '🇷🇺';
  }
}
