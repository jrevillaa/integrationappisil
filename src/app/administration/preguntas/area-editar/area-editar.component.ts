import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import { SurveyQuestionService } from '../../../services/survey_questions'; 
import * as $ from 'jquery';

@Component({
  selector: 'app-area-editar',
  templateUrl: './area-editar.component.html',
  styleUrls: ['./area-editar.component.css']
})
export class AreaEditarComponent implements OnInit {
	public id;
	public idArea;
	public area = {
		_id: '',
		name: '',
		weight: 0,
		dimension: '',
		dimension_name: '',
	}
  constructor(
  	private router: Router,
  	private route: ActivatedRoute,
    private modalService: BsModalService,
    private surveyService: SurveyQuestionService,
    private loader: LoaderEvent,
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
      this.surveyService.getArea(this.area)
      .subscribe(response => {
        this.area = response.result;
        this.area.dimension_name = response.result.dimension;
     	  this.area.dimension = this.id;
        this.loader.fire(false);
      });
    });
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
        this.router.navigate(['admin/preguntas/' + this.area.dimension])
      });
    }
  }

}
