import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { IAnalyzersList, IRawAnalyzerConfig } from '../models/models';
import { PluginService } from './plugin.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyzerConfigService extends PluginService {
  public rawAnalyzerConfig: IRawAnalyzerConfig = {};
  private _analyzersList$: ReplaySubject<IAnalyzersList> = new ReplaySubject(1);

  constructor(private _http: HttpClient) {
    super();
    this.pluginType = 'analyzer';
    this.init().then();
  }

  get analyzersList$() {
    return this._analyzersList$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      this.rawAnalyzerConfig = (await this._http
        .get(
          'https://raw.githubusercontent.com/intelowlproject/IntelOwl/develop/configuration/analyzer_config.json',
          { responseType: 'json' }
        )
        .toPromise()) as IRawAnalyzerConfig;
      this.makeAnalyzersList();
    } catch (e) {
      console.error(e);
    }
  }

  private makeAnalyzersList(): void {
    const analyzers: IAnalyzersList = {
      ip: [],
      hash: [],
      domain: [],
      url: [],
      generic: [],
      file: [],
    };

    Object.entries(this.rawAnalyzerConfig).forEach(([key, obj]) => {
      const acObj = {
        name: key,
        verification: this._verificationChoices[Math.floor(Math.random() * 3)], // for the demo
        ...obj,
      };
      // filter on basis of type
      if (obj.type === 'file') {
        analyzers.file.push(acObj);
      } else {
        obj.observable_supported.forEach((clsfn: string) => {
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
