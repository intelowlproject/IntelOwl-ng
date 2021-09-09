import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { flash } from 'ng-animate';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import {
  JobStatusIconRenderComponent,
  PluginActionsRenderComponent,
} from '../../../@theme/components/smart-table/smart-table';
import { Job } from '../../../@core/models/models';
import { saved_jobs_for_demo } from 'src/assets/job_data';

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

  constructor(private readonly activateRoute: ActivatedRoute) {
    this.sub = this.activateRoute.params.subscribe((res) =>
      this.initData(parseInt(res.jobId))
    );
  }

  private initData(jobId: number): void {
    this.jobId = jobId;
    this.jobObj = saved_jobs_for_demo.find((o: Job) => o.id === this.jobId);
    this.updateJobData(this.jobObj);
    // simulate click event to select the first row of the table as the default one on
    setTimeout(
      () => this.onRowSelect({ data: this.jobObj.analysis_reports[0] }, false),
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
    // update job object (with partial update)
    this.jobObj = { ...this.jobObj, ...res };
    // load data into the analysis table data source
    this.analyzerTableDataSource.load(this.jobObj.analyzer_reports);
    // load data into connectors table data source
    this.connectorTableDataSource.load(this.jobObj.connector_reports);
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
    else this.imageResult = '';
  }

  ngOnDestroy(): void {
    // unsubscribe to observables to prevent memory leakage
    this.sub && this.sub.unsubscribe();
  }
}
