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
import { EchartsTreeComponent } from '../../@theme/components/echarts-tree/echarts-tree.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { EchartsPieComponent } from '../../@theme/components/echarts-pie/echarts-pie.component';
import { AnalyzersManagementComponent } from './analyzers-management/analyzers-management.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ViewResultButtonComponent, TagsRenderComponent } from '../../@theme/components/smart-table/smart-table.component';
import { JobService } from '../../@core/services/job.service';

@NgModule({
  entryComponents: [
    ViewResultButtonComponent,
  ],
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
    ViewResultButtonComponent,
    TagsRenderComponent,
    DashboardComponent,
    AnalyzersManagementComponent,
    EchartsTreeComponent,
    EchartsPieComponent,
  ],
  providers: [
    JobService,
  ],
})
export class DashboardModule { }
