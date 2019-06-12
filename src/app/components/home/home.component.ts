import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { SurveyService } from '../../services/survey.service';
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public survey:any = {};
  public token:any;
  public data:any = {
    startsecond: false,
  };
  constructor(
    private session: SessionService,
  	private router: Router,
    private surveyService: SurveyService,
  	) { }

  ngOnInit() {
  	if(!this.session.getItem('token_survey')){
        this.router.navigate(['/preInicio']);
    }
    else{
      this.token = this.session.getItem('token_survey');
      this.surveyService.getPrimaryData(this.token)
      .subscribe(response => {
          this.data = response.result; 
          console.log(response);
      });
    }
  }

}
