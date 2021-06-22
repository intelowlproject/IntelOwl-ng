import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { IRawConnectorConfig } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ConnectorConfigService extends HttpService<any> {
  public rawConnectorConfig: IRawConnectorConfig = {};

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    this.init().then();
  }

  private async init(): Promise<void> {
    try {
      this.rawConnectorConfig = await this.query({}, 'get_connector_configs');
    } catch (e) {
      console.error(e);
    }
  }

  constructTableData(): any[] {
    return Object.entries(this.rawConnectorConfig).map(([key, obj]) => {
      obj.name = key;
      return obj;
    });
  }
}
