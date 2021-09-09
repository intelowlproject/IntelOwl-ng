import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  constructor() {}

  menu: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/pages/dashboard',
      home: true,
    },
    {
      title: 'Analyzers Management',
      group: true,
    },
    {
      title: 'View',
      icon: 'list-outline',
      link: '/pages/analyzers/table',
    },
    {
      title: 'Connectors Management',
      group: true,
    },
    {
      title: 'View',
      icon: 'list-outline',
      link: '/pages/connectors/table',
    },
    {
      title: 'Scans Management',
      group: true,
    },
    {
      title: 'Scan an Observable',
      icon: 'search-outline',
      link: '/pages/scan/observable',
    },
    {
      title: 'Scan a File',
      icon: 'file-add-outline',
      link: '/pages/scan/file',
    },
  ];
}
