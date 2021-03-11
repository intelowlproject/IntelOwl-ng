import { Component } from '@angular/core';

@Component({
  template: `
    <!---- https://lotr.fandom.com/wiki/One_Ring -->
    <h5>One API to rule them all. Here's a list of integrated services.</h5>
    <nb-card>
      <nb-route-tabset
        fullWidth
        [activeLinkOptions]="{ exact: false }"
        [tabs]="tabs"
      >
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
