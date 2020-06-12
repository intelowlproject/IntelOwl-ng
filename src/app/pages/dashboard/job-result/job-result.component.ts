import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../@core/services/job.service';
import { JobStatusIconRenderComponent } from '../../../@theme/components/smart-table/smart-table';
import { Job } from '../../../@core/models/models';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'intelowl-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss'],
})
export class JobResultComponent implements OnInit, OnDestroy {
  // RxJS subscriptions
  private sub: Subscription;
  private sub2: Subscription;

  // interval var
  private pollInterval: any;

  // ng2-smart-table settings
  public tableSettings = {
    attr: {
      class: 'cursor-pointer',
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      name: {
        title: 'Name',
      },
      success: {
        title: 'Success',
        type: 'custom',
        filter: false,
        width: '3%',
        renderComponent: JobStatusIconRenderComponent,
      },
      process_time: {
        title: 'Process Time (s)',
        filter: false,
        valuePrepareFunction: (c) => c.toFixed(2),
      },
      started_time_str: {
        title: 'Start Time',
        filter: false,
        valuePrepareFunction: (c) => new Date(c).toLocaleString(),
      },
    },
  };

  // ng2-smart-table data source
  public tableDataSource: LocalDataSource = new LocalDataSource();

  // Job ID whose result is being displayed
  private jobId: number;

  // Job Data for current jobId
  public jobTableData: Job;

  // row whose report/error is currently being shown
  public selectedRowName: string;
  public selectedRowData: any;

  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly jobService: JobService
  ) {
    this.sub = this.activateRoute.params.subscribe(
      (res) => (this.jobId = res.jobId)
    );
  }

  ngOnInit(): void {
    // subscribe to jobResult
    this.jobService.pollForJob(this.jobId).then(() => {
      this.sub2 = this.jobService.jobResult$.subscribe((res: Job) =>
        this.initData(res)
      );
      // set the first row as the default selected row
      this.selectedRowData = this.jobTableData.analysis_reports[0];
      this.selectedRowName = this.jobTableData.analysis_reports[0].name;
    });
    // poll for changes to job result, this is cancelled asap if Job.status!=running
    this.pollInterval = setInterval(
      () => this.jobService.pollForJob(this.jobId),
      5000
    );
  }

  private async initData(res: Job): Promise<void> {
    // load data into the table data source
    this.tableDataSource.load(res.analysis_reports);
    const modifiedRes = this.modifyDataForView(res);
    // finally assign it to our class' member variable
    this.jobTableData = modifiedRes;
  }

  private modifyDataForView(res: Job): Job {
    // in case `run_all_available_analyzers` was true,..
    // ...then `Job.analyzers_requested is []`..
    // ...so we show `all available analyzers` so user does not gets confused.
    res.analyzers_requested = res.analyzers_requested.length
      ? res.analyzers_requested
      : 'all available analyzers';
    const date1 = new Date(res.received_request_time);
    res.received_request_time = date1.toLocaleString();
    if (res.status !== 'running') {
      // stop polling
      clearInterval(this.pollInterval);
      // converting date time to locale string
      const date2 = new Date(res.finished_analysis_time);
      res.finished_analysis_time = date2.toLocaleString();
      // calculate job process time
      res.job_process_time = Math.abs(
        date2.getUTCSeconds() - date1.getUTCSeconds()
      );
    }
    return res;
  }

  async getJobSample(): Promise<void> {
    const url: string = await this.jobService.downloadJobSample(this.jobId);
    window.open(url);
  }

  async getJobRawJson(): Promise<void> {
    const url: string = await this.jobService.downloadJobRawJson(this.jobId);
    window.open(url);
  }

  // event emitted when user clicks on a row in table
  onRowSelect(event) {
    this.selectedRowName = event.data.name;
    // if `report` exists shows report, otherwise the `errors`
    this.selectedRowData = Object.entries(event.data.report).length
      ? event.data.report
      : event.data.errors;
    document
      .getElementById('selected-row-report')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // super-hacky way used in template to render the JSON report recursively
  getObjectType(val): string {
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        if (val.length <= 1 && typeof val[0] === 'object') {
          return 'object_array';
        } else {
          return 'string';
        }
      } else if (val === null) {
        return 'string';
      } else {
        return 'object';
      }
    }
    return 'string';
  }

  ngOnDestroy(): void {
    // cancel job result polling
    this.pollInterval && clearInterval(this.pollInterval);
    // unsubscribe to observables to prevent memory leakage
    this.sub && this.sub.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
  }
}
