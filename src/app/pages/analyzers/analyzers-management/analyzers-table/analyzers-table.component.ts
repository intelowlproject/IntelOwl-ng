import { Component, OnInit } from '@angular/core';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';
import { LocalDataSource } from 'ng2-smart-table';
import {
  TickCrossRenderComponent,
  TickCrossExtraRenderComponent,
  JSONRenderComponent,
  PluginHealthCheckButtonRenderComponent,
} from '../../../../@theme/components/smart-table/smart-table';
import { first } from 'rxjs/operators';
import { PluginService } from 'src/app/@core/services/plugin.service';
import { ToastService } from 'src/app/@core/services/toast.service';

@Component({
  template: `
    <nb-card
      [nbSpinner]="showSpinnerBool"
      nbSpinnerStatus="primary"
      nbSpinnerSize="large"
    >
      <nb-card-body>
        <ng2-smart-table [settings]="tableSettings" [source]="tableSource">
        </ng2-smart-table>
      </nb-card-body>
    </nb-card>
  `,
})
export class AnalyzersTableComponent implements OnInit {
  // ng2-smart-table data source
  tableSource: LocalDataSource = new LocalDataSource();
  showSpinnerBool: boolean = false;

  // ng2-smart-table settings
  tableSettings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      name: {
        title: 'Analyzer Name',
      },
      type: {
        title: 'Type',
        width: '5%',
        sort: false,
        filter: {
          type: 'list',
          config: {
            list: [
              { value: 'observable', title: 'observable' },
              { value: 'file', title: 'file' },
            ],
          },
        },
      },
      description: {
        type: 'html',
        title: 'Description',
        width: '25%',
        valuePrepareFunction: (c, r) => `<small>${c}</small>`,
      },
      supports: {
        title: 'Supported types',
        type: 'custom',
        width: '10%',
        renderComponent: JSONRenderComponent,
      },
      external_service: {
        title: 'External Service',
        type: 'custom',
        width: '3%',
        filter: {
          type: 'list',
          config: {
            list: [
              { value: true, title: 'Yes' },
              { value: false, title: 'No' },
            ],
          },
        },
        renderComponent: TickCrossRenderComponent,
      },
      leaks_info: {
        title: 'Leaks Info',
        type: 'custom',
        width: '3%',
        filter: {
          type: 'list',
          config: {
            list: [
              { value: true, title: 'Yes' },
              { value: false, title: 'No' },
            ],
          },
        },
        renderComponent: TickCrossRenderComponent,
      },
      healthCheck: {
        title: 'Health Check',
        width: '3%',
        filter: false,
        sort: false,
        type: 'custom',
        renderComponent: PluginHealthCheckButtonRenderComponent,
        valuePrepareFunction: (c, r) => ({
          status: c,
          disabled: !r.docker_based,
        }),
        onComponentInitFunction: (instance: any) => {
          instance.emitter.subscribe(async (rowData) => {
            const status = await this.checkAnalyzerrHealth(rowData['name']);
            this.tableSource.update(rowData, {
              ...rowData,
              healthCheck: status,
            });
          });
        },
      },
      configured: {
        title: 'Configured',
        type: 'custom',
        width: '3%',
        filter: false,
        valuePrepareFunction: (c, r) => ({
          tick: r.verification.configured,
          tooltip: r.verification.error_message,
        }),
        renderComponent: TickCrossExtraRenderComponent,
      },
      config: {
        title: 'Configuration Parameters',
        type: 'custom',
        filterFunction: JSONRenderComponent.filterFunction,
        renderComponent: JSONRenderComponent,
      },
      secrets: {
        title: 'Secrets',
        type: 'custom',
        filterFunction: JSONRenderComponent.filterFunction,
        renderComponent: JSONRenderComponent,
      },
    },
  };

  constructor(
    private readonly analyzerService: AnalyzerConfigService,
    private readonly pluginService: PluginService,
    private readonly toastr: ToastService
  ) {}

  ngOnInit(): void {
    this.showSpinnerBool = true; // spinner on
    // rxjs/first() -> take first and complete observable
    // analyzerList available => rawAnalyzerConfig initialized
    this.analyzerService.analyzersList$.pipe(first()).subscribe((res) =>
      this.init().then(
        () => (this.showSpinnerBool = false) // spinner off
      )
    );
  }

  private init(): Promise<void> {
    const data: any[] = this.analyzerService.constructTableData();
    this.tableSource.load(data);
    // default alphabetically sort.
    this.tableSource.setSort([{ field: 'name', direction: 'asc' }]);
    return Promise.resolve();
  }

  private async checkAnalyzerrHealth(
    analyzerName: string
  ): Promise<boolean | null> {
    const result = await this.pluginService.checkPluginHealth(
      'analyzer',
      analyzerName
    );

    if (result === null) {
      this.toastr.showToast(
        'Health Check Request Failed',
        `Analyzer: ${analyzerName}`,
        'error'
      );
      return null;
    } else {
      return result.status;
    }
  }
}
