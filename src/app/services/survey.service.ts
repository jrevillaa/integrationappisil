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
export class SurveyService {

  constructor(
    private session: SessionService,
    private http: Http,
    private httpAuth: CustomAuthHttp
  ) { }

  login(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(AppSettings.BASE_PATH + AppSettings.SURVEY_LOGIN, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getPrimaryData(token){
    return this.http.get(AppSettings.BASE_PATH + AppSettings.SURVEY_PRIMARY_DATA + token)
    .map((res: Response) => {
      const response = res.json();
      return response;
    });
  }

  getInitialQUestions(token) {
    return this.http.get(AppSettings.BASE_PATH + AppSettings.SURVEY_INITIAL_QUESTIONS + token)
    .map((res: Response) => {
      const response = res.json();
      return response;
    });
  }

  getSurveyQuestions(token) {
    return this.http.get(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTIONS + token)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  responseInitialQUestions(params, token) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(AppSettings.BASE_PATH + AppSettings.SURVEY_INITIAL_QUESTIONS + token, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  responseSurveyQuestions(params, token) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(AppSettings.BASE_PATH + AppSettings.SURVEY_QUESTIONS + token, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getRoles(){
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.USERS_ROLES)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  createUser(params){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.USERS, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  updateUser(params){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.USERS + '/' + params['_id'], body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getUser(id) {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.USERS + '/' + id)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteUser(params){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.USERS + '/' + params['_id'])
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
