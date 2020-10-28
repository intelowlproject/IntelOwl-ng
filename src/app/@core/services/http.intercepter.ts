import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  filterReqs(req: HttpRequest<any>) {
    if (req.url === '/api/auth/login') {
      return true;
    } else if (req.url.startsWith('/api/')) {
      return false;
    }
    return true;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter
    if (!this.filterReqs(req)) {
      return this.authService.isAuthenticated().pipe(
        switchMap((authenticated: boolean) => {
          if (authenticated) {
            return this.authService.getToken().pipe(
              switchMap((token: string) => {
                req = req.clone({
                  setHeaders: {
                    Authorization: `Token ${token}`,
                  },
                });
                return next
                  .handle(req)
                  .pipe(
                    catchError((err: any, _caught: any) =>
                      this.handleError(err)
                    )
                  );
              })
            );
          } else {
            // Request is sent to server without authentication so that the client code
            // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
            return next
              .handle(req)
              .pipe(
                catchError((err: any, _caught: any) => this.handleError(err))
              );
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }

  private handleError(err: any) {
    if (err.status === 401 && !err.url.includes('logout'))
      this.authService.logout();
    const errMsg: string = (
      err?.error?.error ||
      err?.error?.non_field_errors ||
      err?.detail ||
      err?.message ||
      JSON.stringify(err)
    ).toString();
    return throwError(new Error(errMsg));
  }

  protected get authService(): AuthService {
    return this.injector.get(AuthService);
  }
}
