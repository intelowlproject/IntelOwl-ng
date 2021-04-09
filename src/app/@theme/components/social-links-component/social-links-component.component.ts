import { Component } from '@angular/core';

@Component({
  selector: 'intelowl-social-links-component',
  templateUrl: './social-links-component.component.html',
  styleUrls: ['./social-links-component.component.scss'],
})
export class SocialLinksComponentComponent {
  socialLinks: any[] = [
    {
      url: 'https://github.com/intelowlproject',
      target: '_blank',
      icon: 'github',
    },
    {
      url: 'https://gsoc-slack.honeynet.org/',
      target: '_blank',
      icon: 'message-circle-outline',
    },
    {
      url: 'https://twitter.com/intel_owl',
      target: '_blank',
      icon: 'twitter',
    },
  ];
}
