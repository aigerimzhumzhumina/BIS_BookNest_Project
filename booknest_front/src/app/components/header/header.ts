import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService, Language } from '../../services/translation';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { MediaUrlPipe } from '../../pipes/media-url-pipe';
import { ApiService, UserProfile } from '../../services/api';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, TranslatePipe, MediaUrlPipe],
  templateUrl: './header.html',
  standalone: true,
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  showSearch: boolean = false;
  currentUser: UserProfile | null = null;
  currentLanguage: Language = 'ru';
  showLanguageMenu: boolean = false;
  languages = [
    { code: 'ru' as Language, name: 'Русский', flag: 'RU' },
    { code: 'en' as Language, name: 'English', flag: 'EN' },
    { code: 'kk' as Language, name: 'Қазақша', flag: 'KZ' }
  ];

  userAvatar: string = 'assets/avatars/default-avatar.png';
  username: string = '';

  constructor(private router: Router, private authService: AuthService, public translationService: TranslationService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    if (this.isLoggedIn) {
      this.loadUserProfile();
    }
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.showSearch = !currentUrl.includes('/login') && !currentUrl.includes('/register');
    });

    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  loadUserProfile(): void {
    this.apiService.getUserProfile().subscribe({
      next: (profile: UserProfile) => {
        this.userAvatar = profile.avatar || 'assets/avatars/default-avatar.png';
        this.username = profile.username;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          this.username = currentUser.username;
        }
      }
    });
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
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

  onAvatarError(event: any): void {
    event.target.src = 'assets/avatars/default-avatar.png';
  }
}
