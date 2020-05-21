import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../../@core/services/job.service';
import { JobStatusIconRenderComponent } from '../../../@theme/components/smart-table/smart-table.component';

@Component({
  selector: 'job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss'],
})
export class JobResultComponent implements OnInit {

  settings = {
    hideSubHeader: true,
    actions: {
      // position: "right",
      // columnTitle: "View Result/Errors",
      // custom: [
      //   {
      //     name: "view",
      //     title: '<i class="nb-info"></i>',
      //   },
      // ],
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: false,
      perPage: 100,
    },
    attr: {
      class: 'table',
    },
    columns: {
      name: {
        title: 'Name',
        // width: "5%",
        // valuePrepareFunction: (r, c) => {return r.replace(/_/g, " ")}
      },
      success: {
        title: 'Success',
        type: 'custom',
        renderComponent: JobStatusIconRenderComponent,
        // width: "1%",
      },
      process_time: {
        title: 'Process Time (s)',
        // width: "15%",
        valuePrepareFunction: (c) => c.toFixed(2),
      },
      started_time: {
        title: 'Started Time',
        // width: "13%",
        valuePrepareFunction: (c) => new Date(c).toLocaleString(),
      },
    },
  };

  jobId: number;
  table_data: any;
  diffTime: number;
  selected_row: any;

  constructor(private activateRoute: ActivatedRoute, private jobService: JobService) {
    this.activateRoute.params.subscribe((res) => {
        this.jobId = res.jobId;
      });
  }

  async ngOnInit() {
    this.table_data = await this.jobService.getJob(this.jobId);
    const date1 = new Date(this.table_data.received_request_time).getUTCSeconds();
    const date2 = new Date(this.table_data.finished_analysis_time).getUTCSeconds();
    this.diffTime = Math.abs(date2 - date1);
  }

  onRowSelect(event) {
    this.selected_row = event.data.report || event.data.errors;
  }

  isObject(val) {
    if ( val === '' || val === null || val === []) {
      return false;
    } else if (Array.isArray(val) && val.length >= 1 ) {
      return false;
    } else {
      return ( val instanceof Object );
    }
  }

}
