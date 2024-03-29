import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';
import {
  TickCrossRenderComponent,
  ConfiguredIconComponent,
  ListCellComponent,
  PopoverOnCellHoverComponent,
  tableBooleanFilter,
  tableBooleanInverseFilter,
} from '../../../../@theme/components/smart-table/smart-table';
import {
  PluginInfoCardComponent,
  PluginHealthCheckButtonRenderComponent,
} from '../../lib/components';

@Component({
  template: `
    <nb-card
      [nbSpinner]="showSpinnerBool"
      nbSpinnerStatus="primary"
      nbSpinnerSize="large"
    >
      <nb-card-header>
        <span>Analyzers - count: {{ tableSource.count() }}</span>
      </nb-card-header>
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
        title: 'Name',
        width: '10%',
      },
      description: {
        title: 'More Info',
        type: 'custom',
        width: '5%',
        filter: false,
        sort: false,
        valuePrepareFunction: (c, r) => ({
          component: PluginInfoCardComponent,
          context: { pluginInfo: r },
        }),
        renderComponent: PopoverOnCellHoverComponent,
      },
      disabled: {
        title: 'Active',
        type: 'custom',
        width: '3%',
        filter: tableBooleanInverseFilter,
        sort: false,
        valuePrepareFunction: (c, r) => !c, // disabled = !active
        renderComponent: TickCrossRenderComponent,
      },
      configured: {
        title: 'Configured',
        type: 'custom',
        width: '3%',
        filter: false,
        sort: false,
        valuePrepareFunction: (c, r) => r.verification.configured,
        renderComponent: ConfiguredIconComponent,
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
      supports: {
        title: 'Supported types',
        type: 'custom',
        width: '15%',
        renderComponent: ListCellComponent,
      },
      external_service: {
        title: 'External Service',
        type: 'custom',
        width: '3%',
        filter: tableBooleanFilter,
        sort: false,
        renderComponent: TickCrossRenderComponent,
      },
      leaks_info: {
        title: 'Leaks Info',
        type: 'custom',
        width: '3%',
        filter: tableBooleanFilter,
        sort: false,
        renderComponent: TickCrossRenderComponent,
      },
      healthCheck: {
        title: 'Health Check',
        type: 'custom',
        width: '3%',
        filter: false,
        sort: false,
        renderComponent: PluginHealthCheckButtonRenderComponent,
        valuePrepareFunction: (c, r) => ({
          status: c,
          disabled: !r.docker_based,
        }),
        onComponentInitFunction: (instance: any) => {
          instance.emitter.subscribe(async (rowData) => {
            const status = await this.analyzerService.checkAnalyzerHealth(
              rowData['name']
            );
            this.tableSource.update(rowData, {
              ...rowData,
              healthCheck: status,
            });
          });
        },
      },
    },
  };

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    this.showSpinnerBool = true; // spinner on
    // rxjs/first() -> take first and complete observable
    // analyzerList available => rawAnalyzerConfig initialized
    this.analyzerService.analyzersList$.pipe(first()).subscribe((res) => {
      const data: any[] = this.analyzerService.constructTableData();
      this.tableSource.load(data);
      // default alphabetically sort.
      this.tableSource.setSort([{ field: 'name', direction: 'asc' }]);
      this.showSpinnerBool = false; // spinner off
    });
  }
}
