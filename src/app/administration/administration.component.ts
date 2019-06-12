import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { AppSettings } from '../app.setting';
import { SessionService } from '../services/session.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

	public user = {
    role: '',
    dataCompany: {
      imagelow: ''
    },
    company: ''
  }
	public nameRoles = {
	   'Admin': 'SuperAdmin',
	   'Poolster': 'Admin',
     'Reader': 'Lector',
	}
  public image = '';
  constructor(
  	private router: Router,
    private session: SessionService,

  	) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user_lapsus'));

    // if(this.user.role == 'Admin'){
    //   this.image = './assets/images/logo.png'
    // }else{
    //   this.image = AppSettings.BASE_PATH + this.user.dataCompany.imagelow;
    // }

  }

  logout(){
  	localStorage.clear();
  	window.location.reload();
  }

  collapse(){
    $( ".menu-list").slideToggle( "slow" );
  }

  goCompanies(){
  	if(this.user.role == 'Admin'){
  		this.router.navigate(['admin/empresas']);
  	}
  	else if(this.user.role == 'Poolster'){
  		this.router.navigate(['admin/empresas/' + this.user.company]);
  	}
    else{
      this.router.navigate(['admin/empresas/' + this.user.company + '/reportes']);
    }
  }

}
