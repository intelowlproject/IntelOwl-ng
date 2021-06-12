import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  ConnectorActiveToggleRenderComponent,
  ConnectorHealthCheckButtonRenderComponent,
  ConnectorHealthStatusRenderComponent,
  JSONRenderComponent,
} from 'src/app/@theme/components/smart-table/smart-table';

@Component({
  templateUrl: './connectors-home.component.html',
})
export class ConnectorsHomeComponent {
  // ng2-smart-table data source
  source: LocalDataSource = new LocalDataSource();

  // ng2-smart-table settings
  settings = {
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
        filter: false,
      },
      config: {
        title: 'Configurations Added',
        filter: false,
        type: 'custom',
        renderComponent: JSONRenderComponent,
      },
      secrets: {
        title: 'Secrets Required',
        filter: false,
        type: 'html',
        valuePrepareFunction: (c, r) => {
          let result: string = '';
          c.forEach((sec) => {
            result += sec.set ? `${sec.name}<br>` : `${sec.name} (missing)<br>`;
          });
          return result;
        },
      },
      active: {
        title: 'Active',
        filter: false,
        type: 'custom',
        renderComponent: ConnectorActiveToggleRenderComponent,
      },
      health: {
        title: 'Health Status',
        filter: false,
        type: 'custom',
        renderComponent: ConnectorHealthStatusRenderComponent,
      },
      healthCheck: {
        title: 'Health Check',
        filter: false,
        type: 'custom',
        renderComponent: ConnectorHealthCheckButtonRenderComponent,
      },
    },
  };

  constructor() {
    // load data into table
    this.source.load([
      {
        name: 'MISP',
        config: {
          default: true,
        },
        secrets: [
          {
            name: 'MISP_URL',
            set: false,
          },
          {
            name: 'MISP_KEY',
            set: true,
          },
        ],
        active: true,
        health: {
          status: 'Healthy',
          lastChecked: 'just now',
        },
      },
    ]);
  }
}
