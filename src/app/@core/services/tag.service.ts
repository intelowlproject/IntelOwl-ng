import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { Tag } from '../models/models';
import { ToastService } from './toast.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagService extends HttpService<any> {
  private _tags$: Subject<Tag[]> = new Subject() as Subject<Tag[]>;
  public tags: Tag[];

  constructor(private toastr: ToastService, private _httpClient: HttpClient) {
    super(_httpClient);
    this.init().then();
  }

  get tags$() {
    return this._tags$.asObservable();
  }

  private async init() {
    try {
      const result: Tag[] = await this.query({}, 'tags');
      this.tags = result;
      this._tags$.next(result);
    } catch (e) {
      console.error(e);
      if (e.status >= 500) {
        // this.offlineInit();
      }
    }
  }

  /* depecrated atm
  private async offlineInit() {
    this.indexDB.getAllInstances('tags').then((res) => {
      this.tags = res;
      this._tags$.next(res);
    });
  }
  */

  async updateTag(tag: Tag): Promise<Tag> {
    try {
      const obj: Tag = await this.update(tag.id, tag, {}, 'tags');
      this.toastr.showToast('Updated tag', `Tag #${obj.id}`, 'success');
      return obj;
    } catch (e) {
      const err = Object.values(e.error);
      this.toastr.showToast(
        `Error: ${err}`,
        `Failed to update tag #${tag.id}`,
        'error'
      );
      return Promise.reject();
    }
  }

  async createTag(tag: Tag): Promise<Tag> {
    try {
      const obj: Tag = await this.create(tag, {}, 'tags');
      this.toastr.showToast('Created tag', `Tag #${obj.id}`, 'success');
      return obj;
    } catch (e) {
      const err = Object.values(e.error);
      this.toastr.showToast(
        `Error: ${err}`,
        `Failed to create tag #${tag.label}`,
        'error'
      );
      return Promise.reject();
    }
  }
}
