import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

@Injectable()
export class ToastService {
  private config = {
    destroyByClick: true,
    duration: 5000,
    preventDuplicates: false,
  };

  constructor(private toastrService: NbToastrService) {}

  public showToast(message: string, title: string, status: string) {
    if (status === 'error') {
      this.toastrService.danger(message.toString(), title, this.config);
    } else if (status === 'success') {
      this.toastrService.success(message, title, this.config);
    } else if (status === 'warning') {
      this.toastrService.warning(message, title, this.config);
    } else {
      this.toastrService.primary(message, title, this.config);
    }
  }

  public infiniteNotification(
    title: string,
    message: string,
    iconName: string
  ) {
    this.toastrService.show(message, title, {
      duration: 0,
      icon: { icon: iconName, pack: 'eva' },
    });
  }
}
