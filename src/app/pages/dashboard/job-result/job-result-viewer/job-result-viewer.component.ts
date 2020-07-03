import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'intelowl-job-result-viewer',
  templateUrl: './job-result-viewer.component.html',
  styleUrls: ['../job-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobResultViewerComponent {
  @Input() data: any;
  @Input() expanded: boolean;

  // super-hacky way used in template to render the JSON report recursively
  getObjectType(val): string {
    let valType: string = 'string';
    if (val == null || (val !== null && Object.keys(val).length === 0)) {
      valType = 'string';
    } else if (typeof val === 'object') {
      if (Array.isArray(val) && val.length < 1) {
        valType = 'string';
      } else {
        valType = 'object';
      }
    }
    return valType;
  }
}
