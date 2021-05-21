import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../../../@core/services/job.service';
import { ToastService } from 'src/app/@core/services/toast.service';
import { Job } from '../../../../@core/models/models';

@Component({
  selector: 'job-actions-menu',
  templateUrl: './job-actions-menu.component.html',
  styleUrls: ['./job-actions-menu.component.scss'],
})
export class JobActionsMenuComponent {
  @Input() job: Job;

  constructor(
    private readonly jobService: JobService,
    private readonly toastr: ToastService,
    private readonly router: Router
  ) {}

  async getJobSample(): Promise<void> {
    const url: string = await this.jobService.downloadJobSample(+this.job.id);
    window.open(url, 'rel=noopener,noreferrer');
  }

  async getJobRawJson(): Promise<void> {
    const url: string = await this.jobService.downloadJobRawJson(+this.job.id);
    window.open(url, 'rel=noopener,noreferrer');
  }

  async deleteJob(): Promise<void> {
    const sure = confirm('Are you sure?');
    if (!sure) return;
    const success = await this.jobService.deleteJobById(+this.job.id);
    if (success) {
      this.toastr.showToast(
        'Deleted successfully.',
        `Job #${this.job.id}`,
        'success'
      );
      setTimeout(() => this.router.navigate(['/']), 1000);
    } else {
      this.toastr.showToast(
        'Could not be deleted. Reason: "Insufficient Permission".',
        `Job #${this.job.id}`,
        'error'
      );
    }
  }

  async killJob(): Promise<void> {
    const sure = confirm('Are you sure?');
    if (!sure) return;
    const success = await this.jobService.killJobById(+this.job.id);
    if (success) {
      this.toastr.showToast(
        'Marked as "killed" successfully.',
        `Job #${this.job.id}`,
        'success'
      );
    } else {
      this.toastr.showToast(
        'Could not be "killed". Reason: "Insufficient Permission".',
        `Job #${this.job.id}`,
        'error'
      );
    }
  }
}
