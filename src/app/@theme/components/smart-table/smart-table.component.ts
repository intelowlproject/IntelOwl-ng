import { Component, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';


// Job Status Icon Renderer
@Component({
  template: `
    <nb-icon [icon]="iconName" [status]="iconStatus" pack="eva"></nb-icon>
  `,
})
export class JobStatusIconRenderComponent implements ViewCell, OnInit {

  iconName: string;
  iconTooltip: string;
  iconStatus: string;

  @Input() value: string;
  @Input() rowData: any;

  ngOnInit() {
    const value = this.value.toString();
    if (value === 'true' || value === 'success' || value === 'reported_without_fails') {
      this.iconName = 'checkmark-circle-2-outline';
      this.iconStatus = 'success';
      this.iconTooltip = 'success';
    } else if (value === 'running' || value === 'pending') {
      this.iconName = 'loader-outline';
      this.iconStatus = 'warning';
      this.iconTooltip = 'running';
    } else {
      this.iconName = 'close-circle-outline';
      this.iconStatus = 'danger';
      this.iconTooltip = 'failed';
    }
  }

}


// View Result Button Component
@Component({
  template:
  `
    <nb-icon style="cursor: pointer;" (click)="onRowSelect(rowData.id)" icon="external-link-outline"></nb-icon>
  `,
})
export class ViewResultButtonComponent implements ViewCell, OnInit {

  @Input() value: number;
  @Input() rowData: any;

  ngOnInit() {}

  constructor(private router: Router) { }

  async onRowSelect(id) {
    try {
      this.router.navigate([`/pages/result/observable/${id}/`]).then();
    } catch (e) {
      console.error(e);
    }
  }

}

// Tags badges Renderer
@Component({
  template: `
  <strong style="background-color: {{ tag.color }};"
          class="p-1 mx-1 badge"
          *ngFor="let tag of value">
    {{ tag.label }}
  </strong>
  `,
})
export class TagsRenderComponent implements ViewCell {

  @Input() value: any; // this will be an array of tag objects
  @Input() rowData: any;

}
