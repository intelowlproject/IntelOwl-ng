import { Component, OnInit } from '@angular/core';
import {
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { UserService } from '../../../@core/services/user.service';
import { filter, map, take } from 'rxjs/operators';

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
    public userService: UserService,
    private themeService: NbThemeService
  ) {
    this.isDarkTheme = HeaderComponent.getThemeName() === 'dark' ? true : false;
  }

  ngOnInit(): void {
    this.nbMenuService
      .onItemClick()
      .pipe(
        take(1),
        filter(({ tag }) => tag === 'user'),
        map(({ item }) => item)
      )
      .subscribe((item) => {
        switch (item.title) {
          case 'Django Admin Interface': {
            document.location.assign('/admin');
            break;
          }
          case 'Log out': {
            this.userService.logOut();
            break;
          }
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
