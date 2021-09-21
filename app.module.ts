import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './shared/api-interceptor';

import { AppRoutingModule } from './shared/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedServiceService } from './shared/shared.service';
import { MainComponent } from './main/main.component';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthGuard } from './shared/auth.guard';
import { TankVerificationDeactivateGuard } from './tank-verification/tank-verification-deactivate-guard';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AddEditComponent } from './tanks/add-edit-tank/add-edit-tank.component';
import { RegisterComponent } from './user/register/register.component';
import { RegisterService } from './user/register.service';
import { TankService } from './tanks/tank.service';
import { MessageService } from './shared/message.service';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { TanksComponent } from './tanks/tanks.component';
import { TankDetailsComponent } from './tanks/tank-details/tank-details.component';
import {
  ReportComponent,
  ChartDirective
} from './tanks/report/report.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { MessagesComponent } from './shared/messages/messages.component';
import { PasswordResetComponent } from './user/password-reset/password-reset.component';
import { TankVerificationComponent } from './tank-verification/tank-verification.component';
import { TankShapePipe } from './tanks/tank-details/tank-shape.pipe';
import { tankSimPipe } from './tanks/tank-details/sim-pipe';
import { SupportComponent } from './support/support.component';
import { loggerPipe } from './tanks/tank-details/logger-pipe';
import { frequencyPipe } from './tanks/tank-details/frequency-pipe';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TempCanvasComponent } from './temp-canvas/temp-canvas.component';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    AddEditComponent,
    RegisterComponent,
    PageNotFoundComponent,
    TanksComponent,
    TankDetailsComponent,
    ReportComponent,
    ChartDirective,
    EditUserComponent,
    MessagesComponent,
    PasswordResetComponent,
    MainComponent,
    TankVerificationComponent,
    TankShapePipe,
    tankSimPipe,
    SupportComponent,
    loggerPipe,
    frequencyPipe,
    PrivacyPolicyComponent,
    UpdatePasswordComponent,
    SidebarComponent,
    TempCanvasComponent,
    OverviewChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ChartsModule
  ],
  providers: [
    MessageService,
    SharedServiceService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
      deps: [MessageService, SharedServiceService]
    },
    AuthGuard,
    TankVerificationDeactivateGuard,
    RegisterService,
    TankService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
