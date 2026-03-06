import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { Toast } from '@capacitor/toast';

const TOKEN_KEY = 'my-token';
const API_URL = 'http://localhost:3000/api/auth';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  register(firstName: string, lastName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/register`, { firstName, lastName, email, password }).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, { email, password }).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  private saveToken(token: string): void {
    Preferences.set({ key: TOKEN_KEY, value: token });
  }

  getToken(): Promise<string | null> {
    return Preferences.get({ key: TOKEN_KEY }).then(result => result.value);
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    await Toast.show({ text: 'Abgemeldet', duration: 'short' });
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null && token !== '';
  }
}
