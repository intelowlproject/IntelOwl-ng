import { Injectable } from '@angular/core';
import { Tag } from '../models/models';
import { ToastService } from './toast.service';
import { saved_tags_for_demo } from 'src/assets/tags_data';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private _tags$: Subject<Tag[]> = new Subject() as Subject<Tag[]>;
  public tags: Tag[];

  constructor(private toastr: ToastService) {
    this.init().then();
  }

  get tags$() {
    return this._tags$.asObservable();
  }

  private async init() {
    try {
      const result: Tag[] = saved_tags_for_demo;
      this.tags = result;
      this._tags$.next(result);
    } catch (e) {
      console.error(e);
    }
  }

  async updateTag(tag: Tag): Promise<Tag> {
    this.toastr.showToast('Updated tag', `Tag #${tag.id}`, 'success');
    return tag;
  }

  async createTag(tag: Tag): Promise<Tag> {
    tag.id = Math.random();
    this.toastr.showToast('Created tag', `Tag #${tag.id}`, 'success');
    return tag;
  }
}
