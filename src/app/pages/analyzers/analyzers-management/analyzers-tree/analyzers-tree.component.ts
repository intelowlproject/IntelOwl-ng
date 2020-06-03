import { Component, OnInit, OnDestroy } from '@angular/core';
import { zip, Subscription } from 'rxjs';
import { IObservableAnalyzers } from '../../../../@core/models/models';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';

@Component({
  template: `
    <ngx-echarts-tree
      *ngIf="treeData"
      [treeInputData]="treeData"
    ></ngx-echarts-tree>
  `,
})
export class AnalyzersTreeComponent implements OnInit, OnDestroy {
  // Dendogram Data
  public treeData: any;
  private sub: Subscription;
  private fileAnalyzersArr: any[];
  private obsAnalyzers: IObservableAnalyzers;

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    // rxjs/zip -> After all observables emit, emit values as an array
    this.sub = zip(
      this.analyzerService.fileAnalyzers$,
      this.analyzerService.observableAnalyzers$
    ).subscribe(
      ([fa, oa]) => {
        this.fileAnalyzersArr = fa;
        this.obsAnalyzers = oa;
        this.initTreeData();
      },
      (err) => console.error(err)
    );
  }

  private async initTreeData(): Promise<void> {
    this.treeData = {
      name: 'IntelOwl',
      children: [
        {
          name: 'Observable Analyzers',
          children: [
            {
              name: 'IP',
              children: this.obsAnalyzers['ip'].map((o) => {
                return { name: o.name };
              }),
            },
            {
              name: 'URL',
              children: this.obsAnalyzers['url'].map((o) => {
                return { name: o.name };
              }),
            },
            {
              name: 'Domain',
              children: this.obsAnalyzers['domain'].map((o) => {
                return { name: o.name };
              }),
            },
            {
              name: 'Hash',
              children: this.obsAnalyzers['hash'].map((o) => {
                return { name: o.name };
              }),
            },
          ],
        },
        {
          name: 'File Analyzers',
          children: this.fileAnalyzersArr.map((o) => {
            return { name: o.name };
          }),
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
}
