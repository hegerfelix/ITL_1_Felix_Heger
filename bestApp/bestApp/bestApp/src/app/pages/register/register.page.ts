/**
 * @file register.page.ts
 * @description Registrierungs-Seite der TaxiApp.
 * Sammelt Vorname, Nachname, E-Mail und Passwort und sendet sie via AuthService
 * an POST /api/auth/register. Bei Erfolg wird der Token gespeichert und zu /tabs/tab1 navigiert.
 *
 * Kursanforderung Endabgabe: TaxiApp mit Registrierung UND Login –
 * Token wird nach Registrierung sofort in Capacitor Preferences gespeichert
 * (kein zweiter Login-Schritt nötig).
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
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

/**
 * @class RegisterPage
 * @description Standalone-Komponente für die Neuregistrierung.
 * Alle vier Felder (firstName, lastName, email, password) sind Pflichtfelder –
 * entsprechend dem Backend-Validator in routes/auth.js.
 */
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
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  /** Schaltet die Passwort-Sichtbarkeit um. */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Führt die Registrierung durch.
   * Clientseitige Pflichtfeld-Prüfung läuft vor dem API-Request (frühe Validierung).
   * Das Backend führt eine zusätzliche serverseitige Validierung durch (doppelte Absicherung).
   * Bei Erfolg: AuthService speichert Token, navigiert direkt zu Tab1 ohne erneuten Login.
   */
  async register() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
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
        if (err.status === 409) {
          this.errorMessage = 'Diese E-Mail-Adresse ist bereits registriert.';
        } else {
          this.errorMessage = 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
        }
        console.error('Registration failed:', err);
      }
    });
  }
}
