import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbMenuModule,
  NbSidebarModule,
  NbCardModule,
  NbUserModule,
  NbContextMenuModule,
  NbThemeModule,
  NbSpinnerModule,
  NbIconModule,
  NbSelectModule,
  NbLayoutModule,
} from '@nebular/theme';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { DARK_THEME } from './styles/theme.dark';

import { FormsModule } from '@angular/forms';
import { NbSecurityModule } from '@nebular/security';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSpinnerModule,
  NbIconModule,
  NbSecurityModule,
  NbSelectModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

const ANGULAR_MODULES = [FormsModule];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, ...ANGULAR_MODULES, NbCardModule],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'dark',
          },
          [DEFAULT_THEME, DARK_THEME],
        ).providers,
      ],
    };
  }
}
