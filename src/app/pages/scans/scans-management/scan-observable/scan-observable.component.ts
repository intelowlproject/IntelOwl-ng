import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ObservableForm,
  IObservableAnalyzers,
} from '../../../../@core/models/models';
import { Subscription } from 'rxjs';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';

@Component({
  templateUrl: './scan-observable.component.html',
})
export class ScanObservableComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public obsAnalyzers: IObservableAnalyzers;
  public formData: ObservableForm;
  public obsPlaceholder: string = '8.8.8.8';
  public obsPattern: string = '[.0-9]*';

  constructor(private readonly analyzersService: AnalyzerConfigService) {
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
      (res) => (this.obsAnalyzers = res),
      (err) => console.error(err)
    );
  }

  onObsClassificationChange() {
    delete this.formData.analyzers_requested;
    this.formData.analyzers_requested = [];
    switch (this.formData.observable_classification) {
      case 'ip':
        this.obsPlaceholder = '8.8.8.8';
        this.obsPattern = '[.0-9]*';
        break;
      case 'url':
        this.obsPlaceholder = 'http://example.com/';
        this.obsPattern = '(www.|http://|https://).*';
        break;
      case 'domain':
        this.obsPlaceholder = 'scanme.org';
        this.obsPattern = '^(www)?[.]?[-_a-zA-Z0-9]+[.][a-z0-9]+$';
        break;
      case 'hash':
        this.obsPlaceholder = '446c5fbb11b9ce058450555c1c27153c';
        this.obsPattern = '^[a-zA-Z0-9]{4,}$';
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
