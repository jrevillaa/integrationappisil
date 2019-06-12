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
export class CompanyService {

  constructor(
    private session: SessionService,
    private http: Http,
    private httpAuth: CustomAuthHttp
  ) { }

  createCompany(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.COMPANIES, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getCompanies() {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.COMPANIES)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getCompany_quantity(id) {
    return this.httpAuth.get(AppSettings.BASE_PATH +AppSettings.COMPANIES + '/' + id + '/quantity')
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getAreas(id){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + '/areas')
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getSurveyeds(id, idGrupo){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + '/surveyeds/' + idGrupo)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  createArea(params, area){
    const body = JSON.stringify(area);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + params['company'] + '/areas', body, options)
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

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + params['company'] + '/areas/' + params['_id'], body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteArea(params){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + params['company'] + '/areas/' + params['_id'])
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getCompany_surveyeds(id){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + '/surveyeds')
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getCompany(id){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteCompany(id){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteUser(id){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.SURVEYEDS + '/' + id)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  updateCompany(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + params['_id'], body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  surveyedsMasive(params: Object) {
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.SURVEYEDS_MASIVE, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  editEncuestado(params, id){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.SURVEYEDS + '/' + id, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  masiveDelete(id, idGroup){

    const body = JSON.stringify({company: id, group_id: idGroup});
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.SURVEYEDS_MASIVE, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  masiveSend(id, idGroup, params){

    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + '/invite/' + idGroup, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  createGroup(id, group){
    const body = JSON.stringify(group);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + AppSettings.GROUPS, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getGrupos(id){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + AppSettings.GROUPS)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  deleteGrupo(id, idGrupo){
    return this.httpAuth.delete(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + AppSettings.GROUPS + idGrupo)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getGrupo(id, idGrupo){
    return this.httpAuth.get(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + AppSettings.GROUPS + idGrupo)
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
  }

  editGrupo(params, id, idGrupo){

    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.put(AppSettings.BASE_PATH + AppSettings.COMPANIES + '/' + id + AppSettings.GROUPS + idGrupo, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  //*****************************************REPORTES*****************************************
  
  reportEvolution(params:Object){

    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.REPORTS + AppSettings.EVOLUTIONS, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getWeeks(params:Object){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.REPORTS + AppSettings.WEEKS, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  forExcel(params:Object){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.REPORTS + AppSettings.FOREXCEL, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }


  reportGeneral(params:Object){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });
    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.REPORTS + AppSettings.GENERAL, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }


  getPercentDimension(params:Object){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.REPORTS + AppSettings.PERCENT_DIMENSION, body, options).map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getDimensionDetail(params:Object){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });

    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.REPORTS + AppSettings.DETAIL, body, options)
    .map((res: Response) => {
      const response = res.json();
      return response;
    })
  }

  getPercentQuestion(params:Object){
    const body = JSON.stringify(params);
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = new RequestOptions({ headers: headers });
    return this.httpAuth.post(AppSettings.BASE_PATH + AppSettings.REPORTS + AppSettings.QUESTIONS, body, options)
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
