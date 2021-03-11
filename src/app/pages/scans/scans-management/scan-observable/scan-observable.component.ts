import { Component } from '@angular/core';
import { IScanForm } from '../../../../@core/models/models';

@Component({
  templateUrl: './scan-observable.component.html',
})
export class ScanObservableComponent {
  public formData: IScanForm;
  public obsPlaceholder: string = '8.8.8.8';
  public obsPattern: string = '[.0-9]*';

  constructor() {
    this.formData = {
      classification: 'ip',
      observable_name: null,
      analyzers_requested: [],
      force_privacy: false,
      disable_external_analyzers: false,
      check_existing_or_force: 'check_all',
      private: false,
      run_all_available_analyzers: false,
      tags_id: [],
      runtime_configuration: {},
    } as IScanForm;
  }

  onObsClassificationChange(): void {
    switch (this.formData.classification) {
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
        this.obsPattern = '^(www)?[.]?[-_a-zA-Z0-9]+([.][a-z0-9]+)+$';
        break;
      case 'hash':
        this.obsPlaceholder = '446c5fbb11b9ce058450555c1c27153c';
        this.obsPattern = '^[a-zA-Z0-9]{4,}$';
        break;
      case 'generic':
        this.obsPlaceholder = 'email, phone no., city, country, registry etc.';
        this.obsPattern = '.*';
        break;
      default:
        break;
    }
  }
}
