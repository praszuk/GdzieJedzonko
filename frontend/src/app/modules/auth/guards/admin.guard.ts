import { Injectable } from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import {AuthService} from '../services/auth-service';
import {Role} from '../../../models/role.enum';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canLoad() {
    const userRole = this.authService.getRoleFromTokens();
    if (this.authService.isLoggedIn() && userRole === Role.ADMIN) {
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }
}
