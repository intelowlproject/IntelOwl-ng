import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IndexedDbService } from './indexdb.service';
import { HttpService } from './http.service';
import { Tag } from '../models/models';
import { ToastService } from './toast.service';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class TagService extends HttpService<any> {

  public tags: Tag[];
  public tags$: Subject<Tag[]> = new Subject() as Subject<Tag[]>;

  constructor(
    private toastr: ToastService,
    private httpClient: HttpClient,
    protected indexDB: IndexedDbService,
  ) {
    super(
      httpClient,
      {
        path: '',
      },
      indexDB,
    );
    this.init().then();
  }

  private async init() {
    try {
      const result: Tag[] = await this.query({}, 'tags');
      this.tags = result;
      this.tags$.next(result);
    } catch (e) {
      console.error(e);
      if (e.status >= 500) {
        // this.offlineInit();
      }
    }
  }

  private async offlineInit() {
    this.indexDB.getAllInstances('tags').then(res => {
      this.tags = res;
      this.tags$.next(res);
    });
  }

  async updateTag(tag: Tag): Promise<Tag> {
    try {
      const obj: Tag = await this.update(tag.id, tag, {}, 'tags');
      this.toastr.showToast('Updated tag', `TAG #${obj.id}`, 'success');
      return obj;
    } catch (e) {
      this.toastr.showToast('Couldn\'t update tag', `TAG #${tag.id}`, 'error');
    }
  }

  async createTag(tag: Tag): Promise<Tag> {
    try {
      const obj: Tag = await this.create(tag, {}, 'tags');
      this.toastr.showToast('Created tag', `TAG #${obj.id}`, 'success');
      return obj;
    } catch (e) {
      this.toastr.showToast('Couldn\'t create tag', `TAG: ${tag.label}`, 'error');
    }
  }

}
