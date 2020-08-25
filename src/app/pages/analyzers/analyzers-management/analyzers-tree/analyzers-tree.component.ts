import { Component, OnInit } from '@angular/core';
import { IAnalyzersList } from '../../../../@core/models/models';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';
import { first } from 'rxjs/operators';

@Component({
  template: `
    <ngx-echarts-tree
      *ngIf="treeData"
      [treeInputData]="treeData"
    ></ngx-echarts-tree>
  `,
})
export class AnalyzersTreeComponent implements OnInit {
  // Dendogram Data
  public treeData: any;

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    // rxjs/first() -> take first and complete observable
    this.analyzerService.analyzersList$
      .pipe(first())
      .subscribe((aList: IAnalyzersList) => this.initTreeData(aList));
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
  }
}
