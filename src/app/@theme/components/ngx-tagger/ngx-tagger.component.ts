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
  @Output() private tagWasClicked: EventEmitter<any> = new EventEmitter<any>();

  private sub: Subscription;
  tags: Tag[];
  selectedTags: Set<Tag> = new Set();
  mutableTag: Tag = {
    label: 'label',
    color: '#ffffff',
  } as Tag;
  editMode: boolean = false;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tags = this.tagService.tags;
    this.sub = this.tagService.tags$.subscribe((res) => (this.tags = res));
  }

  // Popover

  open(): void {
    this.popover.show();
  }

  close(): void {
    const tagstoOutput: number[] = new Array();
    this.selectedTags.forEach((tag) => tagstoOutput.push(tag.id));
    this.tagWasClicked.emit(tagstoOutput);
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
    if (this.mutableTag.id) {
      this.tagService
        .updateTag(this.mutableTag)
        .then((obj: Tag) => (this.mutableTag = obj));
    } else {
      this.tagService
        .createTag(this.mutableTag)
        .then((obj: Tag) => this.tags.unshift(obj));
    }
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
}
