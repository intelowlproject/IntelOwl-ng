import { Component } from '@angular/core';
import { ObservableForm } from '../../../../@core/models/models';


@Component({
  selector: 'intelowl-scan-observable',
  templateUrl: './scan-observable.component.html',
})
export class ScanObservableComponent {

  formData: ObservableForm;

  constructor() {
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

}
