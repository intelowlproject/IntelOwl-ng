import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

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
      },
      secrets: {
        title: 'Secrets Required',
        filter: false,
      },
      active: {
        title: 'Active',
        filter: false,
      },
      healthStatus: {
        title: 'Health Status',
        filter: false,
      },
      healthCheck: {
        title: 'Health Check',
        filter: false,
      },
    },
  };

  constructor() {
    // load data into table
    this.source.load([
      {
        name: 'MISP',
        config: JSON.stringify({
          default: true,
        }),
        secrets: ['MISP_URL', 'MISP_KEY'],
        active: true,
      },
    ]);
  }
}
