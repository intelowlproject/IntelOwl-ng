import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';
import { IndexedDbService } from './indexdb.service';
import { Job } from '../models/models';


@Injectable({
  providedIn: 'root',
})
export class JobService extends HttpService<any> {

  jobs$: Subject<any> = new Subject() as Subject<any>;
  jobs: Job[];

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
    this.init().then();
  }

  async getJob(id: number): Promise<Job> {
    // return await this.indexDB.getOne('jobs', id);
    return await this.get(id, {}, 'jobs');
  }

  async init() {
    try {
      const result: Job[] = await this.query({}, 'jobs');
      result.map( (job) => {
        if (job.observable_name) {
          job['type'] = 'observable';
        } else {
          job['type'] = 'file';
        }
      });
      this.jobs = result;
      this.jobs$.next(result);
    } catch (e) {
      console.error(e);
      if (e.status >= 500) {
        // this.offlineInit();
      }
    }
  }

  private async offlineInit() {
    this.indexDB.getAllInstances('jobs').then(res => {
      this.jobs = res;
      this.jobs$.next(res);
    });
  }

}
