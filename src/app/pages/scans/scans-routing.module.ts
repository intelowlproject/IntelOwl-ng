import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ScansManagementComponent } from './scans-management/scans-management.component';
import { ScanObservableComponent } from './scans-management/scan-observable/scan-observable.component';
import { ScanFileComponent } from './scans-management/scan-file/scan-file.component';

const routes: Routes = [{
  path: '',
  component: ScansManagementComponent,
  children: [
    {
      path: 'observable',
      component: ScanObservableComponent,
    },
    {
      path: 'file',
      component: ScanFileComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScansRoutingModule {
}
