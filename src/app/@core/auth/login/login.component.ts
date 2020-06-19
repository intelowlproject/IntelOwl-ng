import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: { username: string; password: string } = {
    username: null,
    password: null,
  };

  intelOwlVersion: string = environment.intel_owl_version;

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
      url: 'https://www.facebook.com/intelowlproject/',
      target: '_blank',
      icon: 'facebook',
    },
    {
      url: 'https://twitter.com/intelowlproject',
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
        this.messages.push('Login Successful!');
        setTimeout(() => {
          return this.router.navigateByUrl('/');
        }, 1000);
      },
      (err: any) => {
        console.error(err);
        this.submitted = false;
        this.errors.push(err.error);
      }
    );
  }
}
