import Dexie from 'dexie';

export class DexieService extends Dexie {

  constructor() {

    super('AppDatabase');

    this.version(1).stores({
      user: '++id,username,email,token',
      tags: '++label,color',
      jobs: '++id,source,tags,is_sample,md5,'
          + 'observable_name,observable_classification,'
          + 'file_name,file_mimetype,status,analyzers_requested,analyzers_to_execute,analysis_reports,received_request_time,'
          + 'finished_analysis_time,force_privacy,disable_external_analyzers,errors,file',
    });
  }
}
