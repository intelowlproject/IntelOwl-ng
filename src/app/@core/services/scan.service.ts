import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IndexedDbService } from './indexdb.service';
import { HttpService } from './http.service';
import { ObservableForm, FileForm, IRecentScan } from '../models/models';
import { ToastService } from './toast.service';
import { ReplaySubject } from 'rxjs';
import { scan as rxScan } from 'rxjs/operators';
import { JobService } from './job.service';

@Injectable({
  providedIn: 'root',
})
export class ScanService extends HttpService<any> {
  private _recentScans$: ReplaySubject<any> = new ReplaySubject<any>(10);

  constructor(
    private toastr: ToastService,
    private _httpClient: HttpClient,
    protected indexDB: IndexedDbService,
    private jobService: JobService
  ) {
    super(
      _httpClient,
      {
        path: '',
      },
      indexDB
    );
    this.init().then();
  }

  get recentScans$() {
    return this._recentScans$
      .asObservable()
      .pipe(rxScan((acc, curr) => [curr, ...acc], []));
  }

  private async init() {
    this.indexDB.getRecentScans().then((arr) => {
      arr.forEach((o) => this._recentScans$.next(o));
    });
  }

  // only this function is callable from the components
  public async requestScan(
    rqstData: any,
    type: string,
    forceNewScanBool: boolean
  ): Promise<void> {
    try {
      if (forceNewScanBool) {
        await this._newScan(rqstData, type);
      } else {
        const exists: boolean = await this._checkInExistingScans(rqstData);
        if (!exists) {
          await this._newScan(rqstData, type);
        }
      }
    } catch (e) {
      this.onError(e);
    }
  }

  private async _checkInExistingScans(
    data: ObservableForm | FileForm
  ): Promise<boolean> {
    const query = {
      md5: data.md5,
      analyzers_needed: data.analyzers_requested,
    };
    if (data.run_all_available_analyzers) {
      query['run_all_available_analyzers'] = 'True';
    }
    if (data.running_only) {
      query['running_only'] = 'True';
    }
    const answer = await this.query(query, 'ask_analysis_availability');
    if (answer.status === 'not_available') {
      return false;
    } else {
      // tslint:disable-next-line: radix
      const jobId = parseInt(answer.job_id);
      this._recentScans$.next({
        jobId: jobId,
        status: 'primary',
      } as IRecentScan);
      this.indexDB.addToRecentScans({
        jobId: jobId,
        status: 'primary',
      } as IRecentScan);
      this.toastr.showToast(`Job #${jobId}`, 'Scan Already Exists!', 'info');
      return true;
    }
  }

  private async _newScan(
    data: ObservableForm | FileForm,
    type: string
  ): Promise<void> {
    if (type === 'observable') {
      await this._createObservableScan(data);
    } else {
      await this._createFileScan(data);
    }
  }

  // should never be called without context
  private async _createObservableScan(data: ObservableForm): Promise<void> {
    const obj = {
      is_sample: false,
      md5: data.md5,
      observable_name: data.observable_name,
      observable_classification: data.observable_classification,
      analyzers_requested: data.analyzers_requested,
      run_all_available_analyzers: data.run_all_available_analyzers,
      force_privacy: data.force_privacy,
      disable_external_analyzers: data.disable_external_analyzers,
      tags_id: data.tags_id || [],
    };
    const res = await this.create(obj, {}, 'send_analysis_request');
    if (res['status'] === 'accepted' || res['status'] === 'running') {
      this.onSuccess(res);
    } else {
      this.onError(res['error']);
    }
  }

  // should never be called without context
  private async _createFileScan(data: FileForm): Promise<any> {
    const postFormData: FormData = new FormData();
    const jsonData = {
      is_sample: 'True',
      md5: data.md5,
      file_name: data.file_name,
      analyzers_requested: data.analyzers_requested,
      run_all_available_analyzers: data.run_all_available_analyzers
        ? 'True'
        : 'False',
      force_privacy: data.force_privacy ? 'True' : 'False',
      disable_external_analyzers: data.disable_external_analyzers
        ? 'True'
        : 'False',
      tags_id: data.tags_id || [],
    };
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        if (Array.isArray(jsonData[key])) {
          jsonData[key].forEach((el) => postFormData.append(key, el));
        } else {
          postFormData.append(key, jsonData[key]);
        }
      }
    }
    postFormData.append('file', data.file, data.file_name);
    const res = await this.create(postFormData, {}, 'send_analysis_request');
    if (res['status'] === 'accepted' || res['status'] === 'running') {
      this.onSuccess(res);
    } else {
      this.onError(res['error']);
    }
  }

  private onSuccess(res) {
    // refresh the job list asynchronously
    setTimeout(() => this.jobService.initOrRefresh(), 0);
    // show success toast
    this.toastr.showToast(
      `Job ID: ${res.job_id}`,
      'Analysis running!',
      'success'
    );
    // add to recent scans
    this._recentScans$.next({
      jobId: res.job_id,
      status: 'success',
    } as IRecentScan);
    this.indexDB.addToRecentScans({
      jobId: res.job_id,
      status: 'success',
    } as IRecentScan);
  }

  private onError(e) {
    console.error(e);
    this.toastr.showToast(
      `backend returned: ${e['error']['error']} (${e['status']}: ${e['statusText']})`,
      'Scan Request Failed!',
      'error'
    );
  }
}
