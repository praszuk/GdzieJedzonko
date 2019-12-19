import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImageService} from '../../services/image/image.service';
import {forkJoin, Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  selectedFiles = [];
  previewUrlArray = [];
  private maxImageCount = 9;
  selectedMainImageFile: File;
  previewMainImage: any;
  mainImageSubscription: Subscription;

  constructor(private imageService: ImageService, private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.mainImageSubscription) {
      this.mainImageSubscription.unsubscribe();
    }
  }

  uploadImages(articleId: number) {
    this.mainImageSubscription = this.imageService.uploadThumbnail(articleId, this.selectedMainImageFile).subscribe(
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

  }

  addImages(selected: any) {
    const selectedArr = Object.values(selected.target.files);
    const isOverLimit =  (this.selectedFiles.length + selectedArr.length) <= this.maxImageCount;
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

  addMainImage(selected: any) {
    this.selectedMainImageFile = selected.target.files[0] as File;
    this.previewMain(this.selectedMainImageFile);
  }

  previewMain(fileData) {
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (event) => {
      this.previewMainImage = reader.result;
    };
  }

  removeImage(preview: any) {
    const fileIndex = this.previewUrlArray.indexOf(preview);
    this.previewUrlArray.splice(fileIndex, 1);
    this.selectedFiles.splice(fileIndex, 1);
  }


  removeMainImage(preview: any) {
    this.previewMainImage = null;
    this.selectedMainImageFile = null;
  }

  showModalPreview(preview: any) {
    // todo fullscreen preview
    alert('todo modal fullscreen preview');
  }
}
