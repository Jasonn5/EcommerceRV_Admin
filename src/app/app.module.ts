import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { ManagementAppModule } from './management-app/management-app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { AuthenticationModule } from './authentication/authentication.module';
import { httpInterceptorProviders } from './authentication/http-interceptors';
import { HttpClientModule } from '@angular/common/http';
import { UploadService } from './services/upload.service';
import { InternetConnectionService } from './services/internet-connection.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AgGridModule.withComponents([]),
    AgmCoreModule.forRoot({ apiKey: environment.API_KEY }),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NgxSpinnerModule,
    ManagementAppModule,
    AuthenticationModule,
    AppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    httpInterceptorProviders,
    UploadService,
    InternetConnectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
