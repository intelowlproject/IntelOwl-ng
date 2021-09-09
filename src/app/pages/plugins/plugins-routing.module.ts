import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AnalyzersManagementComponent } from './analyzers-management/analyzers-management.component';
import { ConnectorsManagementComponent } from './connectors-management/connectors-management';
import {
  AnalyzersTableComponent,
  AnalyzersTreeComponent,
  AnalyzersCardsComponent,
} from './analyzers-management/tabs';
import {
  ConnectorsTableComponent,
  ConnectorsCardsComponent,
} from './connectors-management/tabs';

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
      {
        path: 'cards',
        component: AnalyzersCardsComponent,
      },
    ],
  },
  {
    path: 'connectors',
    component: ConnectorsManagementComponent,
    children: [
      {
        path: 'table',
        component: ConnectorsTableComponent,
      },
      {
        path: 'cards',
        component: ConnectorsCardsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginsRoutingModule {}
