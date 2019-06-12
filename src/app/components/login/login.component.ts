import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from '../../services/session.service';
import { LoaderEvent } from '../../services/loader-event';
import { UsersService } from '../../services/users.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    FormBuilder, SessionService,
  ]
})
export class LoginComponent implements OnInit {

  public userForm: FormGroup;
  public user = {
    role: '',
    dataCompany: {
      imagelow: ''
    },
    company: ''
  }
  public showError = false;
  public message = '';

  constructor(
  	private router: Router,
    private _fb: FormBuilder,
    private userS: UsersService,
    private loader: LoaderEvent,
    private session: SessionService,

  ) { }

  ngOnInit() {
    
    if(this.session.getItem('user_lapsus')){
       this.user = JSON.parse(localStorage.getItem('user_lapsus'));

       // console.log('entró', this.user.role);

       if(this.user.role == 'Admin'){

         // console.log('llevalo');
         this.router.navigate(['/admin/empresas'])
       }else{
         this.router.navigate(['/admin/empresas/' + this.user.company]);

       }

    }

    this.userForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(model, isValid: Boolean) {//[routerLink]="['/admin/empresas/']" 
      if(isValid){
        this.loader.fire(true);
        this.userS.login(model)
        .subscribe(response =>{

          if(response.status == 494 || response.status == 483){
            this.showError = true;
            this.message = 'Usuario o Contraseña incorrecta';
          }else{
            if(response.token){
              localStorage.setItem('token', response.token);
              localStorage.setItem('user_lapsus', JSON.stringify(response.result));


              // console.log(response.result.role);

              if(response.result.role == 'Admin'){
                this.router.navigate(['/admin/empresas']);
              }
              else if(response.result.role == 'Poolster'){
                this.router.navigate(['/admin/empresas/' + response.result.company]);
              }
              else{
                this.router.navigate(['/admin/empresas/' + response.result.company + '/reportes']);
              }
            }
            else{ }
          }

          this.loader.fire(false);
        })
      }else{
        
      }
  }

}
