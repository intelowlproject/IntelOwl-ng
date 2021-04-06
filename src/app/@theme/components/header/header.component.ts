import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService, NbSidebarService } from '@nebular/theme';
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

  constructor(
    private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService,
    public userService: UserService
  ) {}

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
