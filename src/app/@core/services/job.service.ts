import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { IndexedDbService } from './indexdb.service';
import { Job } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class JobService extends HttpService<any> {
  private _jobs$: ReplaySubject<Job[]> = new ReplaySubject(1) as ReplaySubject<
    Job[]
  >;
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

  get jobs$(): Observable<Job[]> {
    return this._jobs$.asObservable();
  }

  get jobResult$(): Observable<Job> {
    return this._jobResult$.asObservable();
  }

  async initOrRefresh(): Promise<any> {
    try {
      const resp: Job[] = await this.query({}, 'jobs');
      resp.map((job) => {
        if (job.is_sample) {
          job['type'] = 'file';
        } else {
          job['type'] = 'observable';
        }
      });
      this._jobs$.next(resp);
      return Promise.resolve();
    } catch (e) {
      console.error(e);
      this._jobs$.error(e);
      return Promise.reject(e);
    }
  }

  async pollForJob(id: number): Promise<void> {
    console.info(`Polling for Job with id: ${id}`);
    const res: Job = await this.get(id, {}, 'jobs');
    this._jobResult$.next(res);
  }

  async downloadJobSample(jobId: number): Promise<string> {
    try {
      const query = {
        job_id: jobId,
      };
      const blob: Blob = await this.downloadFile(query, 'download_sample');
      const url: string = window.URL.createObjectURL(blob);
      return url;
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  }

  async downloadJobRawJson(jobId: number): Promise<string> {
    try {
      const blob: Blob = await this.downloadFile({}, `jobs/${jobId}`);
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  }

  private async offlineInit() {
    this.indexDB.getAllInstances('jobs').then((res) => {
      this._jobs$.next(res);
    });
  }
}
