import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IObservableAnalyzers } from '../../../../@core/models/models';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';

@Component({
  selector: 'ngx-analyzers-tree',
  template: `
    <echarts-tree [treeInputData]="treeData"></echarts-tree>
  `,
})
export class AnalyzersTreeComponent implements OnInit, OnDestroy {

  // Dendogram Data
  public treeData: any;
  private sub1: Subscription;
  private sub2: Subscription;
  private fileAnalyzersArr: any[];
  private obsAnalyzers: IObservableAnalyzers;

  constructor(private analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    this.sub1 = this.analyzerService.fileAnalyzers$.subscribe((arr: any[]) => this.fileAnalyzersArr = arr);
    this.sub2 = this.analyzerService.observableAnalyzers$.subscribe((obj: IObservableAnalyzers) => this.obsAnalyzers = obj);
    this.initTreeData();
  }

  initTreeData() {
    this.treeData = {
      name: 'IntelOwl',
      children: [
        {
          name: 'Observable Analyzers',
          children: [
            {
              name: 'IP',
              children: this.obsAnalyzers['ip'].map(o => {
                return { name: o.name };
              }),
            },
            {
              name: 'URL',
              children: this.obsAnalyzers['url'].map(o => {
                return { name: o.name };
              }),
            },
            {
              name: 'Domain',
              children: this.obsAnalyzers['domain'].map(o => {
                return { name: o.name };
              }),
            },
            {
              name: 'Hash',
              children: this.obsAnalyzers['hash'].map(o => {
                return { name: o.name };
              }),
            },
          ],
        },
        {
          name: 'File Analyzers',
          children: this.fileAnalyzersArr.map(o => {
            return { name: o.name };
          }),
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
  }

}
