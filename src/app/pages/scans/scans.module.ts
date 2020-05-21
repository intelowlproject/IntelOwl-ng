import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  NbToggleModule,
  NbPopoverModule,
} from '@nebular/theme';
import { JobStatusIconRenderComponent } from '../../@theme/components/smart-table/smart-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ScansManagementComponent, BaseScanFormComponent } from './scans-management/scans-management.component';
import { ScanFileComponent } from './scans-management/scan-file/scan-file.component';
import { ScanObservableComponent } from './scans-management/scan-observable/scan-observable.component';
import { ScansRoutingModule } from './scans-routing.module';
import { ScanService } from '../../@core/services/scan.service';
import { JobService } from '../../@core/services/job.service';
import { NgxTaggerComponent } from '../../@theme/components/ngx-tagger/ngx-tagger.component';
import { JobResultComponent } from './job-result/job-result.component';

@NgModule({
  declarations: [
    ScansManagementComponent,
    BaseScanFormComponent,
    ScanFileComponent,
    ScanObservableComponent,
    JobResultComponent,
    NgxTaggerComponent,
    JobStatusIconRenderComponent,
  ],
  imports: [
    ScansRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbTabsetModule,
    NbSelectModule,
    NbToggleModule,
    NbCheckboxModule,
    NbListModule,
    NbIconModule,
    NbRadioModule,
    NbButtonModule,
    Ng2SmartTableModule,
    NbRouteTabsetModule,
    NbPopoverModule,
  ],
  providers: [
    JobService,
    ScanService,
  ],
})
export class ScansModule {}
