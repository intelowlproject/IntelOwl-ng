import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ScansModule } from './scans/scans.module';
import { NbMenuModule } from '@nebular/theme';
import { AnalyzersModule } from './analyzers/analyzers.module';

@NgModule({
  imports: [
    NbMenuModule,
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    AnalyzersModule,
    ScansModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
