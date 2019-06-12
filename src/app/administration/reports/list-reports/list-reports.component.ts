import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoaderEvent } from '../../../services/loader-event';
import { CompanyService } from '../../../services/company.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.css']
})
export class ListReportsComponent implements OnInit {
  public modalRef: BsModalRef;
  public user;
  public company = {
    name: ''
  }
  public id;
  constructor(  
  	private router: Router,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private loader: LoaderEvent,
    private route: ActivatedRoute,
  ) {
    // this.loader.fire(true);
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user_lapsus'));
    this.route.params.subscribe(params => {
      // console.log(params);
      this.id = params['id'];
      this.companyService.getCompany_quantity(this.id)
      .subscribe(response => {
        this.loader.fire(false);
        this.company = response.result;
        // console.log(response);
      });
    });
  }

  goStatus(){
  	this.router.navigate(['admin/empresas/' + this.id + '/reportes/status']);
  }

  goRespuestas(){
    this.router.navigate(['admin/empresas/' + this.id + '/reportes/respuestas']);
  }

  goDiagnostic(){
    this.router.navigate(['admin/empresas/' + this.id + '/reportes/diagnostic']);
  }
}
