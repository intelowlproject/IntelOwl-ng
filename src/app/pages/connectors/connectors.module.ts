import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnectorsRoutingModule } from './connectors-routing.module';
import { ConnectorsHomeComponent } from './connectors-home/connectors-home.component';
import { ConnectorsCallsComponent } from './connectors-calls/connectors-calls.component';

@NgModule({
  declarations: [ConnectorsHomeComponent, ConnectorsCallsComponent],
  imports: [CommonModule, ConnectorsRoutingModule],
})
export class ConnectorsModule {}
