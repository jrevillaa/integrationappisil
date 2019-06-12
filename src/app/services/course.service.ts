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
export class CoursesService {

  constructor(
    private session: SessionService,
    private http: Http,
    private httpAuth: CustomAuthHttp
  ) { }

  getCourses() {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.COURSES)
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
