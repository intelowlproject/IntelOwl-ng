import { Component, Input } from '@angular/core';
import { ScanService } from '../../../@core/services/scan.service';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5';
import { IScanForm } from 'src/app/@core/models/models';

@Component({
  templateUrl: './scans-management.component.html',
})
export class ScansManagementComponent {
  tabs = [
    {
      title: 'Observable Scan',
      route: './observable',
      icon: 'search-outline',
      responsive: true,
    },
    {
      title: 'File Scan',
      route: './file',
      icon: 'file-add-outline',
      responsive: true,
    },
  ];
  constructor(public readonly scanService: ScanService) {}

  public trackByFn = (index, item) => item.key;
}

@Component({
  selector: 'intelowl-base-scan',
  templateUrl: './intelowl-base-scan.component.html',
  styles: [
    `
      .json-background {
        background-color: #14192f !important;
        box-shadow: inherit;
        color: #ecedef !important;
      }
    `,
  ],
})
export class BaseScanFormComponent {
  @Input() scanForm: NgForm;
  @Input() formData: IScanForm;
  isBtnDisabled: boolean = false;
  showSpinnerBool: boolean = false;
  formDebugBool: boolean = false;

  constructor(private scanService: ScanService) {}

  isNotError816() {
    return (
      (this.formData.analyzers_requested.length ? 1 : 0) ^
      (this.formData.run_all_available_analyzers ? 1 : 0)
    );
  }

  isFormValid() {
    return (
      (this.scanForm.form.status === 'VALID' ||
        this.scanForm.form.status === 'DISABLED') &&
      this.isNotError816() &&
      !this.isBtnDisabled
    );
  }

  async onScanSubmit(): Promise<void> {
    // spinner on
    this.showSpinnerBool = true;
    if (this.formData.is_sample) {
      const fr = new FileReader();
      fr.onload = (event) => {
        this.formData.md5 = Md5.hashAsciiStr(event.target.result.toString());
      };
      fr.readAsBinaryString(this.formData.file);
      fr.onloadend = () => this.scanService.requestScan(this.formData, 'file');
    } else {
      this.formData.md5 = Md5.hashStr(this.formData.observable_name);
      this.scanService.requestScan(this.formData, 'observable');
    }
    // spinner off
    setTimeout(() => (this.showSpinnerBool = false), 1000);
  }
}
