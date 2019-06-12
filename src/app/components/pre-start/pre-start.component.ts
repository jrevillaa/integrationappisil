import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { CompanyService } from '../../services/company.service';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../services/loader-event';
import { SurveyService } from '../../services/survey.service';

@Component({
  selector: 'app-pre-start',
  templateUrl: './pre-start.component.html',
  styleUrls: ['./pre-start.component.css']
})
export class PreStartComponent implements OnInit {
  @ViewChild('templateValidate') modalN :TemplateRef<any>;
	public survey = {
		code: '',
	};
  public modalRef: BsModalRef;
  public message = '';

  constructor(
  	private surveyService: SurveyService,
  	private router: Router,
    private loader: LoaderEvent,
    private modalService: BsModalService,
    private route: ActivatedRoute,
  	) { }

  ngOnInit() {
    console.log(this.route.params['value'].code);
    this.survey.code = this.route.params['value'].code;
    if(this.route.params && this.route.params['value'] && this.route.params['value'].code){
      this.login(this.modalN);
    }
  }

  close(){
    this.modalRef.hide();
  }


  login(templateValidate: TemplateRef<any>){
  	if(this.survey.code){
      this.loader.fire(true);
  		this.surveyService.login(this.survey)
	  	.subscribe(response => {
	  		if(response.status == 201){
		  		localStorage.setItem('token_survey', response.result);
		  		this.router.navigate(['inicio']);
          this.loader.fire(false);
	  		}else{
          this.modalRef = this.modalService.show(templateValidate, { class: 'modal-md' });
          this.message = response.result;
          this.loader.fire(false);
        }
	  	});
	  }	  	
  }

}
