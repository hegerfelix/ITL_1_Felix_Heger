import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/tabs/tab1']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Login failed:', err);
      }
    });
  }
}
