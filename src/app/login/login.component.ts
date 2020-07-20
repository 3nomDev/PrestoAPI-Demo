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
  errorMsg = '';
  socialLogin = false;

  constructor(
    private ps: PrestoService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public isLogin: boolean
  ) {}

  onSubmit() {
    this.loading = true;
    if (this.isLogin) this.login();
    else this.register();
  }
  register() {
    return this.ps
      .register(this.model)
      .then(() => this.dialogRef.close())
      .catch((e: HttpErrorResponse) => {
        console.log('e: ', e);
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
        if (e.status === 401) this.errorMsg = 'Incorrect Password';
        else if (e.status === 404) this.errorMsg = 'User Not Found';
        else this.errorMsg = e.error;
      })
      .finally(() => (this.loading = false));
  }

  ngAfterViewInit() {
    this.googleInit();
    this.fbInit();
  }
  // https://docs.github.com/en/developers/apps/authorizing-oauth-apps
  gitSignIn() {
    let url = 'https://github.com/login/oauth/authorize';
    url += '?client_id=' + environment.gitHubClientId;
    window.location.href = url;
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
        console.log('response: ', response);
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', (response) => {
            console.log('response2: ', response);
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },
      (err) => {
        console.log('err: ', err);
      }
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
    this.auth2.attachClickHandler(
      element,
      () => (this.socialLogin = true),
      (res) => {
        this.model.name = res.getBasicProfile().getName();
        this.model.email = res.getBasicProfile().getEmail();
        this.model.metadata = { photo: res.getBasicProfile().getImageUrl() };
        this.model.token = res.getAuthResponse().id_token;
        this.model.provider = 'google';
        this.onSubmit();
      },
      (error) => {
        this.errorMsg = JSON.stringify(error, undefined, 2);
      }
    );
  }
}
