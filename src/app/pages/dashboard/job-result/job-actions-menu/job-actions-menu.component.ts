import { Component, Input } from '@angular/core';
import { Job } from '../../../../@core/models/models';

@Component({
  selector: 'job-actions-menu',
  templateUrl: './job-actions-menu.component.html',
  styleUrls: ['./job-actions-menu.component.scss'],
})
export class JobActionsMenuComponent {
  @Input() job: Job;

  constructor() {}
}
