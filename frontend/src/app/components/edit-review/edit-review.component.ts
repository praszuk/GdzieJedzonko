import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImageUploadComponent} from '../image-upload/image-upload.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ArticleService} from '../../services/article/article.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Article} from '../../models/article.model';
import {Image} from '../../models/image.model';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css']
})
export class EditReviewComponent implements OnInit, OnDestroy {

  @ViewChild(ImageUploadComponent, {static: false}) imageUpload: ImageUploadComponent;

  uploadedThumbnail: Image = null;
  uploadedImages: Image[] = null;
  editorForm: FormGroup;
  titleExists = false;
  subscription: Subscription = null;
  article: Article;
  articleId: number;

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


  constructor(private formBuilder: FormBuilder,
              private articleService: ArticleService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(3000)]]
    });
    this.articleId = +this.activatedRoute.snapshot.params.id;
    this.getArticle(this.articleId);
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

  setArticleContent() {
    this.editorForm.get('title').setValue(this.article.title);
    this.editorForm.get('content').setValue(this.article.content);

    if (this.article.thumbnail) {
      this.uploadedThumbnail = this.article.thumbnail;
      if (this.article.photos) {
        this.uploadedImages = this.article.photos;
      }
    }
  }


  getArticle(articleId: number) {
    this.articleService.getArticle(articleId).subscribe(
      (article) => {
        this.article = article;
        this.setArticleContent();
      },
      (error) => {
        // todo show popup error
      }
    );
  }

}
