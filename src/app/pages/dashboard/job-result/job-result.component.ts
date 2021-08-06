import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../@core/services/job.service';
import {
  JobStatusIconRenderComponent,
  PluginActionsRenderComponent,
} from '../../../@theme/components/smart-table/smart-table';
import { Job } from '../../../@core/models/models';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { trigger, transition, useAnimation } from '@angular/animations';
import { flash } from 'ng-animate';
import { PluginService } from 'src/app/@core/services/plugin.service';
import { ToastService } from 'src/app/@core/services/toast.service';

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

  // base ng2-smart-table settings for analyzer and connector reports
  private baseTableSettings = {
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
      pluginActions: {
        title: 'Actions',
        width: '15%',
        filter: false,
        sort: false,
        type: 'custom',
        renderComponent: PluginActionsRenderComponent,
      },
      name: {
        title: 'Name',
      },
      status: {
        title: 'Status',
        type: 'custom',
        filter: false,
        width: '3%',
        compareFunction: (direction, a, b) => (a === b ? 1 : -1 * direction),
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
    rowClassFunction: (row) => {
      return 'cursor-pointer';
    },
  };

  // ng2-smart-table settings for analyzer reports
  public analyzerTableSettings = {
    ...this.baseTableSettings,
    columns: {
      ...this.baseTableSettings.columns,
      pluginActions: {
        ...this.baseTableSettings.columns.pluginActions,
        onComponentInitFunction: (instance: any) => {
          instance.killEmitter.subscribe((plugin) =>
            this.killPluginHandler('analyzer', plugin)
          );
          instance.retryEmitter.subscribe((plugin) =>
            this.retryPluginHandler('analyzer', plugin)
          );
        },
      },
    },
  };

  // ng2-smart-table settings for connector reports
  public connectorTableSettings = {
    ...this.baseTableSettings,
    columns: {
      ...this.baseTableSettings.columns,
      pluginActions: {
        ...this.baseTableSettings.columns.pluginActions,
        onComponentInitFunction: (instance: any) => {
          instance.killEmitter.subscribe((plugin) =>
            this.killPluginHandler('connector', plugin)
          );
          instance.retryEmitter.subscribe((plugin) =>
            this.retryPluginHandler('connector', plugin)
          );
        },
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

  // boolean to track if connectors are running
  public connectorsRunningBool: boolean;

  // JSON Editor
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false })
  editor: JsonEditorComponent;

  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly jobService: JobService,
    private readonly toastr: ToastService,
    private readonly pluginService: PluginService
  ) {
    this.sub = this.activateRoute.params.subscribe(
      (res) => (this.jobId = res.jobId)
    );
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['text', 'tree'];
    this.editorOptions.onEditable = () => false;
  }

  ngOnInit(): void {
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

  private startJobPollingWithInterval(): void {
    // avoid multiple pollings
    clearInterval(this.pollInterval);
    const interval = this.connectorsRunningBool ? 15000 : 5000;
    this.pollInterval = setInterval(() => {
      const jobFields = this.connectorsRunningBool ? ['connector_reports'] : []; // [] means all
      this.jobService.pollForJob(this.jobId, jobFields);
    }, interval);
  }

  private initData(): void {
    // poll for changes to job result if status=running or connectors are running
    this.connectorsRunningBool = this.checkConnectorsRunning();
    if (this.jobObj.status === 'running' || this.connectorsRunningBool) {
      this.startJobPollingWithInterval();
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

  private updateJobData(res: Job): void {
    // update job object (with partial update)
    this.jobObj = { ...this.jobObj, ...res };
    // load data into the analysis table data source
    this.analyzerTableDataSource.load(this.jobObj.analyzer_reports);
    // load data into connectors table data source
    this.connectorTableDataSource.load(this.jobObj.connector_reports);
    // toggle animation
    this.toggleAnimation();
    // check if connectors are running
    this.connectorsRunningBool = this.checkConnectorsRunning();
    if (this.jobObj.status !== 'running' && !this.connectorsRunningBool) {
      // stop polling
      clearInterval(this.pollInterval);
      // converting date time to locale string
      const date1 = new Date(this.jobObj.received_request_time);
      const date2 = new Date(this.jobObj.finished_analysis_time);
      this.jobObj.received_request_time = date1.toString();
      this.jobObj.finished_analysis_time = date2.toString();
      // calculate job process time
      this.jobObj.job_process_time = (date2.getTime() - date1.getTime()) / 1000;
    }
  }

  private checkConnectorsRunning() {
    let connectorsRunning = false,
      status;
    if (this.jobObj.status === 'reported_without_fails')
      // connectors run only after this status is set
      for (const conn_report of this.jobObj.connector_reports) {
        status = conn_report.status.toLowerCase();
        if (status === 'running' || status === 'pending') {
          connectorsRunning = true;
          break;
        }
      }
    return connectorsRunning;
  }

  generateAlertMsgForConnectorReports() {
    // call only if job status != reported_without_fails
    const jobStatus = this.jobObj.status;
    if (jobStatus === 'running' || jobStatus === 'pending')
      return 'Connectors will be triggered when job analysis finishes without fails.';
    else if (['failed', 'reported_with_fails', 'killed'].includes(jobStatus))
      return 'No connectors were triggered because job analysis failed or was killed';
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

  async killPluginHandler(pluginType: string, plugin: string): Promise<void> {
    const sure = confirm('Are you sure?');
    if (!sure) return;
    const success = await this.pluginService.killPlugin(
      +this.jobObj.id,
      pluginType,
      plugin
    );
    pluginType =
      pluginType[0].toUpperCase() + pluginType.substring(1).toLowerCase();
    if (success) {
      this.toastr.showToast(
        '"killed" successfully.',
        `Job #${this.jobObj.id} ${pluginType}: ${plugin}`,
        'success'
      );
      // since plugin was running/pending, job polling already exists and will take care of updation
    } else {
      this.toastr.showToast(
        'Could not be "killed". Reason: "Insufficient Permission".',
        `Job #${this.jobObj.id} ${pluginType}: ${plugin}`,
        'error'
      );
    }
  }

  async retryPluginHandler(pluginType: string, plugin: string): Promise<void> {
    const sure = confirm('Are you sure?');
    if (!sure) return;
    const success = await this.pluginService.retryPlugin(
      +this.jobObj.id,
      pluginType,
      plugin
    );
    pluginType =
      pluginType[0].toUpperCase() + pluginType.substring(1).toLowerCase();
    if (success) {
      this.toastr.showToast(
        '"retry" request sent successfully.',
        `Job #${this.jobObj.id} ${pluginType}: ${plugin}`,
        'success'
      );
      // instant polling for an update and then at intervals
      const jobFields = pluginType === 'connector' ? ['connector_reports'] : []; // [] means all
      this.jobService.pollForJob(this.jobId, jobFields);
      this.startJobPollingWithInterval();
    } else {
      this.toastr.showToast(
        'Could not be send "retry" request. Reason: "Insufficient Permission".',
        `Job #${this.jobObj.id} ${pluginType}: ${plugin}`,
        'error'
      );
    }
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
