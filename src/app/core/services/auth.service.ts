import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly baseUrl = `${environment.apiUrl}/auth`;
    private readonly tokenKey = 'auth_token';

    constructor(private http: HttpClient) {}

    login(request: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
            tap((response) => this.storeToken(response.token))
        );
    }

    register(request: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
        tap((response) => this.storeToken(response.token))
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
    }

    getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    private storeToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }
}