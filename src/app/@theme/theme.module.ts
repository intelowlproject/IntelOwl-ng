import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbMenuModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbThemeModule,
  NbSpinnerModule,
  NbIconModule,
  NbLayoutModule,
  NbTooltipModule,
  NbCardModule,
  NbToggleModule,
} from '@nebular/theme';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageVisualizerComponent } from './components/image-visualizer/image-visualizer.component';
import { ThemeSwitcherComponent } from './components/header/theme-switcher/theme-switcher.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';

import {
  CapitalizePipe,
  MarkdownPipe,
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

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSpinnerModule,
  NbIconModule,
  NbTooltipModule,
  NbToggleModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  ImageVisualizerComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  ThemeSwitcherComponent,
  SocialLinksComponent,
];

const PIPES = [CapitalizePipe, MarkdownPipe, TimingPipe, NumberWithCommasPipe];

// modules that will be reused across all child modules.
const MODULES_TO_EXPORT = [CommonModule, NbIconModule, NbCardModule];

const ANGULAR_MODULES = [CommonModule, FormsModule];

@NgModule({
  imports: [...ANGULAR_MODULES, ...NB_MODULES],
  exports: [...PIPES, ...COMPONENTS, ...MODULES_TO_EXPORT],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: ThemeSwitcherComponent.getThemeName(),
          },
          [DEFAULT_THEME, DARK_THEME]
        ).providers,
      ],
    };
  }
}
