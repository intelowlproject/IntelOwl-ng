import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /* canActivate guard to redirect users to login page..
     .. if they are unauthenticated */
  canActivate() {
    return this.authService.isAuthenticatedOrRefresh().pipe(
      tap((authenticated) => {
        if (!authenticated) {
          // remove tokens if any and redirect user to login
          this.authService.removeTokens();
          return this.router.navigate(['auth/login']);
        }
        return true;
      })
    );
  }
}
