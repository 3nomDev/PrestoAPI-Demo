import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { PrestoService } from './services/presto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public dialog: MatDialog, public ps: PrestoService) {}

  openDialog(isLogin: boolean) {
    return this.dialog.open(LoginComponent, { data: isLogin });
  }
}
