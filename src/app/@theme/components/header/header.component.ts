import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { UserService } from '../../../@core/services/user.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  userMenu: NbMenuItem[] = [{ title: 'Profile' }, { title: 'Log out' }];
  currentTheme = 'dark';
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService,
    public userService: UserService,
    private themeService: NbThemeService
  ) {}

  ngOnInit(): void {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user'),
        map(({ item }) => item)
      )
      .subscribe(async (item) => {
        switch (item.title) {
          case 'Profile': {
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

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  changeTheme(themeName: string) {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
