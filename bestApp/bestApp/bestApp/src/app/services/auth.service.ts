/**
 * @file auth.service.ts
 * @description Angular-Service für Authentifizierung: Login, Registrierung, Logout
 * und Token-Verwaltung via @capacitor/preferences.
 *
 * Kursanforderung Teil 3: Frontend-Integration mit Capacitor Storage
 * Kursanforderung Endabgabe: Token wird nach Login/Register in Capacitor Preferences gespeichert,
 * Benutzerdaten werden über BehaviorSubject reaktiv an Komponenten weitergegeben.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { Toast } from '@capacitor/toast';

/**
 * Repräsentiert die Antwort des Backends auf Login- und Registrierungs-Requests.
 * Enthält das JWT sowie die sicheren User-Daten (kein Passwort-Hash).
 */
interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/** Öffentliche User-Daten ohne sensible Felder (kein Passwort). */
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * @class AuthService
 * @description Zentraler Service für den gesamten Auth-Lebenszyklus.
 * Verwendet BehaviorSubject für reaktive Aktualisierungen des aktuellen Benutzers,
 * sodass andere Komponenten (z.B. Tab1) auf User-Änderungen reagieren können.
 *
 * Token-Speicherung: @capacitor/preferences (nicht localStorage) – plattformübergreifend
 * sicher für native iOS/Android-Apps sowie PWA.
 *
 * Toast-Feedback: @capacitor/toast zeigt native Benachrichtigungen auf allen Plattformen.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  /** Schlüssel für das JWT in Capacitor Preferences (Kursanforderung: npm install @capacitor/preferences). */
  private TOKEN_KEY = 'my-token';

  /** Schlüssel für die gespeicherten User-Daten in Capacitor Preferences. */
  private USER_KEY = 'my-user';

  /**
   * Interner Stream des aktuell eingeloggten Users.
   * BehaviorSubject speichert den letzten Wert und gibt ihn sofort an neue Subscriber aus –
   * wichtig damit Tab1Page den User beim Laden schon kennt, ohne auf ein Event warten zu müssen.
   */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  /**
   * Stellt den Auth-Zustand beim App-Start wieder her.
   * Liest Token UND User-Daten aus Preferences, damit die App nach einem Neustart
   * sofort den eingeloggten User kennt, ohne einen /verify-Request zu benötigen.
   * Wird im Konstruktor aufgerufen.
   */
  private async loadStoredUser() {
    const token = await this.getToken();
    const userStr = await Preferences.get({ key: this.USER_KEY });

    if (token && userStr.value) {
      const user = JSON.parse(userStr.value);
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Registriert einen neuen Benutzer und speichert Token + User-Daten lokal.
   * Kursanforderung Endabgabe: Credentials werden ans Backend gesendet,
   * Token wird generiert und in Capacitor Preferences gespeichert.
   * tap() führt Side-Effects aus (Token speichern, Toast zeigen) ohne den Observable-Stream zu unterbrechen.
   * @param userData - Benutzerdaten (firstName, lastName, email, password)
   * @returns Observable<AuthResponse> – emitiert einmalig, dann complete
   */
  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(async (res) => {
        await this.saveAuthData(res.token, res.user);
        await Toast.show({
          text: '✅ Registrierung erfolgreich!',
          duration: 'short',
          position: 'top'
        });
      }),
      catchError(async (error) => {
        await Toast.show({
          text: error.error?.error || '❌ Registrierung fehlgeschlagen',
          duration: 'long',
          position: 'top'
        });
        throw error;
      })
    );
  }

  /**
   * Meldet einen bestehenden Benutzer an.
   * tap() führt Side-Effects aus (Token speichern, Toast zeigen) ohne den Observable-Stream zu unterbrechen.
   * catchError() fängt HTTP-Fehler ab, zeigt ein Toast und wirft den Fehler weiter,
   * damit die aufrufende Komponente den error-Handler ausführen kann.
   * @param email - Registrierte E-Mail-Adresse
   * @param password - Passwort im Klartext (wird nur über HTTPS übertragen)
   * @returns Observable<AuthResponse>
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(async (res) => {
        await this.saveAuthData(res.token, res.user);
        await Toast.show({
          text: `👋 Willkommen zurück, ${res.user.firstName}!`,
          duration: 'short',
          position: 'top'
        });
      }),
      catchError(async (error) => {
        await Toast.show({
          text: error.error?.error || '❌ Login fehlgeschlagen',
          duration: 'long',
          position: 'top'
        });
        throw error;
      })
    );
  }

  /**
   * Meldet den Benutzer ab: entfernt Token und User-Daten aus Capacitor Preferences
   * und setzt den BehaviorSubject auf null zurück, sodass alle Subscriber sofort reagieren.
   */
  async logout(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
    await Preferences.remove({ key: this.USER_KEY });
    this.currentUserSubject.next(null);
    await Toast.show({
      text: '👋 Erfolgreich abgemeldet',
      duration: 'short',
      position: 'top'
    });
  }

  /**
   * Liest das gespeicherte JWT aus Capacitor Preferences.
   * @returns Das Token als String oder null, wenn kein Token vorhanden ist.
   */
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  /**
   * Prüft ob ein Token vorhanden ist (einfache Existenzprüfung, keine Signaturvalidierung).
   * Wird vom AuthGuard verwendet, um unautorisierten Zugriff auf geschützte Routen zu blockieren.
   * Für stärkere Prüfung: verifyToken() verwenden (benötigt Netzwerkverbindung).
   * @returns true wenn ein Token existiert
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Synchroner Zugriff auf den aktuell eingeloggten User (aus dem BehaviorSubject).
   * Gibt null zurück wenn niemand eingeloggt ist.
   * @returns User-Objekt oder null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Speichert Token und User-Daten in Capacitor Preferences und aktualisiert den BehaviorSubject.
   * Private Hilfsmethode, die nach erfolgreichem Login und nach Registrierung aufgerufen wird.
   * @param token - Das JWT vom Backend
   * @param user - Die sicheren User-Daten vom Backend (ohne Passwort-Hash)
   */
  private async saveAuthData(token: string, user: User): Promise<void> {
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
    await Preferences.set({ key: this.USER_KEY, value: JSON.stringify(user) });
    this.currentUserSubject.next(user);
  }

  /**
   * Erstellt HttpHeaders mit dem Bearer-Token für authentifizierte API-Requests.
   * Wird vom UserService und direkt von verifyToken() verwendet.
   * Das Interceptor-Pattern in auth.interceptor.ts übernimmt dies automatisch für alle Requests –
   * diese Methode ist für explizite Header-Kontrolle vorgesehen.
   * @returns HttpHeaders mit Authorization-Header
   */
  async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Validiert das gespeicherte Token gegen den /api/auth/verify-Endpunkt.
   * from() konvertiert das Promise von getAuthHeaders() in einen Observable-Stream,
   * damit switchMap() nahtlos in die RxJS-Pipeline integriert werden kann.
   * Bei Fehler (abgelaufenes Token, Netzwerkfehler): logout() wird aufgerufen
   * und { valid: false } zurückgegeben.
   * @returns Observable<{ valid: boolean; user: User }>
   */
  verifyToken(): Observable<{ valid: boolean; user: User }> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers =>
        this.http.get<{ valid: boolean; user: User }>(
          `${this.apiUrl}/verify`,
          { headers }
        )
      ),
      catchError(() => {
        this.logout();
        return of({ valid: false, user: null as any });
      })
    );
  }
}
