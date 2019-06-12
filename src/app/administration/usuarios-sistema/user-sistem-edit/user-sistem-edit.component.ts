import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from '../../../services/users.service';
import { LoaderEvent } from '../../../services/loader-event';
import { CompanyService } from '../../../services/company.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-sistem-edit',
  templateUrl: './user-sistem-edit.component.html',
  styleUrls: ['./user-sistem-edit.component.css']
})
export class UserSistemEditComponent implements OnInit {

  public empresas = [
  	{
  		id: '0',
  		name: 'Backus'
  	},
  	{
  		id: '1',
  		name: 'Asociación de Exportadores'
  	},
  	{
  		id: '2',
  		name: 'Banco de Credito del Perú'
  	},
  	{
  		id: '3',
  		name: 'Pandero'

  	}
  ]
  public companies = [
  ]
  public tRoles = [];
  public roles = [];
  public nameRoles = {
    'Admin': 'Administrador',
    'Poolster': 'Encuestador',
    'Reader': 'Lector',
  }
  public id:any;
  public user = {
    _id: '',
    name: '',
    role: '',
    email: '',
    password: '',
    company: '',
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private loader: LoaderEvent,
  ) {
    // this.loader.fire(true);
  }

  ngOnInit() {
    this.loader.fire(true);
    
    this.userService.getRoles()
    .subscribe(response => {
      this.tRoles = response.result;
      for (var i = 0; i < this.tRoles.length; i++) {
        this.roles.push({
          _id: this.tRoles[i],
          name: this.nameRoles[this.tRoles[i]],
        });
      }
      // console.log(response.result);
      this.companyService.getCompanies()
      .subscribe(response => {
        this.companies = response.result;
        this.loader.fire(false);
      })      
    })

    this.route.params.subscribe(params => {
      // console.log(params);
      this.id = params['id'];
      this.userService.getUser(this.id)
      .subscribe(response => {
        // console.log(response);
        this.user = response.result;
      });
    });
  }

  save(){
    if(this.user.name && this.user.email && ((this.user.role == 'Admin') || ((this.user.role == 'Poolster' || this.user.role == 'Reader') && this.user.company))){
      if(this.user.role == 'Admin'){
        this.user.company = '';
      }
      this.loader.fire(true);
      this.userService.updateUser(this.user)
      .subscribe(response => {
        this.loader.fire(false);
        this.router.navigate(['admin/usuarios']);
      });
    }
  }

  openModal(template: TemplateRef<any>) {
  }

  pageChanged(ev){
  }

}
