import { Component } from '@angular/core';


@Component({
  selector: 'ngx-analyzers-management',
  template: `
    <h5>One API to rule them all. Here's a list of integrated services.</h5>
    <nb-card>
      <nb-route-tabset [activeLinkOptions]="{exact: false}" [fullWidth]="true" [tabs]="tabs">
      </nb-route-tabset>
    </nb-card>
  `,
})
export class AnalyzersManagementComponent {

  tabs = [
    {
      title: 'Table',
      route: './table',
      icon: 'list',
      responsive: true,
    },
    {
      title: 'Tree',
      route: './tree',
      icon: 'funnel',
      responsive: true,
    },
  ];

  constructor() {}

}
