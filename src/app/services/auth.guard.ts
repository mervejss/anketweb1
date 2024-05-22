//C:\angular\anketweb-main\src\app\services\auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from './admin.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AdminService,
    private _router: Router) { }

  canActivate(): boolean {
    if (this._authService.loggedIn()) {
      console.log('true')
      return true
    } else {
      console.log('false')            
      this._router.navigate(['/admin-giris-yap'])
      return false
    }
  }
}