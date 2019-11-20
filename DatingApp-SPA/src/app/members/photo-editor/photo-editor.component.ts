import { Component, OnInit, Input} from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';

import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos: Photo[];



 uploader: FileUploader;
 hasBaseDropZoneOver = false;
 baseUrl = environment.apiUrl;
 currentMain: Photo;
 x: any;

  constructor(private alertify: AlertifyService, private authservice: AuthService, private userservice: UserService) { }

  ngOnInit() {
    this.initilazeUploader();
  }

   fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    }

    initilazeUploader () {
      this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authservice.decodedToken.nameid + '/Photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
      });
      this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
      this.uploader.onSuccessItem = (item, response, status, headers) => {
        if (response) {
          const res: Photo = JSON.parse(response);
          const photo = {
            id: res.id,
            url: res.url,
            dateAdded: res.dateAdded,
            discription: res.discription,
            isMain: res.isMain
          };
          this.photos.push(photo);
          if (photo.isMain) {
            this.authservice.changeMemberPhoto(photo.url);
            this.authservice.currentUser.photoUrl = photo.url;
            localStorage.setItem('user', JSON.stringify(this.authservice.currentUser));
           }
        }
      };
    }

setMainPhoto(photo: Photo) {
  this.userservice.SetMainPhoto(this.authservice.decodedToken.nameid, photo.id).
  subscribe(() => {
   this.currentMain = this.photos.filter(p => p.isMain === true)[0];
   this.currentMain.isMain = false;
   photo.isMain = true;
   this.authservice.changeMemberPhoto(photo.url);
   this.authservice.currentUser.photoUrl = photo.url;
   localStorage.setItem('user', JSON.stringify(this.authservice.currentUser));

  }, error => {
    this.alertify.error(error);
  });
}

deletePhoto(id: number) {
 this.alertify.confirm('Are you sure?', () => {
   this.userservice.DeletePhoto(this.authservice.decodedToken.nameid, id).subscribe(() => {
     this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
     this.alertify.success('Photo has been deleted');
   }, error => {
     this.alertify.error('Photo cannot be deleted');
   });
 });
}


}
