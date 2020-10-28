import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type IRestTransform = (response: HttpResponse<any>) => any;

export interface IRestQuery {
  [key: string]: any;
}

export interface IOption {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType: 'json';
  withCredentials?: boolean;
}

export abstract class HttpService<T> {
  protected transform: IRestTransform;
  protected http: HttpClient;
  private readonly _base: string = environment.api;

  protected constructor(http: HttpClient) {
    this.http = http;
  }

  protected static buildRequestOptions(
    query?: any,
    responseType?: string
  ): IOption {
    for (const i in query) {
      if (query.hasOwnProperty(i)) {
        if (query[i] === undefined || query[i] === null) {
          delete query[i];
        }
      }
    }
    return <IOption>{
      responseType: responseType ? responseType : 'json',
      params: query,
      withCredentials: false,
    };
  }

  public query(query?: IRestQuery, url?: string): Promise<T> {
    const request: Observable<any> = this.http.get(
      this.buildUrl(undefined, url),
      HttpService.buildRequestOptions(query)
    );
    return new Promise((resolve, reject) =>
      request.pipe(first()).subscribe(resolve, reject)
    );
  }

  public downloadFile(query?: IRestQuery, url?: string): Promise<Blob> {
    const request: Observable<any> = this.http.get(
      this.buildUrl(undefined, url),
      HttpService.buildRequestOptions(query, 'blob')
    );
    return new Promise((resolve, reject) =>
      request.pipe(first()).subscribe(resolve, reject)
    );
  }

  public get(
    id: string | number,
    query?: IRestQuery,
    url?: string
  ): Promise<T> {
    const request: Observable<any> = this.http.get(
      this.buildUrl(id, url),
      HttpService.buildRequestOptions(query)
    );
    return new Promise((resolve, reject) =>
      request.pipe(first()).subscribe(resolve, reject)
    );
  }

  public create(obj: T, query?: IRestQuery, url?: string): Promise<T> {
    const request: Observable<any> = this.http.post(
      this.buildUrl(undefined, url),
      obj,
      HttpService.buildRequestOptions(query)
    );
    return new Promise((resolve, reject) =>
      request.pipe(first()).subscribe(resolve, reject)
    );
  }

  public update(
    id: string | number,
    obj: T,
    query?: IRestQuery,
    url?: string
  ): Promise<T> {
    const request: Observable<any> = this.http.put(
      this.buildUrl(id, url),
      obj,
      HttpService.buildRequestOptions(query)
    );
    return new Promise((resolve, reject) =>
      request.pipe(first()).subscribe(resolve, reject)
    );
  }

  public patch(obj: T, query?: IRestQuery, url?: string): Promise<T> {
    const request: Observable<any> = this.http.put(
      this.buildUrl(undefined, url),
      obj,
      HttpService.buildRequestOptions(query)
    );
    return new Promise((resolve, reject) =>
      request.pipe(first()).subscribe(resolve, reject)
    );
  }

  public delete(
    id: string | number,
    query?: IRestQuery,
    url?: string
  ): Promise<T> {
    const request: Observable<any> = this.http.delete(
      this.buildUrl(id, url),
      HttpService.buildRequestOptions(query)
    );
    return new Promise((resolve, reject) =>
      request.pipe(first()).subscribe(resolve, reject)
    );
  }

  protected buildUrl(id?: string | number, newUrl?: string): string {
    let url: string = newUrl ? newUrl : '/';
    if (id) {
      url += `/${id}`;
    }
    url = `${this._base}${url}`;
    return url;
  }
}
