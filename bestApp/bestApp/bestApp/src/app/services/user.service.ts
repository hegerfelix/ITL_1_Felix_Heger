/**
 * @file user.service.ts
 * @description Service für CRUD-Operationen auf dem /api/users-Endpunkt.
 * Alle Requests sind JWT-authentifiziert – der AuthInterceptor hängt den
 * Authorization-Header automatisch an, alternativ werden Headers explizit über
 * authService.getAuthHeaders() gesetzt (doppelter Schutz als Fallback).
 *
 * Kursanforderung Teil 3: Frontend-Datenbankintegration via HTTP
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

/** Öffentliche Nutzerdaten-Struktur – gespiegelt vom Backend-Model (ohne Passwort). */
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * @class UserService
 * @description Stellt CRUD-Methoden für die Benutzerverwaltung bereit.
 * Das from()/switchMap()-Muster wird konsistent verwendet, um den asynchronen
 * getAuthHeaders()-Promise in RxJS-Observables zu wrappen.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Ruft alle Benutzer vom Backend ab.
   * @returns Observable<User[]> – Liste aller Benutzer
   */
  getUsers(): Observable<User[]> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.get<User[]>(this.apiUrl, { headers }))
    );
  }

  /**
   * Erstellt einen neuen Benutzer-Datensatz (ohne Passwort, nur Name + Email).
   * Für Benutzer mit Auth-Credentials: AuthService.register() verwenden.
   * @param user - Benutzerdaten ohne id (wird vom Backend vergeben)
   * @returns Observable<User> – der erstellte Benutzer inklusive generierter id
   */
  createUser(user: User): Observable<User> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.post<User>(this.apiUrl, user, { headers }))
    );
  }

  /**
   * Aktualisiert einen bestehenden Benutzer per ID.
   * @param id - Primärschlüssel des zu aktualisierenden Benutzers
   * @param user - Neue Benutzerdaten
   * @returns Observable<User> – der aktualisierte Benutzer
   */
  updateUser(id: number, user: User): Observable<User> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers }))
    );
  }

  /**
   * Löscht einen Benutzer dauerhaft.
   * @param id - Primärschlüssel des zu löschenden Benutzers
   * @returns Observable<any> – leeres Objekt bei Erfolg
   */
  deleteUser(id: number): Observable<any> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.delete(`${this.apiUrl}/${id}`, { headers }))
    );
  }
}
