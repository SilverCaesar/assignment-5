import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';

    this.auth.login(this.email, this.password)
      .then(() => {
        // redirect after successful login
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        this.errorMessage = err.message;
      });
  }
}
