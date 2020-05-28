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

  // RxJS subscription
  private sub: Subscription;

  // ng2-smart-table settings
  public settings = {
    attr: {
      class: 'cursor-pointer',
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: false,
      perPage: 10,
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
  public tableDatasource: LocalDataSource = new LocalDataSource();

  // Job ID whose result is being displayed
  private jobId: number;

  // Job Data for current jobId
  public jobTableData: Job;

  // row whose report/error is currently being shown
  public selectedRowName: string;
  public selectedRowData: any;

  constructor(private readonly activateRoute: ActivatedRoute, private readonly jobService: JobService) {
    this.sub = this.activateRoute.params.subscribe(res => this.jobId = res.jobId);
  }

  ngOnInit(): void {
    this.jobService.getJob(this.jobId).then((res) => {
      // load data into the table data source
      this.tableDatasource.load(res.analysis_reports);
      // choosing first row as the default selected row
      this.selectedRowName = res.analysis_reports[0].name;
      this.selectedRowData = res.analysis_reports[0];
      // manipulating date time to show as locale string
      const date1 = new Date(res.received_request_time);
      const date2 = new Date(res.finished_analysis_time);
      res.received_request_time = date1.toLocaleString();
      res.finished_analysis_time = date2.toLocaleString();
      // finally assign it to our class variable
      this.jobTableData = res;
      // calculate job process time
      this.jobTableData['job_process_time'] = Math.abs(date2.getUTCSeconds() - date1.getUTCSeconds());
    });
  }

  // event emitted when user clicks on a row in table
  onRowSelect(event): void {
    this.selectedRowName = event.data.name;
    // if `report exists shows report, otherwise the `errors`
    this.selectedRowData = (Object.entries(event.data.report).length) ? event.data.report : event.data.errors;
  }

  // super-hacky way used in template to render the JSON report recursively
  getObjectType(val): string {
    if (typeof (val) === 'object') {
      if (Array.isArray(val)) {
        if (val.length <= 1 && typeof(val[0]) === 'object') {
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
    this.sub && this.sub.unsubscribe();
  }

}
