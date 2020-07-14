import { Component, Input } from '@angular/core';
import { ScanService } from '../../../@core/services/scan.service';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5';
import { AnalyzerConfigService } from 'src/app/@core/services/analyzer-config.service';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { NbDialogService } from '@nebular/theme';
import { AppJsonEditorComponent } from 'src/app/@theme/components/app-json-editor/app-json-editor.component';
import { IRawAnalyzerConfig } from 'src/app/@core/models/models';

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
  @Input() formData: any;
  showSpinnerBool: boolean = false;
  forceNewScanBool: boolean = false;
  formDebugBool: boolean = false;

  // JSON Editor
  private editorOptions: JsonEditorOptions;

  constructor(
    private readonly scanService: ScanService,
    private readonly analyzersService: AnalyzerConfigService,
    private dialogService: NbDialogService
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code'];
    this.editorOptions.mode = 'code';
  }

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
      this.isNotError816()
    );
  }

  configParams() {
    const config: any[] = [];
    this.analyzersService.rawAnalyzerConfig.forEach(
      (ac: IRawAnalyzerConfig) => {
        if (
          this.formData.analyzers_requested.includes(ac.name) &&
          ac.additional_config_params
        ) {
          const obj = {};
          obj[ac.name] = ac.additional_config_params;
          config.push(obj);
        }
      }
    );
    this.dialogService
      .open(AppJsonEditorComponent, {
        context: {
          editorOptions: this.editorOptions,
          data: config,
        },
        hasBackdrop: false,
        closeOnEsc: false,
      })
      .onClose.subscribe((d) => (this.formData.analyzers_config = d));
  }

  async onScanSubmit() {
    // spinner on
    this.showSpinnerBool = true;
    if (this.formData.is_sample) {
      const fr = new FileReader();
      fr.onload = (event) => {
        this.formData.md5 = Md5.hashAsciiStr(event.target.result.toString());
      };
      fr.readAsBinaryString(this.formData.file);
      fr.onloadend = () =>
        this.scanService.requestScan(
          this.formData,
          'file',
          this.forceNewScanBool
        );
    } else {
      this.formData.md5 = Md5.hashStr(this.formData.observable_name);
      this.scanService.requestScan(
        this.formData,
        'observable',
        this.forceNewScanBool
      );
    }
    // spinner off
    setTimeout(() => (this.showSpinnerBool = false), 1000);
  }
}
