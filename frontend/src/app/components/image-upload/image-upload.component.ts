import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImageService} from '../../services/image/image.service';
import {Subscription} from 'rxjs';

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
  imagesSubscription: Subscription;


  constructor(private imageService: ImageService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.mainImageSubscription) {
      this.mainImageSubscription.unsubscribe();
    }
    if (this.imagesSubscription) {
      this.imagesSubscription.unsubscribe();
    }
  }

  uploadImages(articleId: number) {
    console.log('in upload images');
    this.mainImageSubscription = this.imageService.uploadThumbnail(articleId, this.selectedMainImageFile).subscribe(
      (next) => {
          console.log('uploaded main image');
          this.selectedFiles.forEach((file) => {
          this.imagesSubscription = this.imageService.uploadImage(articleId, file).subscribe(
            (response) => {
              console.log('uploaded some image');
            },
            (error) => {
              console.log('error some image');
            }
          );
        });
      },
      (error) => {
        console.log('error main image');
        console.log(error);
      },
      () => {
        console.log('complete');
      }
    );


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
