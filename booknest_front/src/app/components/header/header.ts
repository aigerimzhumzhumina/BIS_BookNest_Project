import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  standalone: true,
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  showSearch: boolean = false;
  currentUser: User | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.showSearch = !currentUrl.includes('/login') && !currentUrl.includes('/register');
    });
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
