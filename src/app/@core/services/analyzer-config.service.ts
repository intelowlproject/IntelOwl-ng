import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAnalyzersList, IRawAnalyzerConfig } from '../models/models';
import { PluginService } from './plugin.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyzerConfigService extends PluginService {
  public rawAnalyzerConfig: IRawAnalyzerConfig = {};
  private _analyzersList$: ReplaySubject<IAnalyzersList> = new ReplaySubject(1);

  constructor(_httpClient: HttpClient, toastr: ToastService) {
    super(_httpClient, toastr);
    this.pluginType = 'analyzer';
    this.init().then();
  }

  get analyzersList$() {
    return this._analyzersList$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      this.rawAnalyzerConfig = await this.query({}, 'get_analyzer_configs');
      await this.makeAnalyzersList();
    } catch (e) {
      console.error(e);
    }
  }

  async checkAnalyzerHealth(analyzer_name: string): Promise<boolean | null> {
    return this.checkPluginHealth(analyzer_name);
  }

  async killAnalyzer(job_id: number, analyzer_name: string): Promise<boolean> {
    return this.killPlugin(job_id, analyzer_name);
  }

  async retryAnalyzer(job_id: number, analyzer_name: string): Promise<boolean> {
    return this.retryPlugin(job_id, analyzer_name);
  }

  private async makeAnalyzersList(): Promise<void> {
    const analyzers: IAnalyzersList = {
      ip: [],
      hash: [],
      domain: [],
      url: [],
      generic: [],
      file: [],
    };

    const obsToCheck: string[] = ['ip', 'url', 'domain', 'hash', 'generic'];

    Object.entries(this.rawAnalyzerConfig).forEach(([key, obj]) => {
      const acObj = {
        name: key,
        ...obj,
      };
      // filter on basis of type
      if (obj.type === 'file') {
        analyzers.file.push(acObj);
        if (obj.run_hash) analyzers.hash.push(acObj);
      } else {
        obsToCheck.forEach((clsfn: string) => {
          if (obj.observable_supported.includes(clsfn))
            analyzers[clsfn].push(acObj);
        });
      }
    });
    this._analyzersList$.next(analyzers);
  }

  constructTableData(): any[] {
    return Object.entries(this.rawAnalyzerConfig).map(([key, obj]) => {
      obj['name'] = key;
      if (obj.hasOwnProperty('observable_supported')) {
        obj['supports'] = obj['observable_supported'];
      } else {
        obj['supports'] = obj['supported_filetypes'];
      }
      if (!obj.hasOwnProperty('external_service')) {
        obj['external_service'] = false;
      }
      if (!obj.hasOwnProperty('leaks_info')) {
        obj['leaks_info'] = false;
      }
      return obj;
    });
  }
}
