import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from '../../../services/users.service';
import { CompanyService } from '../../../services/company.service';
import { LoaderEvent } from '../../../services/loader-event';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-grupos-crear',
  templateUrl: './grupos-crear.component.html',
  styleUrls: ['./grupos-crear.component.css']
})
export class GruposCrearComponent implements OnInit {
  
  public group = {
    name: '',
    max_users: 0,
    date_start: '',
    date_end: '',
  }
  public modalRef: BsModalRef;
  public id = '';
  public company = {
  	name: ''
  }
  public user;

  constructor(
  	private router: Router,
    private userService: UsersService,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private loader: LoaderEvent,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    // console.log($('#date_start'));

    this.user = JSON.parse(localStorage.getItem('user_lapsus'));
    //if ( $('#date_start')[0].type != 'date' ) $('#date_start').datepicker();
    //if ( $('#date_end')[0].type != 'date' ) $('#date_end').datepicker();
    
  	var today = new Date();
    var dd = today.getDate() + '';
    var mm = today.getMonth() + 1 + ''; //January is 0!
    var yyyy = today.getFullYear();
    if(parseInt(dd)<10){
      dd = '0' + dd;
    } 
    if(parseInt(mm)<10){
      mm = '0' + mm;
    } 
    var stoday = yyyy+'-'+mm+'-'+dd;
    // console.log(stoday);
    document.getElementById("date_start").setAttribute("min", stoday);
    document.getElementById("date_end").setAttribute("min", stoday);

    this.route.params.subscribe(params => {
      console.log(params);
      this.id = params['id'];
      this.companyService.getCompany_quantity(this.id)
        .subscribe(response => {
          this.company = response.result;
          // console.log(response);
      });

    });
  }

  validateForm(group){
    // console.log('funcion validate', group);
    if(group.name == "" || group.max_users == 0  || group.date_start == 'Invalid date' || group.date_end == 'Invalid date' || group.date_start == '' || group.date_end == '' || group.date_start.length < 10 || group.date_end.length < 10 ){
      return false;
    }else{
      return true;
    }
  }

  close(){
    this.modalRef.hide();
  }

  save(templateValidate: TemplateRef<any>){

    // console.log('return', this.validateForm(this.group));

    if(this.validateForm(this.group)){
  	  //this.loader.fire(true);
      var tTimeStart = this.group.date_start;
      var tTimeEnd = this.group.date_end;
      this.group.date_start = moment(this.group.date_start).toString();
      this.group.date_end = moment(this.group.date_end).toString();
      //console.log(this.group);
      this.companyService.createGroup(this.id, this.group)
      .subscribe(response => {
        this.group.date_start = tTimeStart;
        this.group.date_end = tTimeEnd;
  	    this.loader.fire(false);
        this.router.navigate(['admin/empresas/' + this.id + '/grupos'])
      });
    }else{
      this.modalRef = this.modalService.show(templateValidate, { class: 'modal-md' });
    }
  }
}
