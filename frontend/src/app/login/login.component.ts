import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth/services/auth-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isError: boolean;
  constructor(private loginFormBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.loginForm = this.loginFormBuilder.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit(credentials: {email: string; password: string}) {
    this.authService.login(credentials).subscribe(
      (response) => {
          if(response)
            this.router.navigate(['/home']);
          else
            this.isError = true;
      },
      (error) =>{
        console.log(error)

      })
  }
}
