import { Component, OnInit } from '@angular/core';
import { ObservableForm } from '../../../../@core/models/models';
import { ToastService } from '../../../../@core/services/toast.service';

@Component({
  selector: 'intelowl-scan-observable',
  templateUrl: './scan-observable.component.html',
  styleUrls: ['./scan-observable.component.scss'],
})
export class ScanObservableComponent implements OnInit {

  ip_analyzers_list: string[] = [
    'Shodan',
    'HoneyDB',
    'VirusTotal_v3_Get_Observable',
    'VirusTotal_v2_Get_Observable',
    'TalosReputation',
    'Robtex_Reverse_PDNS_Query',
    'Robtex_IP_Query',
    'OTXQuery',
    'AbuseIPDB',
    'TorProject',
    'GreyNoiseAlpha',
    'HybridAnalysis',
    'MaxMindGeoIP',
  ];

  formData: ObservableForm = {
    classifier: 'ip',
    value: '127.0.0.1',
    analyzers_list: [],
    force_privacy: false,
    disable_external_analyzers: false,
  } as ObservableForm;

  constructor(private toastr: ToastService) { }

  ngOnInit() {

    this.formData = {
      classifier: 'ip',
      value: '127.0.0.1',
      analyzers_list: ['Shodan', 'HoneyDB', 'TorProject'],
      force_privacy: false,
      disable_external_analyzers: false,
    };

  }

  async scan() {
    try {
      this.toastr.showToast('Scan Requested!', 'Scan Requested!', false);
    } catch (e) {
      console.error(e);
    }
  }

}
