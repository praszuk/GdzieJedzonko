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

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }],               // custom button values
    [{ list: 'ordered'}, { list: 'bullet' }],
    [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
    [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
    [{ direction: 'rtl' }],                         // text direction

    [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean']                                         // remove formatting button
  ];

  editorStyle = {
    height: '70vh'
  };

  modules = {
    toolbar: this.toolbarOptions
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
    console.log(this.editorForm.value.content);
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
