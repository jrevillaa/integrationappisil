import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SurveyQuestionService } from '../../../services/survey_questions'; 
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import * as $ from 'jquery';


@Component({
  selector: 'app-preguntas-list',
  templateUrl: './preguntas-list.component.html',
  styleUrls: ['./preguntas-list.component.css']
})
export class PreguntasListComponent implements OnInit {


 public filterPreguntasAll = {quantity: 5, p1: 1};
   public modalRef: BsModalRef;
   public preguntas = [ ]
    public id;
    public idArea;
    public area = {
      dimension: '',
      dimension_name: '',
      _id: '',
      name: '',
      weight: 0,
    }
    public questions = [];
    public tQuestion;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private loader: LoaderEvent,
    private surveyService: SurveyQuestionService,
  ) {
    // this.loader.fire(true);
  }

  ngOnInit() {
    this.loader.fire(true);
    
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.idArea = params['idArea'];
      this.area.dimension = this.id;
      this.area._id = this.idArea;
      this.surveyService.getQuestions(this.area)
      .subscribe(response => {
        this.area.dimension_name = response.result.dimension;
        this.area.name = response.result.area.name;
        this.area.weight = response.result.area.weight;
        this.questions = response.result.questions;
        this.addParents();
        this.loader.fire(false);
      });
    });
  }

  addParents(){
    for (var i = this.questions.length - 1; i >= 0; i--) {
      this.questions[i].dimension = this.area.dimension;
      this.questions[i].area = this.area._id;
    }
  }

  updateArea(){
    if(this.area.name != ''){
      if(!this.area.weight){
        this.area.weight = 0;
      }
      this.loader.fire(true);
      this.surveyService.updateArea(this.area)
      .subscribe(response => {
        this.loader.fire(false);
        this.collapse();
      });
    }
  }

  deleteArea(){
    this.loader.fire(true);
    this.surveyService.deleteArea(this.area)
    .subscribe(response => {
      this.modalRef.hide();
      this.loader.fire(false);
      this.router.navigate(['admin/preguntas/' + this.id]);
    });
  }

  deleteQuestion(){
    this.loader.fire(true);
    this.surveyService.deleteQuestion(this.tQuestion)
    .subscribe(response => {
      this.loader.fire(false);
      this.questions = response.result;
      this.modalRef.hide();
      this.addParents();
    });
  }

  collapse(){
    $( ".form-add" ).slideToggle();
  }

  pageChanged(ev){
    this.filterPreguntasAll.p1 = parseInt(ev);
    // console.log(ev);
  }  

  openModal(template: TemplateRef<any>, question = null) {
    if(question){
      this.tQuestion = question;
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

}
