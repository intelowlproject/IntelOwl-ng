import { NgModule } from '@angular/core';

import { ConnectorsTableComponent } from './connectors-table/connectors-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbIconModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TickCrossExtraRenderComponent } from 'src/app/@theme/components/smart-table/smart-table';

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    NbIconModule,
    NbSpinnerModule,
    NbTooltipModule,
  ],
  declarations: [ConnectorsTableComponent, TickCrossExtraRenderComponent],
})
export class ConnectorsModule {}
