import { Component, OnInit } from '@angular/core';
import {
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  userMenu: NbMenuItem[] = [
    { title: 'Django Admin Interface' },
    { title: 'Log out' },
  ];
  isDarkTheme: boolean;

  constructor(
    private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService,
    private themeService: NbThemeService
  ) {
    this.isDarkTheme = HeaderComponent.getThemeName() === 'dark' ? true : false;
  }

  ngOnInit(): void {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user'),
        map(({ item }) => item)
      )
      .subscribe(async (item) => {
        switch (item.title) {
          default: {
            break;
          }
        }
      });
  }

  changeTheme(toggleFlag: boolean): void {
    let themeName: string;
    toggleFlag ? (themeName = 'dark') : (themeName = 'default');
    localStorage.setItem('themeName', themeName);
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  navigateHome(): boolean {
    this.nbMenuService.navigateHome();
    return false;
  }

  static getThemeName(): string {
    return localStorage.getItem('themeName') || 'dark';
  }
}
