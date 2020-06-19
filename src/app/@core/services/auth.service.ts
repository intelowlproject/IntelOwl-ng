import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { IToken } from '../models/models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService<any> {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  private _onTokenChange$: ReplaySubject<JWTToken> = new ReplaySubject(
    1
  ) as ReplaySubject<JWTToken>;

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    this.getAccessToken()
      .toPromise()
      .then((token: JWTToken) => this._onTokenChange$.next(token));
  }

  async login(user: { username: string; password: string }): Promise<any> {
    return this.create(user, {}, 'auth/login').then(
      (token: IToken) => {
        this.storeTokens(token);
        const jwt = new JWTToken(token.access);
        this._onTokenChange$.next(jwt);
        return true;
      },
      (err: any) => {
        this._onTokenChange$.error(err);
        return Promise.reject(err);
      }
    );
  }

  async logout(): Promise<any> {
    await this.create(
      {
        refresh: this.getRefreshToken(),
      },
      {},
      'auth/logout'
    );
    this.removeTokens();
    this._onTokenChange$.next(null);
    return location.reload();
  }

  private async refreshToken(): Promise<boolean> {
    return await this.create(
      { refresh: this.getRefreshToken() },
      {},
      'auth/refresh-token'
    ).then(
      (token: IToken) => {
        this.storeTokens(token);
        const jwt = new JWTToken(token.access);
        this._onTokenChange$.next(jwt);
        return true;
      },
      (err: any) => {
        this._onTokenChange$.error(err);
        return false;
      }
    );
  }

  /**
   * Returns tokens stream
   * @returns {Observable<JWTToken>}
   */
  get onTokenChange$(): Observable<JWTToken> {
    return this._onTokenChange$.asObservable();
  }

  /**
   * Returns true if a valid auth token is present in the LocalStorage
   * @returns {Observable<boolean>}
   */
  isAuthenticated(): Observable<boolean> {
    return this.getAccessToken().pipe(
      map((token: JWTToken) => token.isValid())
    );
  }

  /**
   * Returns true if valid auth token is present in the localStorage.
   * If not, calls function refreshToken, and returns isAuthenticated() if success, false otherwise
   * @returns {Observable<boolean>}
   */
  isAuthenticatedOrRefresh(): Observable<boolean> {
    return this.getAccessToken().pipe(
      switchMap(async (token: JWTToken) => {
        if (!token.isValid()) {
          return await this.refreshToken();
        } else {
          return await this.isAuthenticated().toPromise();
        }
      })
    );
  }

  /**
   * returns current access token as an observable stream
   * @returns {=Observable<JWTToken>}
   */
  getAccessToken(): Observable<JWTToken> {
    return of(new JWTToken(localStorage.getItem(this.JWT_TOKEN)));
  }

  /**
   * fetches refresh token from localStorage.
   * internal use only.
   * @returns {string}
   */
  private getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  /**
   * stores tokens in localStorage.
   * Internal use only.
   */
  private storeTokens(token: IToken) {
    localStorage.setItem(this.JWT_TOKEN, token.access);
    localStorage.setItem(this.REFRESH_TOKEN, token.refresh);
  }

  /**
   * removes tokens from localStorage
   */
  public removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}

export class JWTToken {
  private token: string = null;
  private readonly helper = new JwtHelperService();

  constructor(jwt: string) {
    this.token = jwt;
  }

  // helper functions

  getValue(): string {
    return this.token;
  }

  getPayload(): any {
    return this.helper.decodeToken(this.token);
  }

  getExpirationDate(): Date {
    return this.helper.getTokenExpirationDate(this.token);
  }

  isValid(): boolean {
    return this.token && !this.helper.isTokenExpired(this.token);
  }
}
