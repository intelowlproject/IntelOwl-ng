import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IScanForm } from '../../../../@core/models/models';

@Component({
  templateUrl: './scan-file.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanFileComponent {
  formData: IScanForm;

  constructor() {
    this.formData = {
      classification: 'file',
      file: null,
      file_name: null,
      analyzers_requested: [],
      force_privacy: false,
      disable_external_analyzers: false,
      check_existing_or_force: 'check_all',
      private: false,
      run_all_available_analyzers: false,
      tags_id: [],
    } as IScanForm;
  }

  handleFileInput(files) {
    this.formData.file = files.item(0);
    this.formData.file_name = files.item(0).name;
  }
}
