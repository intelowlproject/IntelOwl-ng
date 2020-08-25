import { Component } from '@angular/core';
import { ScanService } from '../../../@core/services/scan.service';

@Component({
  templateUrl: './scans-management.component.html',
})
export class ScansManagementComponent {
  tabs = [
    {
      title: 'Observable Scan',
      route: './observable',
      icon: 'search-outline',
      responsive: true,
    },
    {
      title: 'File Scan',
      route: './file',
      icon: 'file-add-outline',
      responsive: true,
    },
  ];
  constructor(public readonly scanService: ScanService) {}
  public trackByFn = (_index, item) => item.key;
}
