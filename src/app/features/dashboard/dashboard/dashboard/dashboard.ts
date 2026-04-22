import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  constructor(public auth: AuthService, private router: Router) {}

  logout() {
  this.auth.logout().then(() => {
    this.router.navigate(['/login']);
  });
}
}