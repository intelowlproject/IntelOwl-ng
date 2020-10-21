import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user$: ReplaySubject<string> = new ReplaySubject(1) as ReplaySubject<
    string
  >;

  constructor(private readonly authService: AuthService) {
    this.authService.onTokenChange$.subscribe(async (token: string) => {
      if (token) {
        try {
          const username: string = this.authService.getPayload();
          if (username) {
            this._user$.next(username);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  get user$(): Observable<string> {
    return this._user$.asObservable();
  }

  logOut() {
    this.authService.logout();
  }
}
