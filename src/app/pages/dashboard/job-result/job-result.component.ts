import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../@core/services/job.service';
import { JobStatusIconRenderComponent } from '../../../@theme/components/smart-table/smart-table';
import { Job } from '../../../@core/models/models';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { trigger, transition, useAnimation } from '@angular/animations';
import { flash } from 'ng-animate';

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
export class JobResultComponent implements OnInit, OnDestroy {
  // Animation
  flashAnimBool: boolean = false;
  private toggleAnimation = () => (this.flashAnimBool = !this.flashAnimBool);
  // if true, shows error template
  public isError: boolean = false;
  // RxJS Subscription
  private sub: Subscription;

  // interval var
  private pollInterval: any;

  // image viewer var
  public imageResult: string = '';

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
      status: {
        title: 'Status',
        type: 'custom',
        filter: false,
        width: '3%',
        compareFunction: this.compareReportStatus,
        renderComponent: JobStatusIconRenderComponent,
      },
      process_time: {
        title: 'Process Time (s)',
        filter: false,
        valuePrepareFunction: (c) => parseFloat(c).toFixed(2),
      },
      start_time: {
        title: 'Start Time',
        filter: false,
        valuePrepareFunction: (c, r) => new Date(r.start_time).toLocaleString(),
      },
    },
  };

  // ng2-smart-table data source
  public analyzerTableDataSource: LocalDataSource = new LocalDataSource();
  public connectorTableDataSource: LocalDataSource = new LocalDataSource();

  // Job ID whose result is being displayed
  public jobId: number;

  // Job Data for current jobId
  public jobObj: Job;

  // row whose report/error is currently being shown
  public selectedRowName: string;

  // JSON Editor
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false })
  editor: JsonEditorComponent;

  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly jobService: JobService
  ) {
    this.sub = this.activateRoute.params.subscribe(
      (res) => (this.jobId = res.jobId)
    );
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['text', 'tree'];
    this.editorOptions.onEditable = () => false;
  }

  ngOnInit(): void {
    // set sorting for data sources
    const sortingConf = [
      { field: 'name', direction: 'asc' }, // secondary sort
      { field: 'status', direction: 'asc', compare: this.compareReportStatus }, // primary sort
    ];
    this.analyzerTableDataSource.setSort(sortingConf);
    this.connectorTableDataSource.setSort(sortingConf);

    // subscribe to jobResult
    this.jobService
      .pollForJob(this.jobId)
      .then(() => {
        this.sub.add(
          this.jobService.jobResult$.subscribe((res: Job) =>
            this.updateJobData(res)
          )
        );
        // only called once
        this.initData();
      })
      .catch(() => (this.isError = true));
  }

  private initData(): void {
    // poll for changes to job result if status=running
    if (this.jobObj.status === 'running') {
      this.pollInterval = setInterval(
        () => this.jobService.pollForJob(this.jobId),
        5000
      );
    }
    // in case `run_all_available_analyzers` was true,..
    // ...then `Job.analyzers_requested is []`..
    // ...so we show `all available analyzers` so user does not gets confused.
    this.jobObj.analyzers_requested = this.jobObj.analyzers_requested.length
      ? this.jobObj.analyzers_requested
      : 'all available analyzers';
    // simulate click event to select the first row of the table as the default one on
    setTimeout(
      () => this.onRowSelect({ data: this.jobObj.analyzer_reports[0] }, false),
      500
    );
  }

  private compareReportStatus(direction: number, a: string, b: string) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const priority = {
      success: 0,
      failed: 1,
      killed: 2,
      running: 3,
      pending: 4,
    };

    return priority[a] < priority[b] ? -1 * direction : direction;
  }

  private updateJobData(res: Job): void {
    // load data into the analysis table data source
    this.analyzerTableDataSource.load(res.analyzer_reports);
    // load data into connectors table data source
    this.connectorTableDataSource.load(res.connector_reports);
    // toggle animation
    this.toggleAnimation();
    if (res.status !== 'running') {
      // stop polling
      clearInterval(this.pollInterval);
      // converting date time to locale string
      const date1 = new Date(res.received_request_time);
      const date2 = new Date(res.finished_analysis_time);
      res.received_request_time = date1.toString();
      res.finished_analysis_time = date2.toString();
      // calculate job process time
      res.job_process_time = (date2.getTime() - date1.getTime()) / 1000;
    }
    // finally assign it to our class' member variable
    this.jobObj = res;
  }

  generateAlertMsgForConnectorReports() {
    // call only if job status != reported_without_fails
    const jobStatus = this.jobObj.status;
    if (jobStatus === 'running' || jobStatus === 'pending')
      return 'Connectors will be triggered when job analysis finishes without fails.';
    else if (['failed', 'reported_with_fails', 'killed'].includes(jobStatus))
      return 'No connectors were triggered because job analysis failed or was killed';
  }

  generateReportTableMetrics(pluginType: string) {
    let pluginReports: any[],
      numpluginsToExecute: number,
      running = 0,
      completed = 0;
    if (pluginType === 'analyzer') {
      pluginReports = this.jobObj.analyzer_reports;
      numpluginsToExecute = this.jobObj.analyzers_to_execute.length;
    } else {
      pluginReports = this.jobObj.connector_reports;
      numpluginsToExecute = this.jobObj.connectors_to_execute.length;
    }
    for (const report of pluginReports) {
      const status = report.status.toLowerCase();
      if (status === 'running') running++;
      else if (status !== 'pending') completed++;
    }
    return `Started: ${pluginReports.length}/${numpluginsToExecute}, ${
      running > 0 ? `Running: ${running}/${numpluginsToExecute},` : ``
    } Completed: ${completed}/${numpluginsToExecute}`;
  }

  // event emitted when user clicks on a row in table
  onRowSelect(event, shouldScroll: boolean = true): void {
    this.selectedRowName = event.data.name;
    if (shouldScroll)
      this.editor.jsonEditorContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    // if `report` exists shows report, otherwise the `errors`
    const json = Object.entries(event.data.report).length
      ? event.data.report
      : event.data.errors;
    this.editor.update(json);

    if (
      Object.prototype.hasOwnProperty.call(json, 'screenshot') &&
      json['screenshot'].length
    )
      this.imageResult = json.screenshot;
  }

  goToTop(): void {
    document.getElementsByClassName('layout-container')[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  ngOnDestroy(): void {
    // cancel job result polling
    this.pollInterval && clearInterval(this.pollInterval);
    // unsubscribe to observables to prevent memory leakage
    this.sub && this.sub.unsubscribe();
  }
}
