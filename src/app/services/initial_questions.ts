import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Response, Headers, RequestOptions, Http } from '@angular/http';

import { AppSettings } from '../app.setting';
import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {AuthHttp} from 'angular2-jwt';
import {CustomAuthHttp} from "../auth/custom-auth-http";

@Injectable()
export class InitialQuestionService {

  constructor(
    private session: SessionService,
    private http: Http,
    private httpAuth: CustomAuthHttp
  ) { }

  getQuestions() {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.INITIAL_QUESTION)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getTypes(){
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.TYPES_INITIAL_QUESTION)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  createQuestion(params){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.INITIAL_QUESTION, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  updateQuestion(params){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.INITIAL_QUESTION + '/' + params['_id'], body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getQuestion(id) {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.INITIAL_QUESTION + '/' + id)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteQuestion(params){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.INITIAL_QUESTION + '/' + params['_id'])
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  handleError(error) {
    return Observable.throw(error);
  }

  isAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

}
