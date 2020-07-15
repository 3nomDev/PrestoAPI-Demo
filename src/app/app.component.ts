import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { PrestoService } from './services/presto.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public ps: PrestoService,
    private router: Router
  ) {}
  isMobile = window.screen.width < 450;
  myControl = new FormControl();
  pages = [
    'dashboard',
    'orders',
    'inventory',
    'suppliers',
    'customers',
    'about',
  ];
  filteredOptions: Observable<string[]>;
  openDialog(isLogin: boolean) {
    return this.dialog.open(LoginComponent, { data: isLogin });
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  goToPage(event: MatAutocompleteSelectedEvent) {
    this.router.navigate([event.option.value]);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const f = this.pages.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
    return f.length === 0 ? ['No results'] : f;
  }
}
