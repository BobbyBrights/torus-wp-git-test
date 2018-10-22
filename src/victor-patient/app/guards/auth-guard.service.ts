import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authentication: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authentication.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['login'], {
      queryParams: {
        return: state.url
      }
    });
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authentication.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['login'], {
      queryParams: {
        return: state.url
      }
    });
    return false;
  }



}
