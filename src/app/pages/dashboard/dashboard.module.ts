import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbTooltipModule,
  NbAlertModule,
  NbListModule,
  NbTabsetModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { EchartsPieComponent } from '../../@theme/components/echarts-pie/echarts-pie.component';
import {
  ViewResultButtonComponent,
  JobStatusIconRenderComponent,
  TagsRenderComponent,
} from '../../@theme/components/smart-table/smart-table';
import { JobService } from '../../@core/services/job.service';
import { JobResultComponent } from './job-result/job-result.component';
import { DashboardComponent } from './dashboard.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxEchartsModule } from 'ngx-echarts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DebounceClickDirective } from 'src/app/@theme/directives/app-debounce-click.directive';

import * as echarts from 'echarts';

@NgModule({
  imports: [
    ThemeModule,
    NbButtonModule,
    NbListModule,
    NbTabsetModule,
    NbTooltipModule,
    NbAlertModule,
    Ng2SmartTableModule,
    NgxEchartsModule.forRoot({ echarts }),
    NgxJsonViewerModule,
  ],
  declarations: [
    DashboardComponent,
    JobResultComponent,
    ViewResultButtonComponent,
    JobStatusIconRenderComponent,
    TagsRenderComponent,
    EchartsPieComponent,
    DebounceClickDirective,
  ],
  providers: [JobService],
})
export class DashboardModule {}
