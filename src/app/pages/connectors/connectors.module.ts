import { NgModule } from '@angular/core';

import { ConnectorsRoutingModule } from './connectors-routing.module';
import { ConnectorsHomeComponent } from './connectors-home/connectors-home.component';
import { ConnectorsCallsComponent } from './connectors-calls/connectors-calls.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbButtonModule, NbIconModule, NbToggleModule } from '@nebular/theme';
import { ThemeModule } from 'src/app/@theme/theme.module';
import {
  ConnectorActiveToggleRenderComponent,
  ConnectorHealthCheckButtonRenderComponent,
  ViewJobConnectorsResultButtonComponent,
} from 'src/app/@theme/components/smart-table/smart-table';

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    ConnectorsRoutingModule,
    NbToggleModule,
    NbButtonModule,
    NbIconModule,
  ],
  declarations: [
    ConnectorsHomeComponent,
    ConnectorsCallsComponent,
    ConnectorActiveToggleRenderComponent,
    ConnectorHealthCheckButtonRenderComponent,
    ViewJobConnectorsResultButtonComponent,
  ],
})
export class ConnectorsModule {}
