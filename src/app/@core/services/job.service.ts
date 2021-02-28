import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Job } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class JobService extends HttpService<any> {
  private _jobs$: BehaviorSubject<Job[]> = new BehaviorSubject(
    null
  ) as BehaviorSubject<Job[]>;
  private _jobResult$: BehaviorSubject<Job> = new BehaviorSubject(
    null
  ) as BehaviorSubject<Job>;

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    this.initOrRefresh().then();
  }

  get jobs$(): Observable<Job[]> {
    return this._jobs$.asObservable();
  }

  get jobResult$(): Observable<Job> {
    return this._jobResult$.asObservable();
  }

  // not private since it should be accessible for dashboard's
  // sync button
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
    return this.get(id, {}, 'jobs')
      .then((res: Job) => this._jobResult$.next(res))
      .catch(() => Promise.reject());
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

  async deleteJobById(jobId: number): Promise<boolean> {
    try {
      const _answer = await this.delete(jobId, {}, 'jobs');
      // update jobs list
      const filteredJobs = this._jobs$.getValue().filter((j) => j.id != jobId);
      this._jobs$.next(filteredJobs);
      return true;
    } catch (e) {
      return false;
    }
  }

  async killJobById(jobId: number): Promise<boolean> {
    try {
      const _answer = await this.patch({}, {}, `jobs/${jobId}/kill`);
      // update jobs list
      const filteredJobs = this._jobs$.getValue().map((j) => {
        if (j.id == jobId) j.status = 'killed';
        return j;
      });
      this._jobs$.next(filteredJobs);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* deprecated atm
   * See Issue: https://github.com/intelowlproject/IntelOwl-ng/issues/16
   */
  /*
  private async offlineInit() {
    this.indexDB.getAllInstances('jobs').then((res) => {
      this._jobs$.next(res);
    });
  }
  */
}
