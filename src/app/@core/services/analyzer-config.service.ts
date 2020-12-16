import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAnalyzersList, IRawAnalyzerConfig } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AnalyzerConfigService extends HttpService<any> {
  public rawAnalyzerConfig: IRawAnalyzerConfig = {};
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
      this.rawAnalyzerConfig = await this.query({}, 'get_analyzer_configs');
      await this.makeAnalyzersList();
    } catch (e) {
      console.error(e);
    }
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
      if (obj['type'] === 'file') {
        analyzers['file'].push(key);
        if (obj['run_hash']) {
          analyzers['hash'].push(key);
        }
      } else {
        obsToCheck.forEach((clsfn: string) => {
          if (obj['observable_supported'].includes(clsfn)) {
            analyzers[clsfn].push(key);
          }
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
      if (!obj.hasOwnProperty('requires_configuration')) {
        obj['requires_configuration'] = false;
      }
      if (!obj.hasOwnProperty('leaks_info')) {
        obj['leaks_info'] = false;
      }
      return obj;
    });
  }
}
