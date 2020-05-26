import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObservableForm, IObservableAnalyzers } from '../../../../@core/models/models';
import { Subscription } from 'rxjs';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';


@Component({
  selector: 'intelowl-scan-observable',
  templateUrl: './scan-observable.component.html',
})
export class ScanObservableComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public obsAnalyzers: IObservableAnalyzers;
  public formData: ObservableForm;

  constructor(private analyzersService: AnalyzerConfigService) {
    this.formData = {
      is_sample: false,
      observable_classification: 'ip',
      observable_name: null,
      analyzers_requested: [],
      force_privacy: false,
      disable_external_analyzers: false,
      running_only: false,
      run_all_available_analyzers: true,
      tags_id: [],
    } as ObservableForm;
  }

  ngOnInit(): void {
    this.sub = this.analyzersService.observableAnalyzers$.subscribe(
      res => this.obsAnalyzers = res,
      err => console.error(err),
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
