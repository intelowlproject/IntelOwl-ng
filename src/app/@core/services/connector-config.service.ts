import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IConnectorConfig, IRawConnectorConfig } from '../models/models';
import { PluginService } from './plugin.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectorConfigService extends PluginService {
  private rawConnectorConfig: IRawConnectorConfig = {};
  private _connectorsList$: ReplaySubject<
    IConnectorConfig[]
  > = new ReplaySubject(1);

  constructor(private _http: HttpClient) {
    super();
    this.pluginType = 'connector';
    this.init();
  }

  get connectorsList$(): Observable<IConnectorConfig[]> {
    return this._connectorsList$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      this.rawConnectorConfig = (await this._http
        .get(
          'https://raw.githubusercontent.com/intelowlproject/IntelOwl/develop/configuration/connector_config.json',
          { responseType: 'json' }
        )
        .toPromise()) as IRawConnectorConfig;
      this.makeConnectorsList();
    } catch (e) {
      console.error(e);
    }
  }

  private makeConnectorsList(): void {
    const connectors: IConnectorConfig[] = Object.entries(
      this.rawConnectorConfig
    ).map(([key, value]) => ({
      ...value,
      name: key,
      disabled: false,
      verification: this._verificationChoices[Math.floor(Math.random() * 3)],
    }));
    this._connectorsList$.next(connectors);
  }
}
