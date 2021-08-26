import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AnalyzersManagementComponent } from './analyzers-management/analyzers-management.component';
import { AnalyzersTableComponent } from './analyzers-management/analyzers-table/analyzers-table.component';
import { AnalyzersTreeComponent } from './analyzers-management/analyzers-tree/analyzers-tree.component';
import { ConnectorsTableComponent } from './connectors-table/connectors-table.component';

const routes: Routes = [
  {
    path: 'analyzers',
    component: AnalyzersManagementComponent,
    children: [
      {
        path: 'table',
        component: AnalyzersTableComponent,
      },
      {
        path: 'tree',
        component: AnalyzersTreeComponent,
      },
    ],
  },
  {
    path: 'connectors',
    component: ConnectorsTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginsRoutingModule {}
