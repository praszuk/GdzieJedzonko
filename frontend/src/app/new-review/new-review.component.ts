import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.css']
})
export class NewReviewComponent implements OnInit {
  editorForm: FormGroup;
  editorStyle = {
    height: '35vh'
  };

  config = {
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      title: [''],
      content: ['']
    });
  }

  onSubmit() {

  }
}
