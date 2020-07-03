import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IndexedDbService } from './indexdb.service';
import { IObservableAnalyzers } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AnalyzerConfigService extends HttpService<any> {
  public rawAnalyzerConfig: any;
  private _observableAnalyzers$: ReplaySubject<
    IObservableAnalyzers
  > = new ReplaySubject<IObservableAnalyzers>() as ReplaySubject<
    IObservableAnalyzers
  >;

  private _fileAnalyzers$: ReplaySubject<any> = new ReplaySubject<
    any
  >() as ReplaySubject<any>;

  constructor(
    private _httpClient: HttpClient,
    public indexDB: IndexedDbService
  ) {
    super(
      _httpClient,
      {
        path: '/',
      },
      indexDB
    );
    this.init().then();
  }

  get fileAnalyzers$() {
    return this._fileAnalyzers$.asObservable();
  }

  get observableAnalyzers$() {
    return this._observableAnalyzers$.asObservable();
  }

  private async init(): Promise<void> {
    try {
      const analyzerConfig: any = await this.getAnalyzerConfig();
      this.rawAnalyzerConfig = analyzerConfig;
      this.parse(analyzerConfig).then(([_arr, _obj]) => {
        this._fileAnalyzers$.next(_arr);
        this._observableAnalyzers$.next(_obj);
      });
    } catch (e) {
      console.error(e);
    }
  }

  private async getAnalyzerConfig(): Promise<any> {
    return await this.query({}, 'get_analyzer_configs');
  }

  private async parse(analyzerConfig: any): Promise<any[]> {
    const fileAnalyzersArr = [] as any[];
    const obsAnalyzers: IObservableAnalyzers = {
      ip: [],
      hash: [],
      domain: [],
      url: [],
    } as IObservableAnalyzers;

    Object.entries(analyzerConfig).forEach(([name, obj]) => {
      obj['name'] = name;
      if (obj['type'] === 'file') {
        fileAnalyzersArr.push(obj);
        if (obj['run_hash']) {
          obsAnalyzers['hash'].push(obj);
        }
      } else {
        if (obj['observable_supported'].includes('ip')) {
          obsAnalyzers['ip'].push(obj);
        }
        if (obj['observable_supported'].includes('url')) {
          obsAnalyzers['url'].push(obj);
        }
        if (obj['observable_supported'].includes('domain')) {
          obsAnalyzers['domain'].push(obj);
        }
        if (obj['observable_supported'].includes('hash')) {
          obsAnalyzers['hash'].push(obj);
        }
      }
    });
    return [fileAnalyzersArr, obsAnalyzers];
  }
}
