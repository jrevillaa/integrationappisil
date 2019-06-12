import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UsersService } from "../services/users.service";
import { Location } from '@angular/common';


@Injectable()
export class AuthGuard implements CanActivate {

  public route;

  constructor(
    private router: Router, 
    private userServivice: UsersService,
    private plat: Location
    ) { }

  canActivate() {

    if (this.userServivice.isAuthenticated()) {    
      return true;
    }

    // not logged in so redirect to login page
    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }
}
