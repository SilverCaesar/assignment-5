import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.errorMessage = '';

    this.auth.register(this.email, this.password)
      .then(() => {
        // redirect after successful registration
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        this.errorMessage = err.message;
      });
  }
}