import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  userName: string | null = null;
  cartItemCount: number = 0;

  constructor(
    private authService: AuthService,  
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getUserNameObservable().subscribe(name => {
      this.userName = name;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
