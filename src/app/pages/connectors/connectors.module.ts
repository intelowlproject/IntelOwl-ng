import { NgModule } from '@angular/core';

import { ConnectorsTableComponent } from './connectors-table/connectors-table.component';
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
    ConnectorsTableComponent,
    ConnectorActiveToggleRenderComponent,
    ConnectorHealthCheckButtonRenderComponent,
  ],
})
export class ConnectorsModule {}
