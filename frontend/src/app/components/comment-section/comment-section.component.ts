import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Comment} from '../../models/comment.model';
import { NgxSpinnerService} from 'ngx-spinner';
import {CommentService} from '../../services/comment/comment.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../modules/auth/services/auth-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit, OnDestroy {
  @Input() articleId: number;

  newCommentForm: FormGroup;
  comments: Comment [];
  isLoading = false;
  subscription: Subscription;
  isLogged: boolean;

  dummyData = [
    {
      id: 1,
  user: {
    id: 1,
    first_name: 'Karol',
    last_name: 'Meszko'
  },
  comment: '{"ops":[{"insert":"Też byłem "},{"attributes":{"bold":true},"insert":"NAPRAWDE WARTE POLECENIA"},{"insert":"\\n"}]}',
  creation_date: '2019-05-22'
}, {
  id: 2,
  user: {
    id: 2,
      first_name: 'Krelo',
      last_name: 'Karolow'
  },
  comment: '{"ops":[{"insert":"Bardzo"},{"attributes":{"underline":true},"insert":" interesująca recenzja,"},' +
    '{"insert":" pozdrawiam "},{"attributes":{"bold":true},"insert":"Mirek"},{"insert":"\\n"}]}',
  creation_date: '2019-05-22'
  }
];

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered'}, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    ['clean']
  ];

  editorStyle = {
    height: '15vh'
  };

  modules = {
    toolbar: this.toolbarOptions
  };

  constructor(private loadingService: NgxSpinnerService,
              private commentService: CommentService,
              private authService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.newCommentForm = this.formBuilder.group({
      user: [''],
      comment: ['', [Validators.required, Validators.maxLength(400)]]
    });
    this.loadingService.hide('comments-section-loading');
    this.IsLoggedIn();
    // this.getAllComments();
    this.comments = this.dummyData;
  }

  getAllComments() {
    this.subscription = this.commentService.getAllComments(this.articleId).subscribe(
      (comments) => {
        this.comments = comments;
        this.loadingService.hide('comments-section-loading');
      },
      (error) => {
        // todo show error
        this.loadingService.hide('comments-section-loading');
        console.log(error);
      }
    );
  }



  ngOnDestroy() {
   // this.subscription.unsubscribe();
  }

  IsLoggedIn() {
    this.isLogged = this.authService.isLoggedIn();
  }

  newComment() {
    this.comments.unshift({
      id: 2,
      user: {
        id: 2,
        first_name: 'Krelo',
        last_name: 'Karolow'
      },
      comment: this.newCommentForm.value.comment,
      creation_date: '2019-05-22'
    });
    this.newCommentForm.get('user').setValue(this.authService.getCurrentUserId());
    this.newCommentForm.get('comment').reset();


    this.subscription = this.commentService.createComment(this.articleId, this.newCommentForm.value).subscribe(
      (comment) => {
        // this.comments.unshift(comment);
        // this.newCommentForm.get('comment').reset();
      },
      (error) => {
        // todo show error
        console.log(error);
      }
    );
  }
}
