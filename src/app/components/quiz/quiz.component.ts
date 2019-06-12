import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { LoaderEvent } from '../../services/loader-event';
import { SessionService } from '../../services/session.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
	public prerequired = [];
    public allQuestions = [];
  	public segments = [];
  	public realSegment;
    public realArea;
  	public numRealSegment = 0;
    public numRealArea = 0;
    public numRealPart = 0;
    public finish = false;
  	public titles = ['', 'Nunca', 'Rara vez', 'A veces', 'Casi siempre', 'Siempre'];
    public letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    public token;
    public maxTotalPoint = 100;
    public totalPoints = 0;
    public questions = [];
    public seconds = 0;
    public timer;

  constructor(
  	private router: Router,
    private surveyService: SurveyService,
    private loader: LoaderEvent,
    private session: SessionService,
  ) {
      this.loader.fire(true);
  }

  ngOnInit() {
    if(!this.session.getItem('token_survey')){
        this.router.navigate(['/preInicio']);
        this.loader.fire(false);
    }else{
      this.seconds = 0;
      let scope = this;
      this.timer = setInterval(function(){
        scope.seconds ++;
         // console.log(scope.seconds);    
      }, 1000);

      this.token = localStorage.getItem('token_survey');
      this.surveyService.getSurveyQuestions(this.token)
      .subscribe(response => {
        // console.log(response.result);
        this.prerequired = response.result;
        $("html, body").animate({ scrollTop: 0}, -50);
        var prequizes = {};
        for (var i = this.prerequired.length - 1; i >= 0; i--) {
          if(!prequizes[this.prerequired[i].dimension]){
            prequizes[this.prerequired[i].dimension] = {
              name: this.prerequired[i].dimension,
              weight: this.prerequired[i].dimension_weight,
              areas: {},
            };
          }
          if(!prequizes[this.prerequired[i].dimension].areas[this.prerequired[i].area]){
            prequizes[this.prerequired[i].dimension].areas[this.prerequired[i].area] = {
              name: this.prerequired[i].area,
              weight: this.prerequired[i].area_weight,
              questions: [],
            }
          }
          prequizes[this.prerequired[i].dimension].areas[this.prerequired[i].area].questions.push(this.prerequired[i]);
        }
        // console.log(prequizes);
        for (var index in prequizes) {
          var tAreas = [];
          for (var index2 in prequizes[index].areas) {
            tAreas.push(prequizes[index].areas[index2]);
          }
          prequizes[index].areas = tAreas;
          this.segments.push(prequizes[index]);
        }
        this.segments.sort(this.sortWeight);
        for (var ss = this.segments.length - 1; ss >= 0; ss--) {
          this.segments[ss].maxPoint = this.maxTotalPoint/this.segments.length;
          for (var sa = this.segments[ss].areas.length - 1; sa >= 0; sa--) {
            this.segments[ss].areas[sa].maxPoint = this.segments[ss].maxPoint/this.segments[ss].areas.length;
            for (var saq = this.segments[ss].areas[sa].questions.length - 1; saq >= 0; saq--) {
              this.segments[ss].areas[sa].questions[saq].maxPointTotal = this.segments[ss].areas[sa].maxPoint/this.segments[ss].areas[sa].questions.length;
              this.segments[ss].areas[sa].questions[saq].maxPoint = this.segments[ss].areas[sa].maxPoint/this.segments[ss].areas[sa].questions.length/5;
              this.segments[ss].areas[sa].numbers = Array(Math.round(this.segments[ss].areas[sa].questions.length/2)).fill(4);
            }
          }
        }
        this.loader.fire(false);
        this.getSegment();
      });
     }
  }

  answereds(iquestion, ianswer){
    for (var i = this.questions[iquestion].answers.length - 1; i >= 0; i--) {
      this.questions[iquestion].answers[i].selected = false;
    }
    this.questions[iquestion].answers[ianswer].selected = true;
    this.questions[iquestion].answer = this.questions[iquestion].answers[ianswer].text;
  }

  sortWeight(a, b){
  	if(a.weight > b.weight){
  		return 1;
  	}
  	if(b.weight > a.weight){
  		return -1;
  	}
  	return 0;
  }

  getSegment(){
    this.numRealArea = 0;
  	this.realSegment = this.segments[this.numRealSegment];
    this.realSegment.areas.sort(this.sortWeight);
    this.getArea();
    // console.log(this.realSegment);
  }

  getArea(){
    this.numRealPart = 0;
    this.realArea = this.realSegment.areas[this.numRealArea];
    this.realArea.questions.sort(this.sortWeight);
    this.getPart();
  }

  getPart(){
    this.questions = [];
    if(this.realArea.questions[this.numRealPart *2]){
      this.questions.push(this.realArea.questions[this.numRealPart *2]);
    }
    if(this.realArea.questions[(this.numRealPart *2) + 1]){
      this.questions.push(this.realArea.questions[(this.numRealPart *2) + 1]);
    }

    // console.log(this.questions);

  }

  backView(){
    this.numRealPart--;
    if(this.numRealPart <= -1){
      this.numRealArea--;
      if(this.numRealArea <= -1){
        this.numRealSegment--;
        if(this.numRealSegment <= -1){
          this.router.navigate(['/inicio']);
        }else{
          this.getSegment();
          this.numRealArea = this.realSegment.areas.length - 1;
          this.getArea();
          this.numRealPart = this.realArea.numbers.length - 1;
          this.getPart();
        }
      }else{
        this.getArea();
        this.numRealPart = this.realArea.numbers.length - 1;
        this.getPart();
      }
    }
    else{
      this.getPart();
    }      
  }

  validetAnswets(questions){
    var count = 0;

    for(var i=0; i<questions.length; i++){
      if(!questions[i].answer){
        count ++;
      }
    }

    if(count > 0){
      return false
    }else{
      return true
    }
  }

  nextView(questions){
    var validate = this.validetAnswets(questions);
    if(validate){
       if(!this.finish){
        $("html, body").animate({ scrollTop: 0}, -50);
        this.numRealPart++;
        if(!this.realArea.questions[this.numRealPart*2]){
          this.numRealArea++;
          if(this.numRealArea >= this.segments[this.numRealSegment].areas.length){
            this.numRealArea = this.segments[this.numRealSegment].areas.length - 1;
            this.numRealSegment++;
            if(this.numRealSegment >= this.segments.length){
              this.numRealSegment = this.segments.length - 1;
              this.finish = true;
               this.getAllQuestion();
               this.pre2Send();
               clearInterval(this.timer);
               this.loader.fire(true);
               this.surveyService.responseSurveyQuestions({
                 questions: this.allQuestions,
                 total: this.totalPoints,
                 timeout: this.seconds
               }, this.token)
               .subscribe(response => {
                 this.session.setObject('survey', response.result);
                 this.loader.fire(false);
                 this.router.navigate(['/final']);
               });
            }
            else{
              this.getSegment();
            }    
          }  
          else{
            this.getArea();
          }
        }
        else{
          this.getPart();
        }
       }
       else{

       }
    }
   
  }

  pre2Send(){
    this.totalPoints = 0;
     for (var i = this.allQuestions.length - 1; i >= 0; i--) {
       this.allQuestions[i].points = this.allQuestions[i].maxPoint*parseInt(this.allQuestions[i].answer);
       this.totalPoints += this.allQuestions[i].points;
     }
     this.totalPoints = Math.round(this.totalPoints*100)/100;
  }

  getAllQuestion(){
    this.allQuestions = [];
    for(var i = 0; i < this.segments.length; i++){
      for(var o = 0; o < this.segments[i].areas.length; o++){
        for(var u = 0; u < this.segments[i].areas[o].questions.length; u++){
          this.allQuestions.push(JSON.parse(JSON.stringify(this.segments[i].areas[o].questions[u])));
        }
      }
    }
    // console.log(this.allQuestions);
  }

  compare(a,b) {
    if (a.last_nom < b.last_nom)
      return -1;
    if (a.last_nom > b.last_nom)
      return 1;
    return 0;
  }

  hoveringOver(question, ev){
    question.preAnswer = ev;
  }

  resetStar(question){
  	question.preAnswer = 0;
  }

}
