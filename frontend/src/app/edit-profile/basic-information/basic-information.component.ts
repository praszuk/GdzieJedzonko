import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css']
})
export class BasicInformationComponent implements OnInit {
  editBasicInformationForm: FormGroup;
  submitSuccess: boolean;
  submitError: boolean;
  private isAdmin: boolean;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isAdmin = this.activatedRoute.parent.snapshot.params.id !== undefined;

    this.editBasicInformationForm = this.formBuilder.group({
      email: ['', Validators.email],
      first_name: [''],
      last_name: [''],
      role: [''],
      birth_date: ['']
    });
  }

  onSubmit() {
    const dirtyValues = this.getDirtyValues(this.editBasicInformationForm);
    if (this.isAdmin) {
     const userId = this.activatedRoute.parent.snapshot.params.id;
     this.editUser(userId, dirtyValues);
   } else {
      this.editMyProfile(dirtyValues);
    }

  }

  getDirtyValues(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        const currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });

    return dirtyValues;
  }

  editUser(userId: number, dirtyValues) {
    this.userService.editUser(userId, dirtyValues).subscribe(
      (next) => {
        this.editBasicInformationForm.reset();
        this.submitError = false;
        this.submitSuccess = true;
      },
      (error) => {
        this.editBasicInformationForm.reset();
        this.submitSuccess = false;
        this.submitError = true;
      }
    );
  }

  editMyProfile(dirtyValues) {
    this.userService.editProfile(dirtyValues).subscribe(
      (next) => {
        this.editBasicInformationForm.reset();
        this.submitError = false;
        this.submitSuccess = true;
      },
      (error) => {
        this.editBasicInformationForm.reset();
        this.submitSuccess = false;
        this.submitError = true;
      }
    );
  }
}
