import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService, JWTToken } from './auth.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  filterReqs(req: HttpRequest<any>) {
    if (
      req.url === '/api/auth/refresh-token' ||
      req.url === '/api/auth/login'
    ) {
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
      return this.authService.isAuthenticatedOrRefresh().pipe(
        switchMap((authenticated: boolean) => {
          if (authenticated) {
            return this.authService.getAccessToken().pipe(
              switchMap((token: JWTToken) => {
                req = req.clone({
                  setHeaders: {
                    Authorization: `Token ${token.getValue()}`,
                  },
                });
                return next.handle(req);
              })
            );
          } else {
            // Request is sent to server without authentication so that the client code
            // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
            return next.handle(req);
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }

  protected get authService(): AuthService {
    return this.injector.get(AuthService);
  }
}
