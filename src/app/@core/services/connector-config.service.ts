import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { IConnectorConfig, IRawConnectorConfig } from '../models/models';
import { PluginService } from './plugin.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectorConfigService extends PluginService {
  private rawConnectorConfig: IRawConnectorConfig = {};
  private _connectorsList$: ReplaySubject<
    IConnectorConfig[]
  > = new ReplaySubject(1);

  constructor(_httpClient: HttpClient, toastr: ToastService) {
    super(_httpClient, toastr);
    this.pluginType = 'connector';
    this.init().then();
  }

  get connectorsList$() {
    return this._connectorsList$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      this.rawConnectorConfig = await this.query({}, 'get_connector_configs');
      this.makeConnectorsList();
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

  private makeConnectorsList(): void {
    const connectors: IConnectorConfig[] = Object.entries(
      this.rawConnectorConfig
    ).map(([key, obj]) => {
      return obj;
    });
    this._connectorsList$.next(connectors);
  }
}
