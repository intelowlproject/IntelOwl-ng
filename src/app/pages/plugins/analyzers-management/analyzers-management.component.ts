import { Component } from '@angular/core';

@Component({
  template: `
    <!---- https://lotr.fandom.com/wiki/One_Ring -->
    <h5>One API to rule them all. Here's a list of integrated analyzers.</h5>
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
export class AnalyzersManagementComponent {
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
    {
      title: 'Tree',
      route: './tree',
      icon: 'funnel',
      responsive: true,
    },
  ];

  constructor() {}
}
