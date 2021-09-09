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
      const response = await this._http
        .get(
          'https://raw.githubusercontent.com/intelowlproject/IntelOwl/develop/configuration/analyzer_config.json',
          { responseType: 'json' }
        )
        .toPromise();

      // for the demo
      this.rawAnalyzerConfig = Object.entries(response).reduce(
        (acc, [name, configObj]) => ({
          ...acc,
          [name]: {
            ...configObj,
            name,
            verification: this._verificationChoices[
              Math.floor(Math.random() * 3)
            ],
          },
        }),
        {}
      );
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
      // filter on basis of type
      if (obj.type === 'file') {
        analyzers.file.push(obj);
      } else {
        obj.observable_supported.forEach((clsfn: string) => {
          analyzers[clsfn].push(obj);
        });
      }
    });
    this._analyzersList$.next(analyzers);
  }

  constructTableData(): any[] {
    return Object.entries(this.rawAnalyzerConfig).map(([name, obj]) => {
      if (obj.type === 'observable') {
        obj['supports'] = obj['observable_supported'];
      } else {
        obj['supports'] = obj['supported_filetypes'];
      }
      return obj;
    });
  }
}
