import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-edit-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css']
})
export class BasicInformationComponent implements OnInit {
  editBasicInformationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editBasicInformationForm = this.formBuilder.group({
      email: [''],
      first_name: [''],
      last_name: [''],
      role: [''],
      birth_date: ['']
    });
  }

  onSubmit() {

  }
}
