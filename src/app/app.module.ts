/***************************************************CORE***************************************************/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth-guard.module';
import { CustomAuthHttp } from "./auth/custom-auth-http";

/***************************************************INSTALADOS***************************************************/

import { RatingModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from "ngx-accordion";
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';

/***************************************************ENCUESTA***************************************************/

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PreQuizComponent } from './components/pre-quiz/pre-quiz.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { SegmentsComponent } from './components/segments/segments.component';
import { FinishComponent } from './components/finish/finish.component';
import { PreStartComponent } from './components/pre-start/pre-start.component';
import { LoginComponent } from './components/login/login.component';

/**********************************************ADMINISTRATION**********************************************/

import { AdministrationModule } from "./administration/administration.module";

/**********************************************SERVICES**********************************************/
import { UsersService } from "./services/users.service";
import { SurveyService } from "./services/survey.service";
import { CoursesService } from "./services/course.service";
import { SessionService } from './services/session.service';
import { LoaderEvent } from "./services/loader-event";
import { Broadcaster } from "./services/broadcaster";
import { InitialComponent } from './components/initial/initial.component';
import { InfoComponent } from './components/info/info.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreQuizComponent,
    QuizComponent,
    SegmentsComponent,
    FinishComponent,
    PreStartComponent,
    LoginComponent,
    InitialComponent,
    InfoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AuthModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AdministrationModule,
    RatingModule.forRoot(),
    HttpModule,
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [
    AuthModule,
    AuthGuard,
    SessionService,
    UsersService,
    CustomAuthHttp,
    LoaderEvent,
    Broadcaster,
    SurveyService,
    CoursesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
