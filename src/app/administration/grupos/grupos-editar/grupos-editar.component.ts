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
  selector: 'app-grupos-editar',
  templateUrl: './grupos-editar.component.html',
  styleUrls: ['./grupos-editar.component.css']
})
export class GruposEditarComponent implements OnInit {

  public group = {
    name: '',
    max_users: 0,
    date_start: '',
    date_end: '',
    _id: '',
    retro_dimension: [],
    retro_company: ''
  }
  public filterDetail = {
    company: '',
    behavior: '',
    group: '',
    area: '',
    dimension: '',
  };;
  public modalRef: BsModalRef;
  public id = '';
  public idGrupo = '';
  public company = {
  	name: ''
  }
  public user;
  public showMessage = false;
  public dimensions = [];
  constructor(
  	private router: Router,
    private userService: UsersService,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private loader: LoaderEvent,
    private route: ActivatedRoute,
  ) {
    // this.loader.fire(true);
  }

  ngOnInit() {

    this.loader.fire(true);
    
    this.user = JSON.parse(localStorage.getItem('user_lapsus'));
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
    document.getElementById("date_start").setAttribute("min", stoday);
    document.getElementById("date_end").setAttribute("min", stoday);
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.idGrupo = params['idGrupo'];
      this.companyService.getCompany_quantity(this.id)
      .subscribe(response => {
          this.company = response.result;
          this.filterDetail.group = this.idGrupo;
          this.filterDetail.company = this.id;
          this.companyService.getGrupo(this.id, this.idGrupo)
            .subscribe(response =>{
              this.loader.fire(false);
              this.group = response.result[0];
              this.group.date_end = this.group.date_end.split('T')[0];
              this.group.date_start = this.group.date_start.split('T')[0];
              this.group.retro_dimension = this.group.retro_dimension;
              this.getDimentions(this.filterDetail, this.group);
            })

          // this.getGrupo(this.id, this.idGrupo);
      });



    });
  }

  getGrupo(id, idGrupo){
  	this.companyService.getGrupo(id, idGrupo)
  		.subscribe(response =>{
        this.loader.fire(false);
  			this.group = response.result[0];
  			this.group.date_end = this.group.date_end.split('T')[0];
        this.group.date_start = this.group.date_start.split('T')[0];
  		})
  }

  edit(){
  	this.loader.fire(true);
  	let params = this.group;
  	this.companyService.editGrupo(params, this.id, this.idGrupo)
  		.subscribe(response =>{
  			this.loader.fire(false);
  			this.showMessage = true;
  		})
  }

  getDimentions(params, group){


    this.companyService.getPercentDimension(params)
    .subscribe(response => {
      this.dimensions = response.result;
      this.loader.fire(false);
      if(this.dimensions.length > 0){
        if(group.retro_dimension.length == 0){
           for (var i = this.dimensions.length - 1; i >= 0; i--) {
            this.group.retro_dimension.push({dimension_id: this.dimensions[i]._id.dimension_id, text:'', name: this.dimensions[i]._id.dimension})
          }
        }else{
          this.group.retro_dimension = group.retro_dimension;
          for(var i=0; i<this.dimensions.length;i++){
            for(var j=0; j<this.group.retro_dimension.length; j++){
              if(this.group.retro_dimension[j].dimension_id == this.dimensions[i]._id.dimension_id){
                this.group.retro_dimension[j].name = this.dimensions[i]._id.dimension;
              }
            }
          }
        }
      }
    });
  }

}
