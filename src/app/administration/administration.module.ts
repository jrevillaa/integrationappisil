import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/***************************************************INSTALADOS***************************************************/

import { RatingModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSelectModule } from 'ngx-select-ex';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AlertModule } from 'ngx-bootstrap/alert';
import { FilterPipeModule } from 'ngx-filter-pipe';


/***************************************************ADMIN***************************************************/

import { AdministrationComponent } from './administration.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { UserSistemCreateComponent } from './usuarios-sistema/user-sistem-create/user-sistem-create.component';
import { UserSistemEditComponent } from './usuarios-sistema/user-sistem-edit/user-sistem-edit.component';
import { UserSistemListComponent } from './usuarios-sistema/user-sistem-list/user-sistem-list.component';

/************************************ SERVICES **************************************/
import { ExcelService } from '../services/excelservice';
import { InitialQuestionService } from "../services/initial_questions";
import { SurveyQuestionService } from "../services/survey_questions";

@NgModule({
  declarations: [
    AdministrationComponent,
    UserSistemCreateComponent,
    UserSistemEditComponent,
    UserSistemListComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    BrowserModule,
    FormsModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    NgxSelectModule,
    TabsModule.forRoot(),
    NgxChartsModule,
    AccordionModule.forRoot(),
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    FilterPipeModule
  ],
  providers:[
    SurveyQuestionService,
    InitialQuestionService,
    ExcelService,
  ]
})
export class AdministrationModule { }