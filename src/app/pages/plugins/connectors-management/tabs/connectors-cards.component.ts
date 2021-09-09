import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { IConnectorConfig } from 'src/app/@core/models/models';
import { ConnectorConfigService } from '../../../../@core/services/connector-config.service';

@Component({
  template: `
    <nb-card
      [nbSpinner]="showSpinnerBool"
      nbSpinnerStatus="primary"
      nbSpinnerSize="large"
    >
      <nb-card-body class="row d-flex flex-wrap">
        <div
          class="col-lg-6 col-md-12 mt-2"
          *ngFor="let connectorInfo of connectorsList"
        >
          <plugin-info-card [pluginInfo]="connectorInfo"></plugin-info-card>
        </div>
      </nb-card-body>
    </nb-card>
  `,
})
export class ConnectorsCardsComponent implements OnInit {
  showSpinnerBool: boolean = false;
  connectorsList: IConnectorConfig[] = [];

  constructor(private readonly connectorService: ConnectorConfigService) {}

  ngOnInit(): void {
    this.showSpinnerBool = true; // spinner on
    this.connectorService.connectorsList$.pipe(first()).subscribe((res) => {
      this.connectorsList = res;
      this.showSpinnerBool = false; // spinner off
    });
  }
}
