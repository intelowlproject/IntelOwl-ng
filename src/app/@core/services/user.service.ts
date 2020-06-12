import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService, NbAuthSimpleToken } from '@nebular/auth';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';
import { IndexedDbService } from './indexdb.service';
import { IUser } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpService<any> {
  user$: Subject<any> = new Subject() as Subject<any>;

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

    this.nbAuth.onTokenChange().subscribe((token: NbAuthSimpleToken) => {
      if (token.isValid()) {
        this.init().then();
      } else {
        this.logOut();
      }
    });
  }

  private async init(): Promise<void> {
    try {
      const user: IUser = await this.query({}, 'auth/user');
      this.indexDB
        .getTableInstance('user')
        .clear()
        .then(() => {
          this.indexDB.addOrReplaceOne('user', user);
        });
      this.user$.next(user);
    } catch (e) {
      console.error(e);
      if (localStorage.getItem('auth_app_token') && e.status >= 500) {
        this.offlineInit();
      } else {
        this.logOut();
      }
    }
  }

  private async offlineInit(): Promise<void> {
    this.indexDB
      .getTableInstance('user')
      .limit(1)
      .first()
      .then((res) => {
        this.user$.next(res);
      });
  }

  logOut(): void {
    this.nbAuth.logout('email').subscribe(
      () => {
        localStorage.removeItem('auth_app_token');
        this.indexDB.getTableInstance('user').clear();
        location.reload();
      },
      () => {
        localStorage.removeItem('auth_app_token');
        this.indexDB.getTableInstance('user').clear();
        location.reload();
      }
    );
  }
}
