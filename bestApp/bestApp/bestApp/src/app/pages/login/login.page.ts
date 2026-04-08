/**
 * @file login.page.ts
 * @description Login-Seite der TaxiApp. Nimmt E-Mail und Passwort entgegen,
 * sendet sie via AuthService ans Backend und navigiert bei Erfolg zu /tabs/tab1.
 *
 * Kursanforderung Endabgabe: Login-Implementierung –
 * Credentials werden ans Backend übermittelt, Token wird in Capacitor Preferences gespeichert
 * (durch AuthService.saveAuthData()), Benutzerdaten werden anschließend in Tab1 angezeigt.
 */

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

/**
 * @class LoginPage
 * @description Standalone-Komponente (kein NgModule erforderlich).
 * Ionicons werden via addIcons() registriert – bei Standalone-Komponenten notwendig,
 * da kein globales Icon-Modul geladen wird.
 */
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

  /** Schaltet die Passwort-Eingabe zwischen "text" und "password" um (Sichtbarkeit). */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Führt den Login-Vorgang durch.
   * Early-Return bei leeren Feldern verhindert unnötige API-Requests.
   * loading-Flag deaktiviert den Submit-Button während des Requests (verhindert Doppelklicks).
   * Toast-Feedback (Erfolg/Fehler) wird vom AuthService selbst angezeigt.
   */
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
