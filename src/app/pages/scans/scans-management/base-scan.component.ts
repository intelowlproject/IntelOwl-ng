import { ScanService } from 'src/app/@core/services/scan.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  IScanForm,
  IAnalyzersList,
  IConnectorConfig,
} from 'src/app/@core/models/models';
import { AnalyzerConfigService } from 'src/app/@core/services/analyzer-config.service';
import { first } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { tlpColors } from 'src/app/@theme/components/smart-table/smart-table';
import { ConnectorConfigService } from 'src/app/@core/services/connector-config.service';
import { EditConfigParamsDialogComponent } from '../lib/edit-config-params-dialog.component';

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
  connectorsList: IConnectorConfig[];
  isBtnDisabled: boolean = false;
  showSpinnerBool: boolean = false;
  formDebugBool: boolean = false;
  showDescriptionBool: boolean = true;

  tlpColors = tlpColors;

  constructor(
    private readonly scanService: ScanService,
    private readonly analyzerService: AnalyzerConfigService,
    private readonly connectorService: ConnectorConfigService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    // rxjs/first() -> take first and complete observable
    this.analyzerService.analyzersList$
      .pipe(first())
      .subscribe((aList: IAnalyzersList) => (this.analyzersList = aList));
    this.connectorService.connectorsList$
      .pipe(first())
      .subscribe((cList: IConnectorConfig[]) => (this.connectorsList = cList));
  }

  isFormValid(): boolean {
    return (
      (this.scanForm.form.status === 'VALID' ||
        this.scanForm.form.status === 'DISABLED') &&
      !this.isBtnDisabled
    );
  }

  async onScanSubmit(): Promise<void> {
    // spinner on
    this.showSpinnerBool = true;
    this.scanService.requestScan();
    // spinner off
    setTimeout(() => (this.showSpinnerBool = false), 1000);
  }

  /* Additional Config Params */
  editAnalyzerParams(): void {
    let configParamsMap = this.formData.analyzers_requested.reduce(
      (acc: any, name: string) => ({
        ...acc,
        [name]: this.analyzerService.rawAnalyzerConfig[name].params,
      }),
      {}
    );
    if (this.formData?.runtime_configuration) {
      configParamsMap = {
        ...configParamsMap,
        ...this.formData.runtime_configuration,
      };
    }
    this.dialogService
      .open(EditConfigParamsDialogComponent, {
        context: {
          configParamsMap: configParamsMap,
        },
        closeOnEsc: false,
      })
      .onClose.pipe(first())
      .subscribe((newConfig) => {
        if (newConfig) {
          this.formData.runtime_configuration = newConfig;
        }
      });
  }
}
