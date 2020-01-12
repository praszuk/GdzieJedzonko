import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ImageService} from '../../services/image/image.service';
import {forkJoin, Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {Image} from '../../models/image.model';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  @Input() articleId: number;
  @Input() uploadedImages: Image[];
  @Input() uploadedThumbnail: Image;

  selectedFiles = [];
  previewUrlArray = [];
  selectedThumbnailFile: File;
  previewThumbnailImage: any;
  mainImageSubscription: Subscription;
  private maxImageCount = 9;

  constructor(private imageService: ImageService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.mainImageSubscription) {
      this.mainImageSubscription.unsubscribe();
    }
  }

  uploadImages(articleId: number) {
    if (this.selectedThumbnailFile) {
      this.mainImageSubscription = this.imageService.uploadThumbnail(articleId, this.selectedThumbnailFile).subscribe(
        (next) => {

          if (this.selectedFiles.length) {
            const sentImages = new Array<Observable<any>>();
            this.selectedFiles.forEach((file: File) => {
              sentImages.push(this.imageService.uploadImage(articleId, file)
                .pipe(
                  catchError(
                    (err) =>
                      throwError(file.name)
                  )
                ));
              });

            forkJoin(sentImages).subscribe(
              (result) => {},
              (filename) => {
                this.snackBar.open(`Nie powiodło się wysyłanie zdjęć: ${filename}`, '', {
                  duration: 3000
                });
              },
              () => {
                this.router.navigate([`article/${articleId}`]);
              }
            );
          } else {
            this.router.navigate([`article/${articleId}`]);
          }
        },
        (error) => {
          console.log('Error uploading thumbnail');
          console.log(error);
        });
    } else {
      this.router.navigate([`article/${articleId}`]);
    }
  }

  addImages(selected: any) {
    const selectedArr = Object.values(selected.target.files);
    let isOverLimit;
    if (this.uploadedImages) {
      isOverLimit = (this.selectedFiles.length + selectedArr.length + this.uploadedImages.length) <= this.maxImageCount;
    } else {
      isOverLimit = (this.selectedFiles.length + selectedArr.length) <= this.maxImageCount;
    }
    if (isOverLimit) {
        selectedArr.forEach((file) => {
        this.selectedFiles.push(file);
        this.preview(file);
      });
    } else {
      this.snackBar.open(`Załączanie przerwane, maksymalna ilość załączonych zdjęć wynosi ${this.maxImageCount}`, '', {
        duration: 5000
      });
    }
  }

  preview(fileData) {
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (event) => {
      this.previewUrlArray.push(reader.result);
    };
  }

  addThumbnail(selected: any) {
    this.selectedThumbnailFile = selected.target.files[0] as File;
    this.previewThumbnail(this.selectedThumbnailFile);
  }

  previewThumbnail(fileData) {
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (event) => {
      this.previewThumbnailImage = reader.result;
    };
  }

  removeImage(preview: any) {
    const fileIndex = this.previewUrlArray.indexOf(preview);
    this.previewUrlArray.splice(fileIndex, 1);
    this.selectedFiles.splice(fileIndex, 1);
  }


  removeThumbnail(preview: any) {
    this.previewThumbnailImage = null;
    this.selectedThumbnailFile = null;
  }

  showModalPreview(preview: any) {
  }

  removeUploadedImage(image: Image) {
    const fileIndex = this.uploadedImages.map((photo) => photo.image).indexOf(image.image);
    this.uploadedImages.splice(fileIndex, 1);
    if (this.uploadedImages.length === 0) {
      this.uploadedImages = null;
    }
    this.imageService.deleteImage(this.articleId, image.id).subscribe(
      (next) => {
      },
      (error) => {
        this.snackBar.open(`Usunięcie zdjęcia się nie powiodło`, '', {
          duration: 3000
        });
      }
    );
  }

  removeUploadedThumbnail(image: Image) {
    this.uploadedThumbnail = null;
    this.imageService.deleteImage(this.articleId, image.id).subscribe(
      (next) => {
      },
      (error) => {
        this.snackBar.open(`Usunięcie zdjęcia głównego się nie powiodło`, '', {
          duration: 3000
        });
      }
    );
  }
}
