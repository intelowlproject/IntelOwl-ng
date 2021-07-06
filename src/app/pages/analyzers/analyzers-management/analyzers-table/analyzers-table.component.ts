import { Component, OnInit } from '@angular/core';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';
import { LocalDataSource } from 'ng2-smart-table';
import {
  TickCrossRenderComponent,
  TickCrossExtraRenderComponent,
  JSONRenderComponent,
} from '../../../../@theme/components/smart-table/smart-table';
import { first } from 'rxjs/operators';

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
      config: {
        title: 'Configuration Parameters',
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
      secrets: {
        title: 'Secrets',
        type: 'custom',
        width: '5%',
        renderComponent: JSONRenderComponent,
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
    },
  };

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

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
}
