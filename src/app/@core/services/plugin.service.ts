import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HealthCheckStatus } from '../models/models';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class PluginService extends HttpService<any> {
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
  }

  async killPlugin(
    jobId: number,
    pluginType: string,
    plugin: string
  ): Promise<boolean> {
    try {
      await this.patch({}, {}, `job/${jobId}/${pluginType}/${plugin}/kill`);
      return true;
    } catch (e) {
      return false;
    }
  }

  async retryPlugin(
    jobId: number,
    pluginType: string,
    plugin: string
  ): Promise<boolean> {
    try {
      await this.patch({}, {}, `job/${jobId}/${pluginType}/${plugin}/retry`);
      return true;
    } catch (e) {
      return false;
    }
  }

  async checkPluginHealth(
    pluginType: string,
    plugin: string
  ): Promise<HealthCheckStatus | null> {
    try {
      const result: HealthCheckStatus = await this.query(
        {},
        `${pluginType}/${plugin}/healthcheck`
      );
      return result;
    } catch (e) {
      return null;
    }
  }
}
