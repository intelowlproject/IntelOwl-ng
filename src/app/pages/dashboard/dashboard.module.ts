import { NgModule } from '@angular/core';
import {
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbTooltipModule,
  NbBadgeModule,
  NbAlertModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { EchartsPieComponent } from '../../@theme/components/echarts-pie/echarts-pie.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ViewResultButtonComponent, TagsRenderComponent } from '../../@theme/components/smart-table/smart-table';
import { JobService } from '../../@core/services/job.service';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule,
    NbBadgeModule,
    NbAlertModule,
    Ng2SmartTableModule,
    NgxEchartsModule,
  ],
  declarations: [
    DashboardComponent,
    ViewResultButtonComponent,
    TagsRenderComponent,
    EchartsPieComponent,
  ],
  providers: [
    JobService,
  ],
})
export class DashboardModule { }
