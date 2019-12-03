import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitSuccess: boolean;
  submitError: boolean;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    }, {validator: this.passwordConfirming});
  }

  onSubmit() {
    this.userService.editProfile({password: this.changePasswordForm.get('password').value}).subscribe(
      (next) => {
        this.changePasswordForm.reset();
        this.submitError = false;
        this.submitSuccess = true;
      },
      (error) => {
        this.changePasswordForm.reset();
        this.submitSuccess = false;
        this.submitError = true;
      }
    );
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value) {
      return {invalid: true};
    }
  }

}
