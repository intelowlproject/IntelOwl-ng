import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobStatusIconRenderComponent } from '../../../@theme/components/smart-table/smart-table';
import { Job } from '../../../@core/models/models';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { trigger, transition, useAnimation } from '@angular/animations';
import { flash } from 'ngx-animate';
import { saved_jobs_for_demo } from 'src/assets/job_data';
import { JobService } from 'src/app/@core/services/job.service';

@Component({
  selector: 'intelowl-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss'],
  animations: [
    trigger('refreshAnimation', [
      transition('false => true', useAnimation(flash)),
    ]),
  ],
})
export class JobResultComponent implements OnDestroy {
  // Animation
  flashAnimBool: boolean = false;
  // if true, shows error template
  public isError: boolean = false;
  // RxJS Subscription
  private sub: Subscription;

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
  public jobId: number;

  // Job Data for current jobId
  public jobTableData: Job;

  // row whose report/error is currently being shown
  public selectedRowName: string;

  // JSON Editor
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false })
  editor: JsonEditorComponent;

  constructor(private readonly activateRoute: ActivatedRoute) {
    this.sub = this.activateRoute.params.subscribe((res) =>
      this.init(res.jobId)
    );
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['text', 'tree'];
    this.editorOptions.onEditable = () => false;
  }

  init(jobId: number): void {
    this.jobId = jobId;
    const job = saved_jobs_for_demo.find((o) => o.id === this.jobId);
    this.updateJobData(job);
    // in case `run_all_available_analyzers` was true,..
    // ...then `Job.analyzers_requested is []`..
    // ...so we show `all available analyzers` so user does not gets confused.
    this.jobTableData.analyzers_requested = this.jobTableData
      .analyzers_requested.length
      ? this.jobTableData.analyzers_requested
      : 'all available analyzers';
    // just a little helper message for the user
    this.selectedRowName = "Click on a row in the table to view it's result!";
  }

  private updateJobData(res: Job): void {
    // load data into the table data source
    this.tableDataSource.load(res.analysis_reports);
    // converting date time to locale string
    const date1 = new Date(res.received_request_time);
    const date2 = new Date(res.finished_analysis_time);
    res.received_request_time = date1.toString();
    res.finished_analysis_time = date2.toString();
    // calculate job process time
    res.job_process_time = (date2.getTime() - date1.getTime()) / 1000;
    // finally assign it to our class' member variable
    this.jobTableData = res;
  }

  async getJobSample(): Promise<void> {
    alert('not present in demo');
  }

  async getJobRawJson(): Promise<void> {
    alert('not present in demo');
  }

  // event emitted when user clicks on a row in table
  async onRowSelect(event): Promise<void> {
    this.selectedRowName = event.data.name;
    this.editor.jsonEditorContainer.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // if `report` exists shows report, otherwise the `errors`
    const json = Object.entries(event.data.report).length
      ? event.data.report
      : event.data.errors;
    this.editor.update(json);
  }

  goToTop(): void {
    document.getElementById('analysis-reports-table').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  ngOnDestroy(): void {
    // unsubscribe to observables to prevent memory leakage
    this.sub && this.sub.unsubscribe();
  }
}
