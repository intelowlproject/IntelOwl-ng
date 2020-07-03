import { NgModule } from '@angular/core';
import { NbRouteTabsetModule } from '@nebular/theme';
import { EchartsTreeComponent } from '../../@theme/components/echarts-tree/echarts-tree.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { AnalyzersManagementComponent } from './analyzers-management/analyzers-management.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AnalyzerConfigService } from '../../@core/services/analyzer-config.service';
import { AnalyzersRoutingModule } from './analyzers-routing.module';
import { AnalyzersTableComponent } from './analyzers-management/analyzers-table/analyzers-table.component';
import { AnalyzersTreeComponent } from './analyzers-management/analyzers-tree/analyzers-tree.component';
import {
  TickCrossRenderComponent,
  JSONRenderComponent,
} from '../../@theme/components/smart-table/smart-table';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  imports: [
    ThemeModule,
    AnalyzersRoutingModule,
    NbRouteTabsetModule,
    Ng2SmartTableModule,
    NgxEchartsModule,
  ],
  declarations: [
    AnalyzersManagementComponent,
    AnalyzersTableComponent,
    AnalyzersTreeComponent,
    EchartsTreeComponent,
    TickCrossRenderComponent,
    JSONRenderComponent,
  ],
  providers: [AnalyzerConfigService],
})
export class AnalyzersModule {}
