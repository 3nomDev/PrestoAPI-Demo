import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrestoService } from '../services/presto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model = new User()
  hide = true;
  loading = false;
  errorMsg: string;

  constructor(
    private ps: PrestoService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public isLogin: boolean
  ) {}

  onSubmit() {
    this.loading = true;
    if(this.isLogin) this.login();
    else this.register();

  }
  register(){
    this.ps
    .register(this.model)
    .then(() => this.dialogRef.close())
    .catch((e: HttpErrorResponse) => {
      console.log("e: ",e);
      if (e.status === 401) this.errorMsg = 'Incorrect Password';
      else if (e.status === 404) this.errorMsg = 'User Not Found';
      else this.errorMsg = e.error;
    })
    .finally(() => (this.loading = false));
  }
  login(){
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
}
