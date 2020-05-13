import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IndexedDbService } from './indexdb.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ScanService extends HttpService<any> {

  constructor(
    private httpClient: HttpClient,
    protected indexDB: IndexedDbService,
  ) {
    super(
      httpClient,
      {
        path: '',
      },
      indexDB,
    );
  }

  async observableScan() {
    const res = await this.query({}, 'ask_analysis_availability');
  }

}
