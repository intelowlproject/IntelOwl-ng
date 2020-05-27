import { Component, Input, OnInit } from '@angular/core';
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
  iconStatus: string;

  @Input() value: string;
  @Input() rowData: any;

  ngOnInit() {
    const value = this.value.toString();
    if (value === 'true' || value === 'success' || value === 'reported_without_fails') {
      this.iconName = 'checkmark-circle-2-outline';
      this.iconStatus = 'success';
    } else if (value === 'running' || value === 'pending' || value === 'reported_with_fails') {
      this.iconName = 'loader-outline';
      this.iconStatus = 'warning';
    } else {
      this.iconName = 'close-circle-outline';
      this.iconStatus = 'danger';
    }
  }

}

// Tick/Cross Render Component
@Component({
  template: `
    <nb-icon *ngIf="iconName" [icon]="iconName" [status]="iconStatus" pack="eva"></nb-icon>
    <span *ngIf="!iconName">{{ value }}</span>
  `,
})
export class TickCrossRenderComponent implements ViewCell, OnInit {

  iconName: string;
  iconStatus: string;

  @Input() value: string;
  @Input() rowData: any;

  ngOnInit() {
    if (this.value === 'N/A') {
      return;
    }
    const value = this.value.toString();
    if (value === 'true') {
      this.iconName = 'checkmark-circle-2-outline';
      this.iconStatus = 'success';
    } else if (value === 'false') {
      this.iconName = 'close-circle-outline';
      this.iconStatus = 'danger';
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
export class ViewResultButtonComponent implements ViewCell {

  @Input() value: number;
  @Input() rowData: any;

  constructor(private router: Router) { }

  async onRowSelect(id) {
    try {
      this.router.navigate([`/pages/scan/result/${id}/`]).then();
    } catch (e) {
      console.error(e);
    }
  }

}

// Tags badges Renderer
@Component({
  template: `
  <strong style="color: white; background-color: {{ tag.color }};"
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

// JSON Object Renderer
@Component({
  template: `
    <pre class="json-text">{{ value | json }}</pre>
  `,
  styles: [`
    .json-text {
      color: #fff;
      font-size: 10px;
    }
  `],
})
export class JSONRenderComponent implements ViewCell {

  @Input() value: any; // some object
  @Input() rowData: any;

}
