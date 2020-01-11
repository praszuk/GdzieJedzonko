import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Comment} from '../../models/comment.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommentService} from '../../services/comment/comment.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../modules/auth/services/auth-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  commentLength: number;

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{list: 'ordered'}, {list: 'bullet'}],
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{color: []}, {background: []}],
    [{font: []}],
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
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {

    this.newCommentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(300)]]
    });
    this.loadingService.hide('comments-section-loading');
    this.IsLoggedIn();
    this.getAllComments();
  }

  getAllComments() {
    this.subscription = this.commentService.getAllComments(this.articleId).subscribe(
      (comments) => {
        this.comments = comments;
        this.loadingService.hide('comments-section-loading');
      },
      (error) => {
        this.snackBar.open('Wyświetlanie komentarzy zakończone niepowodzeniem, spróbuj odświeżyć strone', '', {
          duration: 3000
        });
        this.loadingService.hide('comments-section-loading');
      }
    );
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  IsLoggedIn() {
    this.isLogged = this.authService.isLoggedIn();
  }

  newComment() {
    const commentContent = this.newCommentForm.get('content').value;
    this.newCommentForm.value.content = JSON.parse(commentContent);
    this.subscription = this.commentService.createComment(this.articleId, this.newCommentForm.value).subscribe(
      (comment) => {
        this.comments.unshift(comment);
        this.newCommentForm.get('content').reset();
      },
      (error) => {
        this.snackBar.open('Dodanie komentarza się nie powiodło, spróbuj za chwilę', '', {
          duration: 3000
        });
      }
    );
  }

  textChanged($event: { content: any; delta: any; editor: any; html: string | null; oldDelta: any; source: string; text: string }) {
    this.commentLength = $event.editor.getLength() - 1;
  }
}
