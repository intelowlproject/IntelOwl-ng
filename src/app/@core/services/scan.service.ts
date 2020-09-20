import { Injectable } from '@angular/core';
import { IScanForm } from '../models/models';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  public recentScans: Map<string | number, string> = new Map();

  constructor(private toastr: ToastService) {}

  // only this function is callable from the components
  public requestScan(): void {
    // show success toast
    this.toastr.showToast(`Job ID: 999`, 'Analysis running!', 'success');
  }
}
