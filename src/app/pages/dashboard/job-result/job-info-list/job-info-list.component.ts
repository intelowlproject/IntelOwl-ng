import { Component, Input } from '@angular/core';
import { Job } from 'src/app/@core/models/models';

@Component({
  selector: 'intelowl-job-info-list',
  templateUrl: './job-info-list.component.html',
  styleUrls: ['./job-info-list.component.scss'],
})
export class JobInfoListComponent {
  // Current Job Data
  @Input() jobObj: Job;

  get runtimeConfiguration(): Record<string, Record<string, any>> {
    return this.jobObj.analyzer_reports.reduce(
      (acc, { name, runtime_configuration: runtimeConf }) =>
        Object.keys(runtimeConf).length > 0
          ? {
              ...acc,
              [name]: runtimeConf,
            }
          : acc,
      {}
    );
  }
}
