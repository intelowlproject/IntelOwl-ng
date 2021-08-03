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
    const value = this.value.toString().toLowerCase();
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

// Tick/Cross Extra Render Component
@Component({
  template: `
    <nb-icon
      *ngIf="iconName"
      [icon]="iconName"
      [status]="iconStatus"
      [nbTooltip]="tooltip"
      [nbTooltipStatus]="tooltipStatus"
    ></nb-icon>
    <span *ngIf="!iconName">{{ value }}</span>
  `,
})
export class TickCrossExtraRenderComponent implements ViewCell, OnInit {
  iconName: string;
  iconStatus: string;
  tooltip: string;
  tooltipStatus: string;

  @Input() value: any; // some object
  @Input() rowData: any;

  ngOnInit() {
    const tick = this.value.tick;

    if (tick === true) {
      this.tooltip = 'Ready to use!';
      this.iconName = 'checkmark-circle-2-outline';
      this.iconStatus = 'success';
    } else {
      this.tooltip = this.value.tooltip;
      this.tooltipStatus = 'danger';
      this.iconName = 'close-circle-outline';
      this.iconStatus = 'danger';
    }
  }
}

// View Result Button Component
@Component({
  template: `
    <nb-icon
      style="cursor: pointer;"
      (click)="onRowSelect(rowData.id)"
      icon="external-link-outline"
    ></nb-icon>
  `,
})
export class ViewResultButtonComponent implements ViewCell {
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

// Plugin Actions (kill/retry)
@Component({
  // selector: 'intelowl-job-status-icon',
  template: `
    <div class="d-flex justify-content-around">
      <nb-icon
        class="mr-2 cursor-pointer"
        nbTooltip="kill"
        icon="slash"
        [status]="killIconStatus"
        (click)="onKillReport($event); $event.stopPropagation()"
      ></nb-icon>
      <nb-icon
        class="cursor-pointer"
        nbTooltip="retry"
        icon="refresh-outline"
        [status]="retryIconStatus"
        (click)="onRetryReport($event); $event.stopPropagation()"
      ></nb-icon>
    </div>
  `,
})
export class PluginActionsRenderComponent
  implements ViewCell, OnInit, OnChanges {
  @Input() value: any;
  @Input() rowData: any;

  @Output() killEmitter: EventEmitter<any> = new EventEmitter();
  @Output() retryEmitter: EventEmitter<any> = new EventEmitter();

  killIconStatus: string = 'basic';
  retryIconStatus: string = 'basic';

  ngOnInit(): void {
    this.getIconStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value.previousValue !== changes.value.currentValue) {
      this.getIconStatus();
    }
  }

  private getIconStatus(): void {
    const status = this.rowData['status'].toLowerCase();
    if (status === 'running' || status === 'pending')
      this.killIconStatus = 'warning';
    if (status === 'failed' || status === 'killed')
      this.retryIconStatus = 'success';
  }

  onKillReport(e) {
    this.killEmitter.emit(this.rowData['name']);
  }

  onRetryReport(e) {
    this.retryEmitter.emit(this.rowData['name']);
  }
}
