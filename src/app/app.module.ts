import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NbMenuModule, NbSidebarModule, NbToastrModule } from '@nebular/theme';

import { TokenInterceptor } from './@core/services/http.intercepter';
import { APP_BASE_HREF } from '@angular/common';
import { AuthGuard } from './@core/services/auth-gaurd.service';
import { DexieService } from './@core/services/dexie.service';
import { IndexedDbService } from './@core/services/indexdb.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ToastService } from './@core/services/toast.service';

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
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    ToastService,
    DexieService,
    IndexedDbService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {}
