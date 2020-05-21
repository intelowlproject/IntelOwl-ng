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
  @Output() tagWasClicked: EventEmitter<any> = new EventEmitter<any>();

  sub: Subscription;
  tags: Tag[];
  selectedTags: Set<Tag> = new Set();
  mutableTag: Tag = {
    label: 'label',
    color: '#ffffff',
  } as Tag;
  editMode: boolean = false;


  constructor(private tagService: TagService) { }

  ngOnInit(): void {
    this.tags = this.tagService.tags;
    this.sub = this.tagService.tags$.subscribe(res => this.tags = res);
  }

  // Popover

  open() {
    this.popover.show();
  }

  close() {
    const tagstoOutput: number[] = new Array();
    this.selectedTags.forEach(tag => tagstoOutput.push(tag.id));
    this.tagWasClicked.emit(tagstoOutput);
    this.popover.hide();
  }

  // Tag CRUD on client

  onTagClick(event: Tag) {
    if (this.selectedTags.has(event)) {
      this.selectedTags.delete(event);
    } else {
      this.selectedTags.add(event);
    }
  }

  editTag(event: Tag) {
    this.mutableTag = event;
    this.editMode = true;
  }

  newTag() {
    this.mutableTag = {
      label: 'label',
      color: '#ffffff',
    };
    this.editMode = true;
  }

  // Tag update/create on server

  async updateTag() {
    if (this.mutableTag.id) {
      await this.tagService.updateTag(this.mutableTag);
    } else {
      const obj: Tag = await this.tagService.createTag(this.mutableTag);
      this.tags.unshift(obj);
    }
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
