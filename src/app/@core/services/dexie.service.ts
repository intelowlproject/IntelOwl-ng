import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable()
export class DexieService extends Dexie {
  constructor() {
    super('IntelOwlAppDatabase');

    this.version(1).stores({
      recent_scans: '++jobId,status',
      /*
      tags: '++label,color',
      jobs: '++id,source,tags,is_sample,md5,'
          + 'observable_name,observable_classification,'
          + 'file_name,file_mimetype,status,analyzers_requested,analyzers_to_execute,analysis_reports,received_request_time,'
          + 'finished_analysis_time,force_privacy,disable_external_analyzers,errors,file',
      */
    });
  }
}
