import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import { SurveyQuestionService } from '../../../services/survey_questions'; 
import * as $ from 'jquery';

@Component({
  selector: 'app-dimension',
  templateUrl: './dimension.component.html',
  styleUrls: ['./dimension.component.css']
})
export class DimensionComponent implements OnInit {
    public filterPreguntasAll = {quantity: 5, p1: 1};
    public modalRef: BsModalRef;
    public preguntas = [	];
  	public id;
  	public newArea = {
  		dimension: '',
	    name: '',
	    weight: 0,
	  }
  	public areas = [];
  	public dimension = {
  		_id: '',
  		name: '',
  		weight: 0,
  	}
  	public tArea;
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
      // console.log(params);
      this.id = params['id'];
      this.newArea.dimension = this.id;
      this.surveyService.getAreas(this.id)
      .subscribe(response => {
        this.dimension = response.result;
        this.areas = response.result.areas;
        this.loader.fire(false);
      });
    });
  }

  save(){
    if(this.newArea.name != ''){
      this.loader.fire(true);
      this.surveyService.createArea(this.newArea)
      .subscribe(response => {
        this.loader.fire(false);
        this.areas = response.result.areas;
        this.newArea.name = '';
        this.newArea.weight = 0;
      });
    }    
  }

  updateDimension(){
  	if(this.dimension.name != ''){
  		if(!this.dimension.weight){
  			this.dimension.weight = 0;
  		}
      this.loader.fire(true);
  		this.surveyService.updateDimension(this.dimension)
  		.subscribe(response => {
  			this.loader.fire(false);
  		});
  	}
  }

  collapse(){
    $( ".form-add.dimension-edit" ).slideToggle();
  }

  collapseAdd(){
    $( ".form-add.area" ).slideToggle();
  }

  goArea(event, id){
  	if(event.toElement.localName != 'i' && event.toElement.localName != 'button'){
  		this.router.navigate(['admin/preguntas/' + this.id + '/' + id + '/lista-preguntas']);
  	}
  }

  deleteArea(){
  	this.tArea.dimension = this.dimension._id;
    this.loader.fire(true);
    this.surveyService.deleteArea(this.tArea)
    .subscribe(response => {
      if(response.status == 210){
        for (var i = this.areas.length - 1; i >= 0; i--) {
          if(this.areas[i]._id == this.tArea._id){
            this.areas.splice(i, 1);
          }
        }
        this.loader.fire(false);
        //this.router.navigate(['admin/preguntas']);
      }
      this.modalRef.hide();
    });    
  }

  pageChanged(ev){
    this.filterPreguntasAll.p1 = parseInt(ev);
    // console.log(ev);
  }	

  openModal(template: TemplateRef<any>, area) {
  	this.tArea = area;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

}
