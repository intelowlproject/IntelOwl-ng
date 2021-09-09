import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';
import { IAnalyzerConfig } from 'src/app/@core/models/models';

@Component({
  template: `
    <nb-card
      [nbSpinner]="showSpinnerBool"
      nbSpinnerStatus="primary"
      nbSpinnerSize="large"
    >
      <nb-card-body class="row d-flex flex-wrap">
        <div
          class="col-lg-6 col-md-12 mt-2"
          *ngFor="let analyzerInfo of analyzersList"
        >
          <plugin-info-card [pluginInfo]="analyzerInfo"></plugin-info-card>
        </div>
      </nb-card-body>
    </nb-card>
  `,
})
export class AnalyzersCardsComponent implements OnInit {
  showSpinnerBool: boolean = false;
  analyzersList: IAnalyzerConfig[] = [];

  constructor(private readonly analyzerService: AnalyzerConfigService) {}

  ngOnInit(): void {
    this.showSpinnerBool = true; // spinner on
    this.analyzerService.analyzersList$.pipe(first()).subscribe((res) => {
      this.analyzersList = Object.values(
        this.analyzerService.rawAnalyzerConfig
      );
      this.showSpinnerBool = false; // spinner off
    });
  }
}
