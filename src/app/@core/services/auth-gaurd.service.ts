import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: NbAuthService, private router: Router) {}

  /* canActivate guard to redirect users to login page..
     .. if they are unauthenticated */
  canActivate() {
    return this.authService.isAuthenticated().pipe(
      tap((authenticated) => {
        if (!authenticated) {
          // remove token if exists and redirect user to login page
          localStorage.removeItem('auth_app_token');
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}
