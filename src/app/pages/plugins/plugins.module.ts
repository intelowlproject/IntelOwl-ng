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
import {
  TickCrossRenderComponent,
  ConfiguredIconComponent,
  JSONRenderComponent,
  TLPRenderComponent,
  ListCellComponent,
  DescriptionRenderComponent,
  PopoverOnCellHoverComponent,
} from '../../@theme/components/smart-table/smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import {
  PluginHealthCheckButtonRenderComponent,
  PluginSecretsDictRenderComponent,
  PluginParamsDictRenderComponent,
  PluginConfigDictRenderComponent,
  PluginInfoCardComponent,
} from './lib/components';
import { AnalyzersManagementComponent } from './analyzers-management/analyzers-management.component';
import {
  AnalyzersTableComponent,
  AnalyzersTreeComponent,
  AnalyzersCardsComponent,
} from './analyzers-management/tabs';
import { ConnectorsManagementComponent } from './connectors-management/connectors-management';
import {
  ConnectorsTableComponent,
  ConnectorsCardsComponent,
} from './connectors-management/tabs';

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
    ConnectorsManagementComponent,
    AnalyzersTableComponent,
    AnalyzersTreeComponent,
    AnalyzersCardsComponent,
    ConnectorsTableComponent,
    ConnectorsCardsComponent,
    // lib
    PluginHealthCheckButtonRenderComponent,
    PluginSecretsDictRenderComponent,
    PluginParamsDictRenderComponent,
    PluginConfigDictRenderComponent,
    PluginInfoCardComponent,
    // theme/ smart table components
    EchartsTreeComponent,
    TickCrossRenderComponent,
    ConfiguredIconComponent,
    JSONRenderComponent,
    TLPRenderComponent,
    ListCellComponent,
    DescriptionRenderComponent,
    PopoverOnCellHoverComponent,
  ],
})
export class PluginsModule {}
