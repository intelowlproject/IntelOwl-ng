import { NgModule } from '@angular/core';
import {
  NbAlertModule,
  NbButtonModule,
  NbPopoverModule,
  NbRouteTabsetModule,
  NbSpinnerModule,
  NbTagModule,
  NbTooltipModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';
import { EchartsTreeComponent } from '../../@theme/components/echarts-tree/echarts-tree.component';
import { AnalyzersManagementComponent } from './analyzers-management/analyzers-management.component';
import {
  PluginHealthCheckButtonRenderComponent,
  PluginSecretsDictRenderComponent,
  PluginParamsDictRenderComponent,
  PluginConfigDictRenderComponent,
  PluginInfoCardComponent,
} from './lib/components';
import { AnalyzersTableComponent } from './analyzers-management/analyzers-table/analyzers-table.component';
import { AnalyzersTreeComponent } from './analyzers-management/analyzers-tree/analyzers-tree.component';
import { ConnectorsTableComponent } from './connectors-table/connectors-table.component';
import {
  TickCrossRenderComponent,
  TickCrossExtraRenderComponent,
  JSONRenderComponent,
  TLPRenderComponent,
  ListCellComponent,
  DescriptionRenderComponent,
  PopoverOnCellHoverComponent,
} from '../../@theme/components/smart-table/smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { PluginsRoutingModule } from './plugins-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    PluginsRoutingModule,
    NbAlertModule,
    NbButtonModule,
    NbTagModule,
    NbRouteTabsetModule,
    NbSpinnerModule,
    Ng2SmartTableModule,
    NbPopoverModule,
    NgxEchartsModule,
    NbTooltipModule,
  ],
  declarations: [
    AnalyzersManagementComponent,
    AnalyzersTableComponent,
    AnalyzersTreeComponent,
    ConnectorsTableComponent,
    EchartsTreeComponent,
    // lib
    PluginHealthCheckButtonRenderComponent,
    PluginSecretsDictRenderComponent,
    PluginParamsDictRenderComponent,
    PluginConfigDictRenderComponent,
    PluginInfoCardComponent,
    // smart table components
    TickCrossRenderComponent,
    TickCrossExtraRenderComponent,
    JSONRenderComponent,
    TLPRenderComponent,
    ListCellComponent,
    DescriptionRenderComponent,
    PopoverOnCellHoverComponent,
  ],
})
export class PluginsModule {}
