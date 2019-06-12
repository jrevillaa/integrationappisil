import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from '../../../services/users.service';
import { LoaderEvent } from '../../../services/loader-event';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';


@Component({
  selector: 'app-user-sistem-create',
  templateUrl: './user-sistem-create.component.html',
  styleUrls: ['./user-sistem-create.component.css']
})
export class UserSistemCreateComponent implements OnInit {

  public companies = [
  ]
  public tRoles = [];
  public roles = [];
  public nameRoles = {
    'Admin': 'SuperAdmin',
    'Poolster': 'Admin',
    'Reader': 'Lector',
  }

  public user = {
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
  }
  public emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  public modalRef: BsModalRef;

  constructor(
  	private router: Router,
    private userService: UsersService,
    private modalService: BsModalService,
    private loader: LoaderEvent,
  ) {
    // this.loader.fire(true);
     }

  ngOnInit() {
    // this.userService.getRoles()
    // .subscribe(response => {
    //   this.tRoles = response.result;
    //   for (var i = 0; i < this.tRoles.length; i++) {
    //     this.roles.push({
    //       _id: this.tRoles[i],
    //       name: this.nameRoles[this.tRoles[i]],
    //     });
    //   }
    //   this.companyService.getCompanies()
    //   .subscribe(response => {
    //     this.companies = response.result;
    //     this.loader.fire(false);
    //   })      
    // })
  }

  validateForm(user){

    if(user.nombres == "" || user.apellidos == "" || user.correo == "" || user.dni == "" ){
      return false
    }else{
      return true;
    }
  }

   close(){
    this.modalRef.hide();
  }

  save(templateValidate: TemplateRef<any>){
    
    if(this.validateForm(this.user)){
      this.loader.fire(true);
      this.userService.createUser(this.user)
      .subscribe(response => {
        this.loader.fire(false);
        this.router.navigate(['users']);
      });    
    }else{
      this.modalRef = this.modalService.show(templateValidate, { class: 'modal-md' });
    }

  }

  openModal(template: TemplateRef<any>) {
  }

  pageChanged(ev){
  }

}
