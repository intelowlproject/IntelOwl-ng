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
  selector: 'intelowl-tick-cross-render',
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
export class ConfiguredIconComponent implements ViewCell, OnInit {
  iconName: string;
  iconStatus: string;
  tooltip: string;
  tooltipStatus: string;

  @Input() value: any; // boolean
  @Input() rowData: any;

  ngOnInit() {
    if (this.value === true) {
      this.tooltip = 'Ready to use!';
      this.iconName = 'checkmark-circle-2-outline';
      this.iconStatus = 'success';
    } else {
      this.tooltip = this.rowData.verification.error_message;
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
  selector: 'intelowl-json-render',
  template: `<pre class="text-json">{{ value | json }}</pre>`,
})
export class JSONRenderComponent implements ViewCell {
  @Input() value: any; // some object
  @Input() rowData: any;

  static filterFunction(cell?: any, search?: string): boolean {
    let ans: boolean = false;
    search = search.toLowerCase();
    Object.entries(cell).forEach(([k, v]: [string, string]) => {
      k = k.toString().toLowerCase();
      v = v.toString().toLowerCase();
      if (k.indexOf(search) !== -1 || v.indexOf(search) !== -1) {
        ans = true;
        return;
      }
    });
    return ans;
  }
}

// Plugin Actions (kill/retry)
@Component({
  template: `
    <div class="d-flex justify-content-around">
      <nb-icon
        class="mr-2"
        [ngStyle]="{ cursor: killIconStatus === 'basic' ? 'auto' : 'pointer' }"
        nbTooltip="kill"
        icon="slash"
        [status]="killIconStatus"
        (click)="onKillReport($event); $event.stopPropagation()"
      ></nb-icon>
      <nb-icon
        [ngStyle]="{ cursor: retryIconStatus === 'basic' ? 'auto' : 'pointer' }"
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

  killIconStatus: string = 'basic'; // disabled
  retryIconStatus: string = 'basic'; // disabled

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
    if (this.killIconStatus !== 'basic')
      // validates if kill is allowed
      this.killEmitter.emit(this.rowData['name']);
  }

  onRetryReport(e) {
    if (this.retryIconStatus !== 'basic')
      // validates if retry is allowed
      this.retryEmitter.emit(this.rowData['name']);
  }
}

// TLP Render Component
export const tlpColors = {
  WHITE: '#FFFFFF',
  GREEN: '#33FF00',
  AMBER: '#FFC000',
  RED: '#FF0033',
};
@Component({
  template: `
    <div class="d-flex justify-content-center">
      <nb-tag
        size="tiny"
        status="basic"
        appearance="outline"
        [text]="value"
        [ngStyle]="{ color: tlpColors[value] }"
      ></nb-tag>
    </div>
  `,
})
export class TLPRenderComponent implements ViewCell {
  @Input() value: string;
  @Input() rowData: any;

  tlpColors = tlpColors;
}

// Component to render a list
@Component({
  template: `<ul class="p-1">
    <li *ngFor="let secret of value">
      {{ secret }}
    </li>
  </ul>`,
})
export class ListCellComponent implements ViewCell {
  @Input() value: any;
  @Input() rowData: any;
}

// Component to render the `description` dict
@Component({
  template: ` <small [innerHTML]="value | markdown"></small>`,
})
export class DescriptionRenderComponent implements ViewCell {
  @Input() value: string;
  @Input() rowData: any;
}

// Component to render a info icon that popovers a component on hover
@Component({
  template: `<div>
    <nb-icon
      nbPopoverTrigger="hover"
      [nbPopover]="popoverComponent"
      [nbPopoverContext]="popoverContext"
      icon="info-outline"
      status="primary"
      class="d-flex justify-content-center mx-auto"
    ></nb-icon>
  </div>`,
})
export class PopoverOnCellHoverComponent implements ViewCell {
  @Input() value: any; // is a component in this case
  @Input() rowData: any;

  get popoverComponent(): Component {
    return this.value?.component;
  }

  get popoverContext(): any {
    return this.value?.context;
  }
}

export const tableBooleanFilter: any = {
  type: 'list',
  config: {
    list: [
      { value: true, title: 'Yes' },
      { value: false, title: 'No' },
    ],
  },
};

export const tableBooleanInverseFilter: any = {
  type: 'list',
  config: {
    list: [
      { value: false, title: 'Yes' },
      { value: true, title: 'No' },
    ],
  },
};
