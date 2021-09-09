import { Component } from '@angular/core';

@Component({
  template: `
    <h5>
      Designed to enrich data with any platform. Here's a list of integrated
      connectors.
    </h5>
    <nb-alert class="mt-3" status="info">
      <span><nb-icon icon="bulb-outline"></nb-icon></span>
      <span
        >Hover over a configured icon to view configuration status and errors if
        any.</span
      >
    </nb-alert>
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
export class ConnectorsManagementComponent {
  tabs = [
    {
      title: 'Table',
      route: './table',
      icon: 'list',
      responsive: true,
    },
    {
      title: 'Cards',
      route: './cards',
      icon: 'archive',
      responsive: true,
    },
  ];

  constructor() {}
}
