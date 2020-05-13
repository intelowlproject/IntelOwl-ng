import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'scans-management',
  templateUrl: './scans-management.component.html',
  styleUrls: ['./scans-management.component.scss'],
})
export class ScansManagementComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }


}
