import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IUser } from '../models/models';
import { AuthService, JWTToken } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user$: ReplaySubject<IUser> = new ReplaySubject(1) as ReplaySubject<
    IUser
  >;

  constructor(private readonly authService: AuthService) {
    this.authService.onTokenChange$.subscribe(async (token: JWTToken) => {
      if (token) {
        this.init(token.getPayload());
      }
    });
  }

  get user$(): Observable<IUser> {
    return this._user$.asObservable();
  }

  private async init(tokenPayload: any) {
    try {
      const user: IUser = {
        id: tokenPayload.user_id,
        username: tokenPayload.username,
      } as IUser;
      this._user$.next(user);
    } catch (e) {
      console.error(e);
    }
  }

  async logOut() {
    await this.authService.logout();
  }
}
