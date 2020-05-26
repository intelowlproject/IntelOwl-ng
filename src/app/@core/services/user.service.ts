import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';
import { IndexedDbService } from './indexdb.service';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpService<any> {
  user$: Subject<any> = new Subject() as Subject<any>;

  constructor(
    private _httpClient: HttpClient,
    private nbAuth: NbAuthService,
    public indexDB: IndexedDbService,
  ) {
    super(
      _httpClient,
      {
        path: '/',
      },
      indexDB,
    );

    this.nbAuth.onTokenChange().subscribe((res) => {
      if (res.getValue()) {
        this.init().then();
      }
    });
  }

  async getUserInfo(): Promise<User> {
    return this.query({}, 'auth/user');
  }

  async init() {
    try {
      const user = await this.getUserInfo();
      this.indexDB.getTableInstance('user').clear().then(() => {
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


  offlineInit() {
    this.indexDB.getTableInstance('user').limit(1).first().then(res => {
      this.user$.next(res);
    });
  }


  logOut() {
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
      },
    );
  }

}
