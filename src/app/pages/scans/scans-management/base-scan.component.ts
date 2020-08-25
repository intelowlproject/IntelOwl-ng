import { ScanService } from 'src/app/@core/services/scan.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  IScanForm,
  IAnalyzersList,
  IRawAnalyzerConfig,
} from 'src/app/@core/models/models';
import { Md5 } from 'ts-md5';
import { AnalyzerConfigService } from 'src/app/@core/services/analyzer-config.service';
import { first } from 'rxjs/operators';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { NbDialogService } from '@nebular/theme';
import { AppJsonEditorComponent } from 'src/app/@theme/components/app-json-editor/app-json-editor.component';

@Component({
  selector: 'intelowl-base-scan',
  templateUrl: './base-scan.component.html',
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
export class BaseScanFormComponent implements OnInit {
  @Input() scanForm: NgForm;
  @Input() formData: IScanForm;
  analyzersList: IAnalyzersList;
  isBtnDisabled: boolean = false;
  showSpinnerBool: boolean = false;
  formDebugBool: boolean = false;
  // JSON Editor
  private editorOptions: JsonEditorOptions;

  constructor(
    private readonly scanService: ScanService,
    private readonly analyzerService: AnalyzerConfigService,
    private dialogService: NbDialogService
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code'];
    this.editorOptions.mode = 'code';
  }

  ngOnInit(): void {
    // rxjs/first() -> take first and complete observable
    this.analyzerService.analyzersList$
      .pipe(first())
      .subscribe((aList: IAnalyzersList) => (this.analyzersList = aList));
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
      this.isNotError816() &&
      !this.isBtnDisabled
    );
  }

  async onScanSubmit(): Promise<void> {
    // spinner on
    this.showSpinnerBool = true;
    if (this.formData.classification === 'file') {
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

  /* Additional Config Params */
  configParams() {
    const config: any[] = [];
    this.analyzerService.rawAnalyzerConfig.forEach((ac: IRawAnalyzerConfig) => {
      if (
        this.formData.analyzers_requested.includes(ac.name) &&
        ac.additional_config_params
      ) {
        const obj = {};
        obj[ac.name] = ac.additional_config_params;
        config.push(obj);
      }
    });
    this.dialogService
      .open(AppJsonEditorComponent, {
        context: {
          editorOptions: this.editorOptions,
          data: config,
        },
        hasBackdrop: false,
        closeOnEsc: false,
      })
      .onClose.subscribe((d) => (this.formData.additional_configuration = d));
  }
}
