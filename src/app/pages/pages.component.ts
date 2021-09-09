import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet>
        <button
          nbButton
          id="goto-top-btn"
          size="medium"
          status="info"
          (click)="goToTop()"
          nbTooltip="Scroll To Top"
        >
          <nb-icon icon="arrow-upward-outline"></nb-icon></button
      ></router-outlet>
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

  goToTop(): void {
    document.getElementsByClassName('layout-container')[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
