import { Component, Input, OnInit } from '@angular/core';
import { ScanService } from '../../../@core/services/scan.service';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5';
import { file_analyzers } from '../../../../assets/analyzers_list';
import { observable_analyzers } from '../../../../assets/analyzers_list';

@Component({
  selector: 'scans-management',
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
  constructor(public scanService: ScanService) {}

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
    }`,
  ],
})
export class BaseScanFormComponent implements OnInit {

  @Input() scanForm: NgForm;
  @Input() formData: any;
  forceNewScanBool: boolean;
  formDebugBool: boolean;
  analyzers_list: string[];

  constructor(private scanService: ScanService) {}

  ngOnInit(): void {
    if (this.formData.is_sample) {
      this.analyzers_list = file_analyzers.map(analyzer => analyzer.name);
    } else {
      this.analyzers_list = observable_analyzers.map(analyzer => analyzer.name);
    }
  }

  isError816() {
    return (
      (this.formData.analyzers_requested.length ? 1 : 0)
      ^
      (this.formData.run_all_available_analyzers ? 1 : 0)
    );
  }

  isFormValid() {
    return (
      (this.scanForm.form.status === 'VALID' || this.scanForm.form.status === 'DISABLED')
      && this.isError816()
    );
  }

  onScanSubmit() {
    if (this.formData.is_sample) {
      const fr = new FileReader();
      fr.onload = (event) => {
        this.formData.md5 = Md5.hashAsciiStr(event.target.result.toString());
      };
      fr.readAsBinaryString(this.formData.file);
      fr.onloadend = () => this.scanService.requestScan(this.formData, 'file', this.forceNewScanBool);
    } else {
      this.formData.md5 = Md5.hashStr(this.formData.observable_name);
      this.scanService.requestScan(this.formData, 'observable', this.forceNewScanBool);
    }
  }

}

