import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbInputModule,
  NbButtonModule,
  NbAlertModule,
  NbLayoutModule,
} from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthManagementComponent } from './auth-management.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  imports: [
    AuthRoutingModule,
    FormsModule,
    ThemeModule,
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbAlertModule,
  ],
  declarations: [AuthManagementComponent, LoginComponent],
})
export class AuthModule {}
