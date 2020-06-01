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
      supports: {
        title: 'Supports',
        type: 'custom',
        width: '10%',
        renderComponent: JSONRenderComponent,
      },
      additional_config_params: {
        title: 'Config Params',
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
      external_service: {
        title: 'External Service',
        type: 'custom',
        width: '3%',
        filter: {
          type: 'list',
          config: {
            list: [
              { value: true, title: 'Yes' },
              { value: 'N/A', title: 'No' },
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
              { value: 'N/A', title: 'No' },
            ],
          },
        },
        renderComponent: TickCrossRenderComponent,
      },
    },
  };

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    setTimeout(() => this.init(), 500);
  }

  private async init(): Promise<void> {
    if (this.analyzerService.rawAnalyzerConfig) {
      const data = Object.entries(this.analyzerService.rawAnalyzerConfig).map(
        ([k, v]) => {
          v['name'] = k;
          if (v.hasOwnProperty('observable_supported')) {
            v['supports'] = v['observable_supported'];
          } else {
            v['supports'] = v['supported_filetypes'];
          }
          if (!v.hasOwnProperty('external_service')) {
            v['external_service'] = 'N/A';
          }
          if (!v.hasOwnProperty('leaks_info')) {
            v['leaks_info'] = 'N/A';
          }
          return v;
        }
      );
      this.tableSource.load(data);
    }
  }
}
