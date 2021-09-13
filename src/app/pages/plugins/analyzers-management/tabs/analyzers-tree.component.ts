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
    this.analyzerService.analyzersList$
      .pipe(first())
      .subscribe((aList: IAnalyzersList) => {
        this.treeData = {
          name: 'IntelOwl',
          children: [
            {
              name: 'Observable Analyzers',
              children: [
                {
                  name: 'IP',
                  children: aList['ip'],
                },
                {
                  name: 'URL',
                  children: aList['url'],
                },
                {
                  name: 'Domain',
                  children: aList['domain'],
                },
                {
                  name: 'Hash',
                  children: aList['hash'],
                },
              ],
            },
            {
              name: 'File Analyzers',
              children: aList['file'],
            },
          ],
        };
        this.showSpinnerBool = false; // spinner off
      });
  }
}
