import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { first } from 'rxjs/operators';
import { ConnectorConfigService } from 'src/app/@core/services/connector-config.service';
import {
  TickCrossExtraRenderComponent,
  TickCrossRenderComponent,
  TLPRenderComponent,
  DescriptionRenderComponent,
  PopoverOnCellHoverComponent,
} from 'src/app/@theme/components/smart-table/smart-table';
import {
  PluginHealthCheckButtonRenderComponent,
  PluginInfoCardComponent,
} from '../../lib/components';

@Component({
  template: `
    <nb-card
      fullWidth
      [nbSpinner]="showSpinnerBool"
      nbSpinnerStatus="primary"
      nbSpinnerSize="large"
    >
      <nb-card-header>
        <span>Connectors - count: {{ tableSource.count() }}</span>
      </nb-card-header>
      <nb-card-body>
        <ng2-smart-table [settings]="tableSettings" [source]="tableSource">
        </ng2-smart-table>
      </nb-card-body>
    </nb-card>
  `,
})
export class ConnectorsTableComponent implements OnInit {
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
      },
      description: {
        title: 'Description',
        type: 'custom',
        renderComponent: DescriptionRenderComponent,
      },
      moreInfo: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        valuePrepareFunction: (c, r) => ({
          component: PluginInfoCardComponent,
          context: { pluginInfo: r },
        }),
        renderComponent: PopoverOnCellHoverComponent,
      },
      disabled: {
        title: 'Active',
        filter: false,
        type: 'custom',
        valuePrepareFunction: (c, r) => !c, // disabled = !active
        renderComponent: TickCrossRenderComponent,
      },
      configured: {
        title: 'Configured',
        filter: false,
        type: 'custom',
        valuePrepareFunction: (c, r) => ({
          tick: r.verification.configured,
          tooltip: r.verification.error_message,
        }),
        renderComponent: TickCrossExtraRenderComponent,
      },
      maximum_tlp: {
        title: 'Maximum TLP',
        type: 'custom',
        renderComponent: TLPRenderComponent,
      },
      healthCheck: {
        title: 'Health Check',
        filter: false,
        sort: false,
        type: 'custom',
        renderComponent: PluginHealthCheckButtonRenderComponent,
        valuePrepareFunction: (c, r) => ({ status: c, disabled: false }),
        onComponentInitFunction: (instance: any) => {
          instance.emitter.subscribe(async (rowData) => {
            const status = await this.connectorService.checkConnectorHealth(
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

  constructor(private readonly connectorService: ConnectorConfigService) {}

  ngOnInit(): void {
    this.showSpinnerBool = true; // spinner on
    // rxjs/first() -> take first and complete observable
    this.connectorService.connectorsList$.pipe(first()).subscribe((res) => {
      this.tableSource.load(res);
      // default alphabetically sort.
      this.tableSource.setSort([{ field: 'name', direction: 'asc' }]);
      this.showSpinnerBool = false; // spinner off
    });
  }
}
