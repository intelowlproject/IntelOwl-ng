import { Component } from '@angular/core';

@Component({
  template: ` <nb-layout>
    <nb-layout-column>
      <router-outlet></router-outlet>
    </nb-layout-column>
  </nb-layout>`,
})
export class AuthManagementComponent {
  constructor() {}
}
