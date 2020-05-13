import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbIconModule,
  NbTabsetModule,
  NbSelectModule,
  NbCheckboxModule,
  NbRouteTabsetModule,
  NbRadioModule,
  NbListModule,
} from '@nebular/theme';
import { ObservableResultComponent } from './observable-result/observable-result.component';
import { JobStatusIconRenderComponent } from '../../@theme/components/smart-table/smart-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ScansManagementComponent } from './scans-management/scans-management.component';
import { ScanFileComponent } from './scans-management/scan-file/scan-file.component';
import { ScanObservableComponent } from './scans-management/scan-observable/scan-observable.component';
import { ScansRoutingModule } from './scans-routing.modue';
import { ScanService } from '../../@core/services/scan.service';
import { JobService } from '../../@core/services/job.service';

@NgModule({
  entryComponents: [
    JobStatusIconRenderComponent,
  ],
  declarations: [
    JobStatusIconRenderComponent,
    ScansManagementComponent,
    ScanObservableComponent,
    ScanFileComponent,
    ObservableResultComponent,
  ],
  imports: [
    ThemeModule,
    FormsModule,
    NbCardModule,
    NbInputModule,
    NbTabsetModule,
    NbSelectModule,
    NbCheckboxModule,
    NbListModule,
    NbIconModule,
    NbRadioModule,
    NbButtonModule,
    Ng2SmartTableModule,
    ScansRoutingModule,
    NbRouteTabsetModule,
  ],
  providers: [
    JobService,
    ScanService,
  ],
})
export class ScansModule {}
