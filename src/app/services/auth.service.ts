// C:\angular\anketweb-main\src\app\services\auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  setAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeAuthToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getAuthToken() !== null;
  }
 // AuthService içindeki getUserInfo metodu
getUserInfo(): Observable<{ id: number }> {

  const token = this.getAuthToken();
  console.log('Tsafsafasfas TOKEN : ', token);

  if (token) {
    const headers = { 'Authorization': "Bearer " + token };
    

    return this.http.post<{ id: 1 }>('http://localhost:3000/api/getUserInfo', { headers }).pipe(
      
    catchError(error => {
        console.error('Sunucu hatası:', error);
        return throwError('Sunucu hatası oluştu');
      }),
      tap(response => {
        console.log('getUserInfo response:', response); // Bu satır eklenmiş olmalı
      })
    );
  } else {
    return throwError('Token bulunamadı');
  }
}


  
}
