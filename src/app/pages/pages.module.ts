import { NgModule } from '@angular/core';
import { NbButtonModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScansModule } from './scans/scans.module';
import { PluginsModule } from './plugins/plugins.module';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    NbMenuModule,
    NbButtonModule,
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    PluginsModule,
    ScansModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
