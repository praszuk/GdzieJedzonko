import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ImageService} from '../../services/image/image.service';
import {forkJoin, Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {Image} from '../../models/image.model';

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

  constructor(private imageService: ImageService, private router: Router) { }

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
                // todo popup with filenames that was not uploaded
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
      // todo change to angularMaterial toast
      alert(`Załączanie przerwane \nmaksymalna ilość załączonych zdjęć wynosi ${this.maxImageCount}`);
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
    // todo fullscreen preview
    alert('todo modal fullscreen preview');
  }

  removeUploadedImage(image: Image) {
    const fileIndex = this.uploadedImages.map((photo) => photo.image).indexOf(image.image);
    this.uploadedImages.splice(fileIndex, 1);
    if (this.uploadedImages.length === 0) {
      this.uploadedImages = null;
    }
    this.imageService.deleteImage(this.articleId, image.id).subscribe(
      (next) => {
        // todo popup deletion information
      },
      (error) => {
        // todo popup error deletion information
      }
    );
  }

  removeUploadedThumbnail(image: Image) {
    this.uploadedThumbnail = null;
    this.imageService.deleteImage(this.articleId, image.id).subscribe(
      (next) => {
        // todo popup deletion information
      },
      (error) => {
        // todo popup error deletion information
      }
    );
  }
}
