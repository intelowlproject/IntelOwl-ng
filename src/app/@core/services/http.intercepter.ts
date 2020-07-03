import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
  NbAuthService,
  NbAuthSimpleToken,
} from '@nebular/auth';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter
    if (!this.filter(req)) {
      return this.authService.isAuthenticatedOrRefresh().pipe(
        switchMap((authenticated) => {
          if (authenticated) {
            return this.authService.getToken().pipe(
              switchMap((token: NbAuthSimpleToken) => {
                // const JWT = `${JSON.parse(token.getValue())[0]}`;
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

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }
}
