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
  NbTooltipModule,
  NbDialogModule,
} from '@nebular/theme';
import { ScansManagementComponent } from './scans-management/scans-management.component';
import { ScanFileComponent } from './scans-management/scan-file/scan-file.component';
import { ScanObservableComponent } from './scans-management/scan-observable/scan-observable.component';
import { ScansRoutingModule } from './scans-routing.module';
import { ScanService } from '../../@core/services/scan.service';
import { NgxTaggerComponent } from '../../@theme/components/ngx-tagger/ngx-tagger.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { AppJsonEditorComponent } from 'src/app/@theme/components/app-json-editor/app-json-editor.component';
import { BaseScanFormComponent } from './scans-management/base-scan.component';

@NgModule({
  declarations: [
    ScansManagementComponent,
    BaseScanFormComponent,
    ScanFileComponent,
    ScanObservableComponent,
    NgxTaggerComponent,
    AppJsonEditorComponent,
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
    NbTooltipModule,
    NbDialogModule.forChild(),
    NgJsonEditorModule,
  ],
  providers: [ScanService],
})
export class ScansModule {}
