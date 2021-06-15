import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectorsCallsComponent } from './connectors-calls/connectors-calls.component';
import { ConnectorsHomeComponent } from './connectors-home/connectors-home.component';

const routes: Routes = [
  {
    path: '',
    component: ConnectorsHomeComponent,
  },
  {
    path: 'calls',
    component: ConnectorsCallsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectorsRoutingModule {}
