import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ObservableResultComponent } from './scans/observable-result/observable-result.component';
import { AnalyzersManagementComponent } from './dashboard/analyzers-management/analyzers-management.component';
import { AuthGuard } from '../@core/services/auth-gaurd.service';

const routes: Routes = [{
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
      component: AnalyzersManagementComponent,
    },
    {
      path: 'scan', loadChildren: () => import('./scans/scans.module')
        .then(m => m.ScansModule),
      canActivate: [AuthGuard],
    },
    {
      path: 'result/observable/:jobId',
      component: ObservableResultComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
