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
  ViewJobAnalyzersResultButtonComponent,
  JobStatusIconRenderComponent,
  TagsRenderComponent,
} from '../../@theme/components/smart-table/smart-table';
import { JobService } from '../../@core/services/job.service';
import { JobAnalyzersResultComponent } from './job-result/job-analyzers-result/job-analyzers-result.component';
import { JobActionsMenuComponent } from './job-result/job-actions-menu/job-actions-menu.component';
import { DashboardComponent } from './dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DebounceClickDirective } from 'src/app/@theme/directives/app-debounce-click.directive';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import * as echarts from 'echarts';
import { JobInfoListComponent } from './job-result/job-info-list/job-info-list.component';
import { JobConnectorsResultComponent } from './job-result/job-connectors-result/job-connectors-result.component';

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
    NgJsonEditorModule,
  ],
  declarations: [
    DashboardComponent,
    JobAnalyzersResultComponent,
    JobConnectorsResultComponent,
    JobActionsMenuComponent,
    ViewJobAnalyzersResultButtonComponent,
    JobStatusIconRenderComponent,
    TagsRenderComponent,
    EchartsPieComponent,
    DebounceClickDirective,
    JobInfoListComponent,
  ],
  providers: [JobService],
})
export class DashboardModule {}
