import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IRawConnectorConfig } from '../models/models';
import { PluginService } from './plugin.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectorConfigService extends PluginService {
  private _rawConnectorConfig$: ReplaySubject<
    IRawConnectorConfig
  > = new ReplaySubject(1);

  constructor(private _http: HttpClient) {
    super();
    this.pluginType = 'connector';
    this.init();
  }

  get rawConnectorConfig$(): Observable<IRawConnectorConfig> {
    return this._rawConnectorConfig$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      const resp: IRawConnectorConfig = (await this._http
        .get(
          'https://raw.githubusercontent.com/intelowlproject/IntelOwl/develop/configuration/connector_config.json',
          { responseType: 'json' }
        )
        .toPromise()) as IRawConnectorConfig;
      this._rawConnectorConfig$.next(resp);
    } catch (e) {
      console.error(e);
    }
  }
}
