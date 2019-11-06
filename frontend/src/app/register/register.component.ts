import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  profileForm: FormGroup;


  constructor(private registerForm: FormBuilder){

  }
  ngOnInit (){
    this.profileForm = this.registerForm.group({
      email: [''],
      password: [''],
      first_name: [''],
      last_name: [''],
      birth_date: ['']
    });
  }

  onSubmit(formValues){
  }
}
