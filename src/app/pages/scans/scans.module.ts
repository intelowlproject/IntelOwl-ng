import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import {
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbCheckboxModule,
  NbRouteTabsetModule,
  NbRadioModule,
  NbToggleModule,
  NbPopoverModule,
  NbSpinnerModule,
} from '@nebular/theme';
import {
  ScansManagementComponent,
  BaseScanFormComponent,
} from './scans-management/scans-management.component';
import { ScanFileComponent } from './scans-management/scan-file/scan-file.component';
import { ScanObservableComponent } from './scans-management/scan-observable/scan-observable.component';
import { ScansRoutingModule } from './scans-routing.module';
import { ScanService } from '../../@core/services/scan.service';
import { NgxTaggerComponent } from '../../@theme/components/ngx-tagger/ngx-tagger.component';

@NgModule({
  declarations: [
    ScansManagementComponent,
    BaseScanFormComponent,
    ScanFileComponent,
    ScanObservableComponent,
    NgxTaggerComponent,
  ],
  imports: [
    ScansRoutingModule,
    ThemeModule,
    FormsModule,
    NbInputModule,
    NbSelectModule,
    NbToggleModule,
    NbCheckboxModule,
    NbRadioModule,
    NbButtonModule,
    NbRouteTabsetModule,
    NbPopoverModule,
    NbSpinnerModule,
  ],
  providers: [ScanService],
})
export class ScansModule {}
