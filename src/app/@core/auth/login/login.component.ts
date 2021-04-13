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

  isDarkTheme: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.isDarkTheme = LoginComponent.getThemeName() === 'dark' ? true : false;
  }

  static getThemeName(): string {
    return localStorage.getItem('themeName') || 'dark';
  }

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
