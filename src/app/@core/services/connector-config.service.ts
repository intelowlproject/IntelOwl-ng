import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { IRawConnectorConfig } from '../models/models';
import { PluginService } from './plugin.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectorConfigService extends PluginService {
  private _rawConnectorConfig$: ReplaySubject<
    IRawConnectorConfig
  > = new ReplaySubject(1);

  constructor(_httpClient: HttpClient, toastr: ToastService) {
    super(_httpClient, toastr);
    this.pluginType = 'connector';
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

  async checkConnectorHealth(connectorName: string): Promise<boolean | null> {
    return this.checkPluginHealth(connectorName);
  }

  async killConnector(job_id: number, connectorName: string): Promise<boolean> {
    return this.killPlugin(job_id, connectorName);
  }

  async retryConnector(
    job_id: number,
    connectorName: string
  ): Promise<boolean> {
    return this.retryPlugin(job_id, connectorName);
  }
}
