import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UsersService } from '../../../services/users.service';
import { LoaderEvent } from '../../../services/loader-event';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CompanyService } from '../../../services/company.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-grupos-list',
  templateUrl: './grupos-list.component.html',
  styleUrls: ['./grupos-list.component.css']
})
export class GruposListComponent implements OnInit {

  public modalRef: BsModalRef;
  public filterGruposAll = {quantity: 10, p1: 1};
  public grupos = [];
  public id;
  public tGrupos:any;
  public company = {
    name: ''
  }
  public user;
  public idGrupo;

  constructor(
  	private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private userService: UsersService,
    private loader: LoaderEvent,
    private companyService: CompanyService,
  ) { 
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user_lapsus'));
  	this.route.params.subscribe(params => {
      // console.log(params);
      this.id = params['id'];
      this.companyService.getCompany_quantity(this.id)
        .subscribe(response => {
          this.company = response.result;
          // console.log(response);
      });
      this.getGrupos(this.id);
      
    });
  }

  getGrupos(id){
    this.loader.fire(true);
    
    this.companyService.getGrupos(id)
      .subscribe(response =>{
          // console.log(response);
          this.grupos = response.result.groups
          this.loader.fire(false);

          if(this.grupos.length){
             for(var i=0; i<this.grupos.length; i++){
               var fecha_ini = (this.grupos[i].date_start).split('T')[0];
               var fecha_end = (this.grupos[i].date_end).split('T')[0];
               var d_ini = fecha_ini.split('-')[2];
               var m_ini = fecha_ini.split('-')[1];
               var y_ini = fecha_ini.split('-')[0];
               var d_end = fecha_end.split('-')[2];
               var m_end = fecha_end.split('-')[1];
               var y_end = fecha_end.split('-')[0];
               this.grupos[i].date_start = d_ini + '-' + m_ini + '-' + y_ini;
               this.grupos[i].date_end = d_end + '-' + m_end + '-' + y_end;

            }
          }
     })
  }

  pageChanged(ev){
    this.filterGruposAll.p1 = parseInt(ev);
  }

  openModal(template: TemplateRef<any>, grupo) {
    this.idGrupo = grupo._id;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  delete(){
    this.loader.fire(true);
    this.companyService.deleteGrupo(this.id, this.idGrupo)
    .subscribe(response => {
      // if(response.result && response.result.groups[0]._id){
      //   this.grupos = this.grupos.filter(item => item._id != response.result.groups[0]._id);
      // }
      this.getGrupos(this.id);
      this.modalRef.hide();
      this.loader.fire(false);
    });
  }


}
