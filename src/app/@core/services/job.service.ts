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
  private _jobs$: Subject<Job[]> = new Subject() as Subject<Job[]>;
  public jobs: Job[];

  constructor(
    private _httpClient: HttpClient,
    protected indexDB: IndexedDbService
  ) {
    super(
      _httpClient,
      {
        path: '',
      },
      indexDB
    );
    this.initOrRefresh().then();
  }

  get jobs$() {
    return this._jobs$.asObservable();
  }

  async getJob(id: number): Promise<Job> {
    // return await this.indexDB.getOne('jobs', id);
    return await this.get(id, {}, 'jobs');
  }

  async initOrRefresh() {
    try {
      const result: Job[] = await this.query({}, 'jobs');
      result.map((job) => {
        if (job.is_sample) {
          job['type'] = 'file';
        } else {
          job['type'] = 'observable';
        }
      });
      this.jobs = result;
      this._jobs$.next(result);
    } catch (e) {
      console.error(e);
      if (e.status >= 500) {
        // this.offlineInit();
      }
    }
  }

  private async offlineInit() {
    this.indexDB.getAllInstances('jobs').then((res) => {
      this.jobs = res;
      this._jobs$.next(res);
    });
  }
}
