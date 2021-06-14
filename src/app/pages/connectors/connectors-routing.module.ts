import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectorsCallsComponent } from './connectors-calls/connectors-calls.component';
import { JobConnectorsResultComponent } from './connectors-calls/job-connectors-result/job-connectors-result.component';
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
  {
    path: 'result/:jobId',
    component: JobConnectorsResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectorsRoutingModule {}
