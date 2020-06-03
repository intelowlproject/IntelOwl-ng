import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      <b>
        <a target="_blank" href="https://github.com/orgs/intelowlproject"
          >IntelOwl</a
        >
      </b>
      Project Organization.
    </span>
  `,
})
export class FooterComponent {}
