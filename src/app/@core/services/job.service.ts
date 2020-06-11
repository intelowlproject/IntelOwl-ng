import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { IndexedDbService } from './indexdb.service';
import { Job } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class JobService extends HttpService<any> {
  private _jobs$: Subject<Job[]> = new Subject() as Subject<Job[]>;
  public jobs: Job[];
  private _jobResult$: BehaviorSubject<Job> = new BehaviorSubject(
    null
  ) as BehaviorSubject<Job>;

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

  get jobResult$() {
    return this._jobResult$.asObservable();
  }

  async pollForJob(id: number): Promise<void> {
    console.info(`Polling job result for id: ${id}.`);
    const res: Job = await this.get(id, {}, 'jobs');
    this._jobResult$.next(res);
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
