import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {HttpService} from './http.service';
import {IndexedDbService} from './indexdb.service';


@Injectable()
export class DataService extends HttpService<any> {

  // simple data service to make http calls
  constructor(public http: HttpClient, public indexDB: IndexedDbService) {
    super(http, {
      path: '',
    }, indexDB);
  }


  // additional

  getJSONFile(filename: string): Promise<any> {
    const request = this.http.get(`assets/${filename}.json`);
    return new Promise((resolve, reject) =>
      request.subscribe(
        (res) => {
          return resolve(res);
        },
        (err) => {
          // HttpService.catchError(err);
          return reject(err);
        },
      ),
    );
  }

}
