import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Job } from '../models/models';
import { saved_jobs_for_demo } from 'src/assets/job_data';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private _jobs$: BehaviorSubject<Job[]> = new BehaviorSubject(
    null
  ) as BehaviorSubject<Job[]>;

  constructor() {
    this.initOrRefresh().then();
  }

  get jobs$(): Observable<Job[]> {
    return this._jobs$.asObservable();
  }

  // not private since it should be accessible for dashboard's
  // sync button
  async initOrRefresh(): Promise<any> {
    try {
      const resp: any[] = saved_jobs_for_demo;
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

  async deleteJobById(jobId: number): Promise<boolean> {
    try {
      const filteredJobs = this._jobs$.getValue().filter((j) => j.id != jobId);
      this._jobs$.next(filteredJobs);
      return true;
    } catch (e) {
      return false;
    }
  }

  async killJobById(jobId: number): Promise<boolean> {
    try {
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
