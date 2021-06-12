import { NgModule } from '@angular/core';

import { ConnectorsRoutingModule } from './connectors-routing.module';
import { ConnectorsHomeComponent } from './connectors-home/connectors-home.component';
import { ConnectorsCallsComponent } from './connectors-calls/connectors-calls.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from 'src/app/@theme/theme.module';

@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule, ConnectorsRoutingModule],
  declarations: [ConnectorsHomeComponent, ConnectorsCallsComponent],
})
export class ConnectorsModule {}
