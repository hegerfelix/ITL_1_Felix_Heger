/**
 * @file tab1.page.ts
 * @description Haupt-Dashboard der TaxiApp: zeigt alle Benutzer an und erlaubt
 * CRUD-Operationen (Erstellen, Bearbeiten, Löschen) sowie Logout.
 *
 * Kursanforderung Endabgabe: Benutzerdaten werden nach Login/Registrierung angezeigt.
 * Kursanforderung Teil 3: Verwendet @capacitor/toast (via Ionic ToastController)
 * für Feedback-Nachrichten nach jeder Operation.
 */

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent,
  IonIcon, IonInput, IonSpinner,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, createOutline, personAddOutline,
  refreshOutline, checkmarkOutline, logOutOutline
} from 'ionicons/icons';
import { UserService, User } from '../services/user.service';
import { AuthService } from '../services/auth.service';

/**
 * @class Tab1Page
 * @implements OnInit
 * @description Standalone-Komponente ohne separates NgModule.
 * Alle Benutzeroperationen sind durch JWT-Authentifizierung geschützt:
 * – AuthGuard blockiert unauthentifizierte Zugriffe auf /tabs
 * – AuthInterceptor hängt Bearer-Token automatisch an jeden HTTP-Request
 */
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonContent,
    IonIcon, IonInput, IonSpinner,
  ],
})
export class Tab1Page implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';

  newUser: User = { firstName: '', lastName: '', email: '' };
  editingUser: User | null = null;

  /**
   * Farbverläufe für Avatar-Hintergründe.
   * Modulo-Index (getAvatarColor) stellt sicher, dass die Farben für beliebig viele
   * Benutzer zyklisch wiederholt werden.
   */
  private avatarColors = [
    'linear-gradient(135deg, #6c63ff, #3dc2ff)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #ffecd2, #fcb69f)',
    'linear-gradient(135deg, #667eea, #764ba2)',
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ trashOutline, createOutline, personAddOutline, refreshOutline, checkmarkOutline, logOutOutline });
  }

  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Gibt einen Farbverlauf für den Benutzer-Avatar zurück (deterministisch per Index).
   * @param index - Position des Benutzers in der Liste
   * @returns CSS linear-gradient-String
   */
  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  /**
   * Lädt alle Benutzer vom Backend und speichert sie in this.users.
   * Setzt errorMessage bei Verbindungsfehlern (z.B. Backend nicht gestartet).
   * Wird bei ngOnInit() und nach jeder Mutation (add/update/delete) aufgerufen.
   */
  loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not connect to server. Is the backend running on port 3000?';
        this.loading = false;
      }
    });
  }

  /**
   * Erstellt einen neuen Benutzer-Datensatz über UserService.
   * Setzt das newUser-Formular nach Erfolg zurück und lädt die Liste neu.
   * Mindestfelder: firstName und email (Pflicht laut Backend-Validierung).
   */
  addUser() {
    if (!this.newUser.firstName || !this.newUser.email) {
      this.showToast('Please fill in First Name and Email.', 'warning');
      return;
    }
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.showToast('User created! ✅', 'success');
        this.newUser = { firstName: '', lastName: '', email: '' };
        this.loadUsers();
      },
      error: () => this.showToast('Error creating user ❌', 'danger')
    });
  }

  /**
   * Wechselt in den Bearbeitungsmodus für einen Benutzer.
   * Spread-Operator { ...user } erstellt eine Kopie, damit Änderungen im Formular
   * nicht sofort das ursprüngliche Objekt in this.users mutieren (defensive Kopie).
   * @param user - Der zu bearbeitende Benutzer
   */
  startEdit(user: User) {
    this.editingUser = { ...user };
  }

  /**
   * Speichert die Änderungen des bearbeiteten Benutzers und beendet den Bearbeitungsmodus.
   * Early-Return wenn editingUser oder id fehlt (Sicherheitscheck gegen null-Zugriff).
   */
  saveEdit() {
    if (!this.editingUser || !this.editingUser.id) return;
    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: () => {
        this.showToast('User updated! ✅', 'success');
        this.editingUser = null;
        this.loadUsers();
      },
      error: () => this.showToast('Error updating user ❌', 'danger')
    });
  }

  /** Verwirft alle Änderungen und beendet den Bearbeitungsmodus ohne API-Aufruf. */
  cancelEdit() {
    this.editingUser = null;
  }

  /**
   * Zeigt eine Bestätigungs-Alert-Nachricht vor dem Löschen (zweistufige Bestätigung).
   * Verhindert unbeabsichtigtes Löschen durch einen zusätzlichen Klick.
   * Die eigentliche Löschung findet im Alert-Handler statt.
   * @param user - Der zu löschende Benutzer
   */
  async deleteUser(user: User) {
    const alert = await this.alertCtrl.create({
      header: 'Delete User',
      message: `Delete ${user.firstName} ${user.lastName}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete', role: 'destructive',
          handler: () => {
            this.userService.deleteUser(user.id!).subscribe({
              next: () => {
                this.showToast('User deleted 🗑️', 'success');
                this.loadUsers();
              },
              error: () => this.showToast('Error deleting user ❌', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Zeigt eine Ionic-Toast-Nachricht am unteren Bildschirmrand.
   * Kursanforderung: @capacitor/toast für native Benachrichtigungen; hier wird zusätzlich
   * der Ionic ToastController für farbige Status-Toasts genutzt.
   * @param message - Anzuzeigender Text
   * @param color - Ionic-Farbe: 'success', 'danger', 'warning'
   */
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2200, color, position: 'bottom',
      cssClass: 'modern-toast'
    });
    await toast.present();
  }

  /**
   * Zeigt eine Abmeldebestätigung und führt bei Bestätigung den Logout durch.
   * AuthService.logout() entfernt Token + User aus Capacitor Preferences
   * und setzt den BehaviorSubject zurück. Anschließend Navigation zu /login.
   */
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Abmelden',
      message: 'Möchtest du dich wirklich abmelden?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Abmelden',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}
