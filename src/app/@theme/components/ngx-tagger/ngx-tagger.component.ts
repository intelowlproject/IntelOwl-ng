import { Component, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { TagService } from '../../../@core/services/tag.service';
import { Tag } from '../../../@core/models/models';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'ngx-tagger',
  templateUrl: './ngx-tagger.component.html',
  styleUrls: ['./ngx-tagger.component.scss'],
})
export class NgxTaggerComponent implements OnInit, OnDestroy {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  @Output() private onOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() private onClose: EventEmitter<any> = new EventEmitter<any>();

  private sub: Subscription;
  tags: Tag[];
  selectedTags: Set<Tag> = new Set();
  mutableTag: Tag = {
    label: 'label',
    color: '#ffffff',
  } as Tag;
  private savedTag: Tag = Object.create(null);
  editMode: boolean = false;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tags = this.tagService.tags;
    this.sub = this.tagService.tags$.subscribe((res) => (this.tags = res));
  }

  // Popover

  open(): void {
    this.onOpen.emit();
    this.popover.show();
  }

  close(): void {
    const tagstoOutput: number[] = new Array();
    this.selectedTags.forEach((tag) => tagstoOutput.push(tag.id));
    this.onClose.emit(tagstoOutput);
    this.popover.hide();
  }

  // Tag selection

  onTagClick(event: Tag): void {
    if (this.selectedTags.has(event)) {
      this.selectedTags.delete(event);
    } else {
      this.selectedTags.add(event);
    }
  }

  // Tag update/create on client side
  editTag(event: Tag): void {
    // save current state
    Object.assign(this.savedTag, event);
    this.mutableTag = event;
    this.editMode = true;
  }

  newTag(): void {
    this.mutableTag = {
      label: 'label',
      color: '#ffffff',
    } as Tag;
    this.editMode = true;
  }

  // Tag update/create on server

  async updateTag(): Promise<void> {
    this.editMode = false;
    if (this.mutableTag.id) {
      this.tagService
        .updateTag(this.mutableTag)
        .then((obj: Tag) => Object.assign(this.mutableTag, obj))
        .catch(() => Object.assign(this.mutableTag, this.savedTag));
    } else {
      this.tagService
        .createTag(this.mutableTag)
        .then((obj: Tag) => this.tags.unshift(obj));
    }
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
}
