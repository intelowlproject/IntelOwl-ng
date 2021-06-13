import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ViewResultButtonComponent } from 'src/app/@theme/components/smart-table/smart-table';

@Component({
  templateUrl: './connectors-calls.component.html',
})
export class ConnectorsCallsComponent {
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
      result: {
        title: 'Result',
        type: 'custom',
        width: '3%',
        filter: false,
        sort: false,
        renderComponent: ViewResultButtonComponent,
      },
      id: {
        title: 'Id',
        filter: false,
      },
      name: {
        title: 'Name',
        filter: false,
      },
      connectorsCalled: {
        title: 'Connectors Called',
        filter: false,
      },
      processTime: {
        title: 'Process Time (s)',
        filter: false,
      },
    },
  };

  constructor() {
    // load data into table
    this.source.load([
      {
        id: 1,
        name: 'xD',
        connectorsCalled: '3/3',
        processTime: '60',
      },
    ]);
  }
}
