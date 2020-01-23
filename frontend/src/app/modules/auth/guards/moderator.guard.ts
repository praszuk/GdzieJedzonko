import { Injectable } from '@angular/core';
import {AuthService} from '../services/auth-service';
import {CanActivate, Router} from '@angular/router';
import {Role} from '../../../models/role.enum';


@Injectable({
  providedIn: 'root'
})
export class ModeratorGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    const userRole = this.authService.getRoleFromTokens();
    if (this.authService.isLoggedIn() && userRole === Role.MODERATOR) {
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }
}
