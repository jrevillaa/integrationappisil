import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UsersService } from '../../../services/users.service';
import { LoaderEvent } from '../../../services/loader-event';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';


@Component({
  selector: 'app-user-sistem-list',
  templateUrl: './user-sistem-list.component.html',
  styleUrls: ['./user-sistem-list.component.css']
})
export class UserSistemListComponent implements OnInit {
   
  public modalRef: BsModalRef;
  public filterUsuariosAll = {quantity: 10, p1: 1};
  public showEdit = false;
  public showButtons = true;
  public users = [];
  public nameRoles = {
    'Admin': 'SuperAdmin',
    'Poolster': 'Admin',
    'Reader': 'Lector',
  }
  public tUser:any;

  constructor(
  	private router: Router,
    private modalService: BsModalService,
    private userService: UsersService,
    private loader: LoaderEvent,
  ) {
    this.loader.fire(true);
  }

  ngOnInit() {    
    this.userService.getUsers()
    .subscribe(response => {
      this.users = response.data;
      this.loader.fire(false);
    });
  }

  openModal(template: TemplateRef<any>, user) {
    this.tUser = user;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  delete(){
    this.loader.fire(true);
    this.userService.deleteUser(this.tUser)
    .subscribe(response => {
      if(response.result && response.result._id){
        this.users = this.users.filter(item => item._id != response.result._id);
        this.modalRef.hide();
      }
      this.loader.fire(false);
    });
  }

  pageChanged(ev){
    this.filterUsuariosAll.p1 = parseInt(ev);
  }

}
