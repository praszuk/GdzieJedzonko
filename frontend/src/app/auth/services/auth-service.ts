import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../user";
import {Token} from "../token.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = "access";
  private readonly REFRESH_TOKEN = "refresh";
  private user: User;

  constructor(private http: HttpClient) {}


  login() {

  }

  logout() {

  }

  isLoggedIn() {

  }

  refreshToken() {

  }

  getToken() {

  }

}
