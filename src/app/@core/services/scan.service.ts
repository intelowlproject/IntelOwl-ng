import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IndexedDbService } from './indexdb.service';
import { HttpService } from './http.service';
import { IRecentScan, IScanForm } from '../models/models';
import { ToastService } from './toast.service';
import { JobService } from './job.service';

@Injectable({
  providedIn: 'root',
})
export class ScanService extends HttpService<any> {
  public recentScans: Map<string | number, string> = new Map();

  constructor(
    private toastr: ToastService,
    private _httpClient: HttpClient,
    private indexedDB: IndexedDbService,
    private jobService: JobService
  ) {
    super(_httpClient);
    // load recent scans
    this.indexedDB.getRecentScans().then((arr: IRecentScan[]) => {
      arr.forEach((o: IRecentScan) => this.recentScans.set(o.jobId, o.status));
    });
  }

  // only this function is callable from the components
  public async requestScan(rqstData: IScanForm, type: string): Promise<void> {
    let res;
    try {
      if (rqstData.check_existing_or_force === 'force_new') {
        res = await this._newScan(rqstData, type);
      } else {
        const exists: boolean = await this._checkInExistingScans(rqstData);
        if (!exists) {
          res = await this._newScan(rqstData, type);
        }
      }
      // handle response/error
      if (res['status'] === 'accepted' || res['status'] === 'running') {
        this.onSuccess(res);
      } else {
        this.onError(res);
      }
    } catch (e) {
      this.onError(e);
    }
  }

  private async _checkInExistingScans(data: IScanForm): Promise<boolean> {
    const obj = {
      md5: data.md5,
      analyzers: data.analyzers_requested,
    };
    if (data.check_existing_or_force === 'running_only') {
      obj['running_only'] = 'True';
    }
    const answer = await this.create(obj, {}, 'ask_analysis_availability');
    if (answer.status === 'not_available') {
      return false;
    } else {
      // tslint:disable-next-line: radix
      const jobId = parseInt(answer.job_id);
      this.recentScans.set(jobId, 'primary');
      this.indexedDB.addToRecentScans({
        jobId: jobId,
        status: 'primary',
      } as IRecentScan);
      this.toastr.showToast(`Job #${jobId}`, 'Scan Already Exists!', 'info');
      return true;
    }
  }

  private async _newScan(data: IScanForm, type: string): Promise<any> {
    const obj: any = {
      md5: data.md5,
      analyzers_requested: data.analyzers_requested,
      connectors_requested: data.connectors_requested,
      tlp: data.tlp,
      tags_labels: data.tags_labels || [],
    };
    if (type === 'observable') {
      obj.is_sample = false;
      obj.observable_name = data.observable_name;
      obj.observable_classification = data.classification;
      obj.runtime_configuration = data.runtime_configuration;
      return this._createObservableScan(obj);
    } else {
      obj.is_sample = true;
      obj.file_name = data.file_name;
      return this._createFileScan(obj, data.file, data.runtime_configuration);
    }
  }

  // should never be called without context
  private async _createObservableScan(obj: any): Promise<any> {
    return this.create(obj, {}, 'analyze_observable');
  }

  // should never be called without context
  private async _createFileScan(
    obj: any,
    file: File,
    runtimeCfg: any
  ): Promise<any> {
    const postFormData: FormData = new FormData();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((el) => postFormData.append(key, el));
        } else {
          postFormData.append(key, obj[key]);
        }
      }
    }
    if (runtimeCfg != null && Object.keys(runtimeCfg).length) {
      postFormData.append('runtime_configuration', JSON.stringify(runtimeCfg));
    }
    postFormData.append('file', file, obj.file_name);
    return this.create(postFormData, {}, 'analyze_file');
  }

  private onSuccess(res: any): void {
    // refresh the job list asynchronously
    setTimeout(() => this.jobService.initOrRefresh(), 0);
    // show success toast
    this.toastr.showToast(
      `Job ID: ${res.job_id}`,
      'Analysis running!',
      'success'
    );
    // add to recent scans
    this.recentScans.set(res.job_id, 'success');
    this.indexedDB.addToRecentScans({
      jobId: res.job_id,
      status: 'success',
    } as IRecentScan);
  }

  private onError(e: any): void {
    const msg: string = e?.message || e.toString();
    // show error/danger toast
    this.toastr.showToast(
      `${msg} (${e.status}: ${e.statusText})`,
      'Scan Request Failed!',
      'error'
    );
  }
}
