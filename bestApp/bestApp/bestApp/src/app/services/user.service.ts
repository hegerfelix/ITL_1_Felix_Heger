import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUsers(): Observable<User[]> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.get<User[]>(this.apiUrl, { headers }))
    );
  }

  createUser(user: User): Observable<User> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.post<User>(this.apiUrl, user, { headers }))
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers }))
    );
  }

  deleteUser(id: number): Observable<any> {
    return from(this.authService.getAuthHeaders()).pipe(
      switchMap(headers => this.http.delete(`${this.apiUrl}/${id}`, { headers }))
    );
  }
}
