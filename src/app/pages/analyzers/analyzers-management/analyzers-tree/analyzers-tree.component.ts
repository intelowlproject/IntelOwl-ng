import { Component, OnInit } from '@angular/core';
import { IAnalyzersList } from '../../../../@core/models/models';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';
import { first } from 'rxjs/operators';

@Component({
  template: `
    <nb-card
      [ngStyle]="{ 'min-height.px': 200 }"
      [nbSpinner]="showSpinnerBool"
      nbSpinnerStatus="primary"
      nbSpinnerSize="large"
    >
      <nb-card-body>
        <ngx-echarts-tree
          *ngIf="treeData"
          [treeInputData]="treeData"
        ></ngx-echarts-tree>
      </nb-card-body>
    </nb-card>
  `,
})
export class AnalyzersTreeComponent implements OnInit {
  // Dendogram Data
  public treeData: any;
  showSpinnerBool: boolean = false;

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    this.showSpinnerBool = true; // spinner on
    // rxjs/first() -> take first and complete observable
    this.analyzerService.analyzersList$
      .pipe(first())
      .subscribe((aList: IAnalyzersList) =>
        this.initTreeData(aList).then(
          () => (this.showSpinnerBool = false) // spinner off
        )
      );
  }

  private async initTreeData(aList: IAnalyzersList): Promise<void> {
    this.treeData = {
      name: 'IntelOwl',
      children: [
        {
          name: 'Observable Analyzers',
          children: [
            {
              name: 'IP',
              children: aList['ip'].map((name: string) => {
                return { name: name };
              }),
            },
            {
              name: 'URL',
              children: aList['url'].map((name: string) => {
                return { name: name };
              }),
            },
            {
              name: 'Domain',
              children: aList['domain'].map((name: string) => {
                return { name: name };
              }),
            },
            {
              name: 'Hash',
              children: aList['hash'].map((name: string) => {
                return { name: name };
              }),
            },
          ],
        },
        {
          name: 'File Analyzers',
          children: aList['file'].map((name: string) => {
            return { name: name };
          }),
        },
      ],
    };
    return Promise.resolve();
  }
}
