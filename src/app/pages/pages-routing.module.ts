import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobResultComponent } from './dashboard/job-result/job-result.component';
import { JobConnectorsResultComponent } from './dashboard/job-result/job-connectors-result/job-connectors-result.component';

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
        loadChildren: () =>
          import('./connectors/connectors.module').then(
            (m) => m.ConnectorsModule
          ),
      },
      {
        path: 'connectors/result/:jobId',
        component: JobConnectorsResultComponent,
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
