import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAnalyzersList, IRawAnalyzerConfig } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AnalyzerConfigService extends HttpService<any> {
  public rawAnalyzerConfig: IRawAnalyzerConfig[] = new Array();
  private _analyzersList$: ReplaySubject<IAnalyzersList> = new ReplaySubject(1);

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    this.init().then();
  }

  get analyzersList$() {
    return this._analyzersList$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      const resp: { [key: string]: IRawAnalyzerConfig } = await this.query(
        {},
        'get_analyzer_configs'
      );
      Object.entries(resp).forEach(([key, obj]) => {
        obj['name'] = key;
        if (!obj.hasOwnProperty('external_service')) {
          obj['external_service'] = false;
        }
        if (!obj.hasOwnProperty('requires_configuration')) {
          obj['requires_configuration'] = false;
        }
        if (!obj.hasOwnProperty('leaks_info')) {
          obj['leaks_info'] = false;
        }
        if (!obj.disabled) this.rawAnalyzerConfig.push(obj);
      });
      this.makeAnalyzersList();
    } catch (e) {
      console.error(e);
    }
  }

  makeAnalyzersList(): void {
    const analyzers: IAnalyzersList = {
      ip: [],
      hash: [],
      domain: [],
      url: [],
      file: [],
    };

    this.rawAnalyzerConfig.forEach((obj) => {
      const name = obj.name;
      if (obj['type'] === 'file') {
        analyzers['file'].push(name);
        if (obj['run_hash']) {
          analyzers['hash'].push(name);
        }
      } else {
        if (obj['observable_supported'].includes('ip')) {
          analyzers['ip'].push(name);
        }
        if (obj['observable_supported'].includes('url')) {
          analyzers['url'].push(name);
        }
        if (obj['observable_supported'].includes('domain')) {
          analyzers['domain'].push(name);
        }
        if (obj['observable_supported'].includes('hash')) {
          analyzers['hash'].push(name);
        }
      }
    });
    this._analyzersList$.next(analyzers);
  }

  constructTableData(): any[] {
    return this.rawAnalyzerConfig.map((obj: IRawAnalyzerConfig) => {
      if (obj.hasOwnProperty('observable_supported')) {
        obj['supports'] = obj['observable_supported'];
      } else {
        obj['supports'] = obj['supported_filetypes'];
      }
      return obj;
    });
  }
}
