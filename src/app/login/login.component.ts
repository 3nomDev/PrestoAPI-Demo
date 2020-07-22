import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrestoService } from '../services/presto.service';
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
  ) {
    this.googleInit();
    this.fbInit();
  }

  async register() {
    try {
      await this.ps.register(this.model);
      this.success = true;
    } catch (e) {
      console.error(e);
      if (e.status === 401) this.errorMsg = 'Incorrect Password';
      else if (e.status === 404) this.errorMsg = 'User Not Found';
      else this.errorMsg = e.error;
    }
    this.loading = false;
  }

  async login() {
    try {
      await this.ps.login(this.model);
      this.dialogRef.close();
    } catch (e) {
      console.error(e);
      if (e.status === 401) this.errorMsg = 'Incorrect Password';
      else if (e.status === 404) this.errorMsg = 'User Not Found';
      else this.errorMsg = e.error;
    }
    this.loading = false;
  }

  onSubmit() {
    this.errorMsg = null;
    this.loading = true;
    if (this.isLogin) return this.login();
    return this.register();
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
    return FB.login(
      (response) => {
        if (response.authResponse) {
          this.model.token = response.authResponse.accessToken;
          return this.onSubmit();
        } else console.log('User cancelled login or did not fully authorize.');
      },
      { scope: 'email' } //Email scope is necessary for PrestoAPI Auth
    );
  }

  googleAuth;
  googleInit() {
    gapi.load('auth2', () => {
      this.googleAuth = gapi.auth2.init({
        client_id: environment.googleClientId,
        cookiepolicy: 'single_host_origin',
      });
    });
  }
  googleSignIn() {
    return this.googleAuth
      .signIn()
      .then((res) => {
        this.model.token = res.getAuthResponse().id_token;
        return this.onSubmit();
      })
      .catch((error) => {
        this.errorMsg = JSON.stringify(error, undefined, 2);
      });
  }
}
