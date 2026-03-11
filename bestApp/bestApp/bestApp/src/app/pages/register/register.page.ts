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
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async register() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      return;
    }

    this.loading = true;
    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/tabs/tab1']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Registration failed:', err);
      }
    });
  }
}
