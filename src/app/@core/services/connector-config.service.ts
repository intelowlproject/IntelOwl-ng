import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { IRawConnectorConfig } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ConnectorConfigService extends HttpService<any> {
  private _rawConnectorConfig$: ReplaySubject<
    IRawConnectorConfig
  > = new ReplaySubject(1);

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    this.init().then();
  }

  get rawConnectorConfig$(): Observable<IRawConnectorConfig> {
    return this._rawConnectorConfig$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      const resp: IRawConnectorConfig = await this.query(
        {},
        'get_connector_configs'
      );
      this._rawConnectorConfig$.next(resp);
    } catch (e) {
      console.error(e);
    }
  }
}
