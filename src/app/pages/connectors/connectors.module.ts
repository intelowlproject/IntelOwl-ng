import { NgModule } from '@angular/core';

import { ConnectorsHomeComponent } from './connectors-home/connectors-home.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbButtonModule, NbIconModule, NbToggleModule } from '@nebular/theme';
import { ThemeModule } from 'src/app/@theme/theme.module';
import {
  ConnectorActiveToggleRenderComponent,
  ConnectorHealthCheckButtonRenderComponent,
} from 'src/app/@theme/components/smart-table/smart-table';

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    NbToggleModule,
    NbButtonModule,
    NbIconModule,
  ],
  declarations: [
    ConnectorsHomeComponent,
    ConnectorActiveToggleRenderComponent,
    ConnectorHealthCheckButtonRenderComponent,
  ],
})
export class ConnectorsModule {}
