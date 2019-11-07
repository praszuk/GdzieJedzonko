import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private loginFormBuilder: FormBuilder ) {}

  ngOnInit() {
    this.loginForm = this.loginFormBuilder.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit(credentials: any) {
    console.log(credentials)
  }
}
