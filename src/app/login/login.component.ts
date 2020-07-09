import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrestoService } from '../services/presto.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model = { email: '', password: '' };
  hide = true;
  loading = false;
  errorMsg: string;

  constructor(
    private ps: PrestoService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public isLogin: boolean
  ) {}

  async onSubmit() {
    this.loading = true;
    this.ps
      .login(this.model)
      .then(() => this.dialogRef.close())
      .catch((e: HttpErrorResponse) => {
        if (e.status === 401) this.errorMsg = 'Incorrect Password';
        else if (e.status === 404) this.errorMsg = 'User Not Found';
        else this.errorMsg = e.message;
      })
      .finally(() => (this.loading = false));
  }
}
