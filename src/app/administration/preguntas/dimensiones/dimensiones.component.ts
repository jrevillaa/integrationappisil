import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { SurveyQuestionService } from '../../../services/survey_questions'; 
import { CoursesService } from '../../../services/course.service'; 
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-dimensiones',
  templateUrl: './dimensiones.component.html',
  styleUrls: ['./dimensiones.component.css']
})
export class DimensionesComponent implements OnInit {
  public newDimension = {
    name: '',
    weight: 0,
    course: '',
  }
  public dimensions = [];
  public courses = [];
  public modalRef: BsModalRef;
  public tDimension;

  constructor(
  	private router: Router,
    private modalService: BsModalService,
    private loader: LoaderEvent,
    private surveyService: SurveyQuestionService,
    private courseService: CoursesService,
  ) {
    this.loader.fire(true);
  }

  ngOnInit() {
    this.surveyService.getDimensions()
    .subscribe(response => {
      this.dimensions = response.result;
      this.courseService.getCourses()
      .subscribe(response => {
          this.loader.fire(false);
          this.courses = response.result;
          this.newDimension.course = this.courses[0]._id;
          console.log(response.result);
      });
    });
  }

  save(){
    if(this.newDimension.name != ''){
      this.loader.fire(true);
      this.surveyService.createDimension(this.newDimension)
      .subscribe(response => {
        this.dimensions.push(response.result);
        this.loader.fire(false);
      });
    }    
  }

  collapse(){
    $( ".form-add" ).slideToggle();
  }

  openModal(template: TemplateRef<any>, dimension) {
    this.tDimension = dimension;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  goDimension(event, id){
    // console.log(event.toElement.localName);
    if(event.toElement.localName != 'i' && event.toElement.localName != 'button'){
      this.router.navigate(['admin/preguntas/' + id]);
    }
  }

  deleteDimension(){
    this.loader.fire(true);
    this.surveyService.deleteDimension(this.tDimension._id)
    .subscribe(response => {
      if(response.status == 210){
        for (var i = this.dimensions.length - 1; i >= 0; i--) {
          if(this.dimensions[i]._id == this.tDimension._id){
            this.dimensions.splice(i, 1);
          }
        }
        //this.router.navigate(['admin/preguntas']);
      }
      this.loader.fire(false);
      this.modalRef.hide();
    });    
  }

}
