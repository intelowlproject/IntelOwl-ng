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
  isDarkTheme: boolean;

  userMenu: NbMenuItem[] = [
    { title: 'Django Admin Interface' },
    { title: 'Log out' },
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService,
    private nbThemeService: NbThemeService,
    public userService: UserService
  ) {
    this.nbThemeService.onThemeChange().subscribe((themeName) => {
      this.isDarkTheme = themeName?.name === 'dark' ? true : false;
    });
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

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  navigateHome(): boolean {
    this.nbMenuService.navigateHome();
    return false;
  }
}
