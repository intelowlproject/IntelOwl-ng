/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
} from '@nebular/theme';

import { Interceptor } from './@core/services/http.intercepter';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from './@core/services/data.service';
import { AuthGuard } from './@core/services/auth-gaurd.service';
import { UserService } from './@core/services/user.service';
import { DexieService } from './@core/services/dexie.service';
import { IndexedDbService } from './@core/services/indexdb.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbEvaIconsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers:
  [
    DataService, AuthGuard, UserService, DexieService, IndexedDbService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: function () { return false; } },
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
