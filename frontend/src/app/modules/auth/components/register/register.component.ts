import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth-service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {timer} from 'rxjs';
import {take} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy{
  profileForm: FormGroup;
  isIdenticalPassword: boolean;
  subscription: Subscription;
  isError: boolean;
  submitted = false;
  countdown: number = 5;

  constructor(private registerForm: FormBuilder, private authService: AuthService, private router: Router){}

  ngOnInit (){
    this.profileForm = this.registerForm.group({
      email: [''],
      password: [''],
      first_name: [''],
      last_name: [''],
      birth_date: ['']
    })
  }

  ngOnDestroy(): void {
    if(this.subscription != undefined)
      this.subscription.unsubscribe();
  }

  onSubmit(formValues){
    formValues.birth_date = undefined;
    this.subscription = this.authService.register(formValues).subscribe({
      next: user => {
        this.submitted = true;
        this.isError = false;
        this.startCountDown();
        setTimeout(() => {
          this.router.navigate(['/home'])
          },5000);
      },
      error: () => this.isError = true,
    })
  }

  startCountDown(){
    timer(1000, 1000).pipe(
      take(5)).subscribe(x=>{
        this.countdown--;
    })
  }

  passwordConfirmation(password: string, passwordConfirm: string): boolean{
    this.isIdenticalPassword = passwordConfirm == password;

    return this.isIdenticalPassword

  }
}
