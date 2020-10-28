import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { ILoginPayload } from '../models/models';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService<any> {
  private readonly TOKEN_NAME = 'TOKEN';
  private readonly PAYLOAD_NAME = 'PAYLOAD';

  private _onTokenChange$: ReplaySubject<string> = new ReplaySubject(
    1
  ) as ReplaySubject<string>;

  constructor(
    private _httpClient: HttpClient,
    private toastr: ToastService,
    private router: Router
  ) {
    super(_httpClient);
    this.getToken()
      .toPromise()
      .then((token: string) => this._onTokenChange$.next(token));
  }

  login(user: { username: string; password: string }): any {
    return this.create(user, {}, 'auth/login').then(
      (resp: ILoginPayload) => {
        this.storePayload(resp);
        this._onTokenChange$.next(resp.token);
        return true;
      },
      (err: any) => {
        this._onTokenChange$.error(err);
        return Promise.reject(err);
      }
    );
  }

  logout(): void {
    this.create({}, {}, 'auth/logout').finally(() => {
      this.removePayload();
      this.toastr.showToast("You've been logged out.", 'Unauthorized', 'error');
      setTimeout(() => this.router.navigate(['auth/login']), 1000);
    });
  }

  /**
   * Returns tokens stream
   * @returns {Observable<string>}
   */
  get onTokenChange$(): Observable<string> {
    return this._onTokenChange$.asObservable();
  }

  /**
   * Returns true if a valid auth token is present in the LocalStorage
   * @returns {Observable<boolean>}
   */
  isAuthenticated(): Observable<boolean> {
    return this.getToken().pipe(map((token: string) => !!token));
  }

  /**
   * returns current token as an observable stream
   * @returns {Observable<string>}
   */
  getToken(): Observable<string> {
    return of(localStorage.getItem(this.TOKEN_NAME));
  }

  /**
   * stores login payload in localStorage.
   * Internal use only.
   */
  private storePayload(payload: ILoginPayload): void {
    localStorage.setItem(this.TOKEN_NAME, payload.token);
    localStorage.setItem(this.PAYLOAD_NAME, payload.user.username);
  }

  getPayload(): string {
    return localStorage.getItem(this.PAYLOAD_NAME);
  }

  /**
   * removes token from localStorage
   */
  public removePayload(): void {
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem(this.PAYLOAD_NAME);
  }
}
