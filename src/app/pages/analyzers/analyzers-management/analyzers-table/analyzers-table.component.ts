import { Component, OnInit } from '@angular/core';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';
import { LocalDataSource } from 'ng2-smart-table';
import {
  TickCrossRenderComponent,
  JSONRenderComponent,
} from '../../../../@theme/components/smart-table/smart-table';

@Component({
  template: `
    <nb-card>
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
      requires_configuration: {
        title: 'Requires Configuration',
        type: 'custom',
        width: '5%',
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
      additional_config_params: {
        title: 'Additional config',
        type: 'custom',
        filterFunction: (cell?: any, search?: string): boolean => {
          let ans: boolean = false;
          search = search.toLowerCase();
          Object.entries(cell).forEach(([k, v]: [string, string]) => {
            k = k.toString().toLowerCase();
            v = v.toString().toLowerCase();
            if (k.indexOf(search) !== -1 || v.indexOf(search) !== -1) {
              ans = true;
              return;
            }
          });
          return ans;
        },
        renderComponent: JSONRenderComponent,
      },
    },
  };

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    setTimeout(() => this.init(), 500);
  }

  private init(): void {
    if (this.analyzerService.rawAnalyzerConfig) {
      const data: any[] = this.analyzerService.constructTableData();
      this.tableSource.load(data);
      // default alphabetically sort.
      this.tableSource.setSort([{ field: 'name', direction: 'asc' }]);
    }
  }
}
