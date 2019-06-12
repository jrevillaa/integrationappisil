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
export class SurveyQuestionService {

  constructor(
    private session: SessionService,
    private http: Http,
    private httpAuth: CustomAuthHttp
  ) { }

  createDimension(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getDimensions() {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.SURVEY_QUESTION)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getDimension(id) {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.SURVEY_QUESTION + '/' + id )
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteDimension(id) {
    return this.httpAuth.delete(AppSettings.BASE_PATH +AppSettings.SURVEY_QUESTION + '/' + id )
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  updateDimension(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['_id'], body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getAreas(id){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + id + '/area')
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  createArea(params){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area', body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getArea(params){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['_id'])
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  updateArea(params){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['_id'], body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteArea(params){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['_id'])
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getQuestions(params){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['_id'] + '/question')
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  createQuestion(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['_id'] + '/question', body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getQuestion(params){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['area'] + '/question/' + params['_id'])
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteQuestion(params){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['area'] + '/question/' + params['_id'])
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  updateQuestion(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTION + '/' + params['dimension'] + '/area/' + params['area'] + '/question/' + params['_id'], body, options)
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
