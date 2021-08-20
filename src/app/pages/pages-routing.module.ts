import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobResultComponent } from './dashboard/job-result/job-result.component';
import { ConnectorsTableComponent } from './connectors/connectors-table/connectors-table.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'analyzers',
        loadChildren: () =>
          import('./analyzers/analyzers.module').then((m) => m.AnalyzersModule),
      },
      {
        path: 'connectors',
        component: ConnectorsTableComponent,
      },
      {
        path: 'scan',
        loadChildren: () =>
          import('./scans/scans.module').then((m) => m.ScansModule),
      },
      {
        path: 'scan/result/:jobId',
        component: JobResultComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
