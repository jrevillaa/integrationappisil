import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import { SurveyQuestionService } from '../../../services/survey_questions'; 
import { CoursesService } from '../../../services/course.service'; 
import * as $ from 'jquery';

@Component({
  selector: 'app-dimension-editar',
  templateUrl: './dimension-editar.component.html',
  styleUrls: ['./dimension-editar.component.css']
})
export class DimensionEditarComponent implements OnInit {
	public id;
	public dimension = {
		_id: '',
		name: '',
		weight: 0,
    course: '',
	};
  public courses = [];
  constructor(
  	private router: Router,
  	private route: ActivatedRoute,
    private modalService: BsModalService,
    private loader: LoaderEvent,
    private surveyService: SurveyQuestionService,
    private courseService: CoursesService,
  ) {
    this.loader.fire(true);
  }

  ngOnInit() {    
  	this.route.params.subscribe(params => {
      this.id = params['id'];
      this.surveyService.getDimension(this.id)
      .subscribe(response => {
        this.dimension = response.result;
        this.courseService.getCourses()
        .subscribe(response => {
            this.loader.fire(false);
            this.courses = response.result;
            console.log(response.result);
        });
      });
    });
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
  			this.router.navigate(['admin/preguntas']);
  		});
  	}
  }

}
