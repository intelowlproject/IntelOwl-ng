import {Injectable} from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  config = {
    destroyByClick: true,
    duration: 5000,
    preventDuplicates: false,
  };

  constructor(private toastrService: NbToastrService) {
  }

  showToast(message: string, title: string, isError: boolean, error?: HttpErrorResponse) {
    if (isError) {
      console.error(error);
      this.toastrService.danger(message, title, this.config);
    } else {
      this.toastrService.success(message, title, this.config);
    }

  }

  infiniteNotification(title: string, message: string, iconName: string) {
    this.toastrService.show(
      message,
      title,
      {duration: 0, icon: iconName, iconPack: 'eva'});
  }
}
