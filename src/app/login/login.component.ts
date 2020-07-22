import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrestoService } from '../services/presto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
declare var gapi;
declare var FB;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model = new User();
  hide = true;
  loading = false;
  success = false;
  errorMsg = '';
  gitCode: string;

  constructor(
    private ps: PrestoService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public isLogin: boolean
  ) {}

  register() {
    return this.ps
      .register(this.model)
      .then(() => (this.success = true))
      .catch((e: HttpErrorResponse) => {
        console.error(e);
        if (e.status === 401) this.errorMsg = 'Incorrect Password';
        else if (e.status === 404) this.errorMsg = 'User Not Found';
        else this.errorMsg = e.error;
      })
      .finally(() => (this.loading = false));
  }

  login() {
    this.ps
      .login(this.model)
      .then(() => this.dialogRef.close())
      .catch((e: HttpErrorResponse) => {
        console.error(e);
        if (e.status === 401) this.errorMsg = 'Incorrect Password';
        else if (e.status === 404) this.errorMsg = 'User Not Found';
        else this.errorMsg = e.error;
      })
      .finally(() => (this.loading = false));
  }

  onSubmit() {
    this.loading = true;
    if (this.isLogin) this.login();
    else this.register();
  }

  fbInit() {
    FB.init({
      appId: environment.fbAppId,
      autoLogAppEvents: true,
      cookie: true,
      xfbml: true,
      version: 'v7.0',
    });
  }
  fbSignIn() {
    FB.login(
      (response) => {
        if (response.authResponse) {
          this.model.token = response.authResponse.accessToken;
          this.onSubmit();
        } else console.log('User cancelled login or did not fully authorize.');
      },
      { scope: 'email' } //Email scope is necessary for PrestoAPI Auth
    );
  }

  auth2;
  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.googleClientId,
        cookiepolicy: 'single_host_origin',
      });
      this.googleSignIn(document.getElementById('google'));
    });
  }
  googleSignIn(element: HTMLElement) {
    if (!element) this.googleInit();
    if (element)
      this.auth2.attachClickHandler(
        element,
        () => {},
        (res) => {
          this.model.token = res.getAuthResponse().id_token;
          this.onSubmit();
        },
        (error) => {
          this.errorMsg = JSON.stringify(error, undefined, 2);
        }
      );
  }
}
