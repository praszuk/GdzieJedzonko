import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {
  addCityForm: FormGroup;

  constructor(private addCityRef: MatDialogRef<AddCityComponent>,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addCityForm = this.formBuilder.group({
      name: ['', Validators.required],
      lat: ['', [Validators.required, Validators.maxLength(8)]],
      lon: ['', [Validators.required, Validators.maxLength(9)]]
    });
  }

  close() {
    this.addCityRef.close();
  }

  onSubmit() {
    this.addCityRef.close(this.addCityForm.value);
  }

}
