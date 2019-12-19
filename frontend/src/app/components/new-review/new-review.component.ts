import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ArticleService} from '../../services/article/article.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ImageUploadComponent} from '../image-upload/image-upload.component';

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.css']
})
export class NewReviewComponent implements OnInit, OnDestroy {
  @ViewChild(ImageUploadComponent, {static: false}) imageUpload: ImageUploadComponent;
  editorForm: FormGroup;
  titleExists = false;
  subscription: Subscription = null;

  editorStyle = {
    height: '35vh'
  };

  modules = {
  };


  constructor(private formBuilder: FormBuilder, private articleService: ArticleService, private router: Router) { }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(3000)]]
    });
  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

   onSubmit() {
    const article = this.editorForm.value;
    this.subscription = this.articleService.newReview(article).subscribe(
      (id) => {
          this.titleExists = false;
          this.imageUpload.uploadImages(id.id);
        },
      error => {
        if (error.error.title !== undefined) {
          this.titleExists = true;
        }
      });
  }
}
