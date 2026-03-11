import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { Toast } from '@capacitor/toast';

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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private TOKEN_KEY = 'my-token';
  private USER_KEY = 'my-user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private async loadStoredUser() {
    const token = await this.getToken();
    const userStr = await Preferences.get({ key: this.USER_KEY });
    
    if (token && userStr.value) {
      const user = JSON.parse(userStr.value);
      this.currentUserSubject.next(user);
    }
  }

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

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private async saveAuthData(token: string, user: User): Promise<void> {
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
    await Preferences.set({ key: this.USER_KEY, value: JSON.stringify(user) });
    this.currentUserSubject.next(user);
  }

  async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

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
