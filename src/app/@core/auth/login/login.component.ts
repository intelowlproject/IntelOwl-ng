import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: { username: string; password: string } = {
    username: null,
    password: null,
  };

  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;

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

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.authService.login(this.user).then(
      () => {
        this.messages.push('Login Successful! You will be redirected shortly.');
        setTimeout(() => {
          return this.router.navigateByUrl('/');
        }, 1000);
      },
      (err: any) => {
        console.error(err);
        this.submitted = false;
        const errMsg: string = (
          err?.error?.error ||
          err?.error?.non_field_errors ||
          err?.detail ||
          err?.message ||
          JSON.stringify(err)
        ).toString();
        this.errors.push(errMsg);
      }
    );
  }
}
