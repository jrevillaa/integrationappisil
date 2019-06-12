import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { LoaderEvent } from '../../services/loader-event';
import * as $ from 'jquery';

@Component({
  selector: 'app-pre-quiz',
  templateUrl: './pre-quiz.component.html',
  styleUrls: ['./pre-quiz.component.css']
})
export class PreQuizComponent implements OnInit {
	public prerequired = []
    public token;

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private loader: LoaderEvent,
    ) { 
    this.loader.fire(true);
  }

  ngOnInit() {
    this.token = localStorage.getItem('token_survey');
    this.surveyService.getInitialQUestions(this.token)
    .subscribe(response =>{
      this.prerequired = response.result;
      for (var i = this.prerequired.length - 1; i >= 0; i--) {
        this.prerequired[i].question_id = this.prerequired[i]._id;
        this.prerequired[i].question = this.prerequired[i].text;
        this.prerequired[i].answer = '';
        this.prerequired[i].canswer = '';
        this.prerequired[i].basnswer = '';
      }
      this.loader.fire(false);
    });
    $("html, body").animate({ scrollTop: 0}, -50);
  }

  saveAnswers(){
    if(this.fullAnswered()){
      this.loader.fire(true);
      // console.log(this.prerequired);
      this.surveyService.responseInitialQUestions({questions:this.prerequired}, this.token)
      .subscribe(response => {
         // console.log(response.result);
         this.router.navigate(['encuesta']);
         this.loader.fire(false);
      });
    }
    else{

    }
  }

  fullAnswered(){
    for (var i = this.prerequired.length - 1; i >= 0; i--) {
      if(!this.prerequired[i].answer){
        return false;
      }
    }
    return true;
  }

  selectTF(ev, parent, button){
  	parent.canswer = false;
  	parent.banswer = false;
  }

}
