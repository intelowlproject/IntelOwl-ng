import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Tag } from 'src/app/@core/models/models';

// Job Status Icon Renderer
@Component({
  selector: 'intelowl-job-status-icon',
  template: `
    <nb-icon
      [nbTooltip]="value"
      [icon]="iconName"
      [status]="iconStatus"
    ></nb-icon>
  `,
})
export class JobStatusIconRenderComponent
  implements ViewCell, OnInit, OnChanges {
  iconName: string;
  iconStatus: string;

  @Input() value: string;
  @Input() rowData: any;

  ngOnInit(): void {
    this.getIconNameStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value.previousValue !== changes.value.currentValue) {
      this.getIconNameStatus();
    }
  }

  private getIconNameStatus(): void {
    const value = this.value.toString();
    if (
      value === 'true' ||
      value === 'success' ||
      value === 'reported_without_fails'
    ) {
      this.iconName = 'checkmark-circle-2-outline';
      this.iconStatus = 'success';
    } else if (value === 'running' || value === 'pending') {
      this.iconName = 'loader-outline';
      this.iconStatus = 'warning';
    } else if (value === 'reported_with_fails') {
      this.iconName = 'alert-triangle-outline';
      this.iconStatus = 'warning';
    } else if (value === 'killed') {
      this.iconName = 'slash';
      this.iconStatus = 'danger';
    } else {
      this.iconName = 'close-circle-outline';
      this.iconStatus = 'danger';
    }
  }
}

// Tick/Cross Render Component
@Component({
  template: `
    <nb-icon *ngIf="iconName" [icon]="iconName" [status]="iconStatus"></nb-icon>
    <span *ngIf="!iconName">{{ value }}</span>
  `,
})
export class TickCrossRenderComponent implements ViewCell, OnInit {
  iconName: string;
  iconStatus: string;

  @Input() value: string;
  @Input() rowData: any;

  ngOnInit() {
    const value = this.value.toString();
    if (value && value === 'true') {
      this.iconName = 'checkmark-circle-2-outline';
      this.iconStatus = 'success';
    } else {
      this.iconName = 'close-circle-outline';
      this.iconStatus = 'danger';
    }
  }
}

// View Result Button Component (Job Analyzers Result)
@Component({
  template: `
    <nb-icon
      style="cursor: pointer;"
      (click)="onRowSelect(rowData.id)"
      icon="external-link-outline"
    ></nb-icon>
  `,
})
export class ViewJobAnalyzersResultButtonComponent implements ViewCell {
  navUri: string = `/pages/scan/result`;
  @Input() value: number;
  @Input() rowData: any;

  constructor(private router: Router) {}

  async onRowSelect(id) {
    try {
      this.router.navigate([`${this.navUri}/${id}/`]).then();
    } catch (e) {
      console.error(e);
    }
  }
}

// View Result Button Component (Job Connectors Result)
// todo: can't override member variables, so how to extend?
@Component({
  template: `
    <nb-icon
      style="cursor: pointer;"
      (click)="onRowSelect(rowData.id)"
      icon="external-link-outline"
    ></nb-icon>
  `,
})
export class ViewJobConnectorsResultButtonComponent implements ViewCell {
  navUri: string = `/pages/connectors/result`;
  @Input() value: number;
  @Input() rowData: any;

  constructor(private router: Router) {}

  async onRowSelect(id) {
    try {
      this.router.navigate([`${this.navUri}/${id}/`]).then();
    } catch (e) {
      console.error(e);
    }
  }
}

// Tags badges Renderer
@Component({
  selector: 'intelowl-job-tags',
  template: `
    <strong
      style="color: white; background-color: {{ tag?.color }};"
      class="p-1 mx-1 badge cursor-pointer"
      (click)="onTagClick.emit(tag)"
      *ngFor="let tag of value"
    >
      {{ tag?.label }}
    </strong>
  `,
})
export class TagsRenderComponent implements ViewCell {
  @Input() value: any; // this will be an array of tag objects
  @Input() rowData: any = null;
  @Output() onTagClick: EventEmitter<Tag> = new EventEmitter();
}

// JSON Object Renderer
@Component({
  template: ` <pre class="text-json">{{ value | json }}</pre> `,
})
export class JSONRenderComponent implements ViewCell {
  @Input() value: any; // some object
  @Input() rowData: any;
}

// Connector Active Toggle Renderer
@Component({
  template: ` <nb-toggle status="success" [checked]="value"></nb-toggle> `,
})
export class ConnectorActiveToggleRenderComponent implements ViewCell {
  @Input() value: any; // boolean
  @Input() rowData: any;
}

// Connector Health Status Renderer
@Component({
  template: ` <div class="col">
    <div class="row">
      <strong style="color: {{ statusColor }};">{{ value?.status }}</strong>
    </div>
    <div class="row">
      <span>Last Checked {{ value?.lastChecked }}</span>
    </div>
  </div>`,
})
export class ConnectorHealthStatusRenderComponent implements ViewCell, OnInit {
  statusColor: string;

  @Input() value: any; // some object
  @Input() rowData: any;

  ngOnInit(): void {
    this.statusColor =
      this.value.status.toLowerCase() === 'healthy' ? 'green' : 'red';
  }
}

// Connector Health Check Button Renderer
@Component({
  template: ` <button nbButton size="tiny" status="primary">Check</button> `,
})
export class ConnectorHealthCheckButtonRenderComponent implements ViewCell {
  @Input() value: any;
  @Input() rowData: any;
}
