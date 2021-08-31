import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HealthCheckStatus } from '../models/models';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class PluginService extends HttpService<any> {
  pluginType: string;

  constructor(
    private _httpClient: HttpClient,
    private readonly toastr: ToastService
  ) {
    super(_httpClient);
  }

  private toTitleCase(value: string): string {
    return value[0].toUpperCase() + value.substring(1).toLowerCase();
  }

  async killPlugin(jobId: number, plugin: string): Promise<boolean> {
    const sure = confirm('Are you sure?');
    if (!sure) return;

    try {
      await this.patch(
        {},
        {},
        `job/${jobId}/${this.pluginType}/${plugin}/kill`
      );
      this.toastr.showToast(
        '"killed" successfully.',
        `Job #${jobId} ${this.toTitleCase(this.pluginType)}: ${plugin}`,
        'success'
      );
      return true;
    } catch (e) {
      this.toastr.showToast(
        'Could not be "killed". Reason: "Insufficient Permission".',
        `Job #${jobId} ${this.toTitleCase(this.pluginType)}: ${plugin}`,
        'error'
      );
      return false;
    }
  }

  async retryPlugin(jobId: number, plugin: string): Promise<boolean> {
    const sure = confirm('Are you sure?');
    if (!sure) return;

    try {
      await this.patch(
        {},
        {},
        `job/${jobId}/${this.pluginType}/${plugin}/retry`
      );
      this.toastr.showToast(
        '"retry" request sent successfully.',
        `Job #${jobId} ${this.toTitleCase(this.pluginType)}: ${plugin}`,
        'success'
      );
      return true;
    } catch (e) {
      this.toastr.showToast(
        'Could not be send "retry" request. Reason: "Insufficient Permission".',
        `Job #${jobId} ${this.toTitleCase(this.pluginType)}: ${plugin}`,
        'error'
      );
      return false;
    }
  }

  async checkPluginHealth(plugin: string): Promise<boolean | null> {
    try {
      const result: HealthCheckStatus = await this.query(
        {},
        `${this.pluginType}/${plugin}/healthcheck`
      );
      return result.status;
    } catch (e) {
      this.toastr.showToast(
        'Health Check Request Failed',
        `${this.toTitleCase(this.pluginType)}: ${plugin}`,
        'error'
      );
      return null;
    }
  }
}
