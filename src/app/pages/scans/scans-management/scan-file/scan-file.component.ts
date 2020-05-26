import { Component } from '@angular/core';
import { FileForm } from '../../../../@core/models/models';
import { AnalyzerConfigService } from '../../../../@core/services/analyzer-config.service';

@Component({
  selector: 'intelowl-scan-file',
  templateUrl: './scan-file.component.html',
})
export class ScanFileComponent {
  formData: FileForm;

  constructor(public analyzersService: AnalyzerConfigService) {
    this.formData = {
      is_sample: true,
      file: null,
      file_mimetype: null,
      file_name: null,
      analyzers_requested: [],
      force_privacy: false,
      disable_external_analyzers: false,
      running_only: false,
      run_all_available_analyzers: false,
      tags_id: [],
    } as FileForm;
  }

  handleFileInput(files) {
    this.formData.file = files.item(0);
    this.formData.file_name = files.item(0).name;
    this.formData.file_mimetype = files.item(0).type;
  }

}
