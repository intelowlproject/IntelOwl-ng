import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService, NbAuthOAuth2JWTToken } from '@nebular/auth';
import { Subject, Subscription } from 'rxjs';
import { HttpService } from './http.service';
import { IndexedDbService } from './indexdb.service';
import { IUser } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpService<any> {
  private sub: Subscription;
  user$: Subject<IUser> = new Subject() as Subject<IUser>;

  constructor(
    private _httpClient: HttpClient,
    private nbAuth: NbAuthService,
    public indexDB: IndexedDbService
  ) {
    super(
      _httpClient,
      {
        path: '/',
      },
      indexDB
    );

    this.nbAuth.onTokenChange().subscribe((token: NbAuthOAuth2JWTToken) => {
      if (token.isValid()) {
        const tokenPayload = token.getAccessTokenPayload();
        const user: IUser = {
          id: tokenPayload.user_id,
          username: tokenPayload.username,
        };
        this.init(user).then();
      } else {
        this.logOut();
      }
    });
  }

  private async init(user: IUser) {
    try {
      this.indexDB
        .getTableInstance('user')
        .clear()
        .then(() => this.indexDB.addOrReplaceOne('user', user));
      this.user$.next(user);
    } catch (e) {
      console.error(e);
      if (localStorage.getItem('auth_app_token') && e.status > 500) {
        this.offlineInit();
      } else {
        this.logOut();
      }
    }
  }

  private offlineInit() {
    this.indexDB
      .getTableInstance('user')
      .limit(1)
      .first()
      .then((res) => {
        this.user$.next(res);
      });
  }

  logOut() {
    this.nbAuth.logout('email').subscribe(
      () => {
        this.indexDB.getTableInstance('user').clear();
        location.reload();
      },
      () => {
        this.indexDB.getTableInstance('user').clear();
        location.reload();
      }
    );
  }
}
