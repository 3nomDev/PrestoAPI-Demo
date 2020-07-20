import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../models/customer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrestoService } from '../services/presto.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<Customer>;
  loading = true;
  displayedColumns: string[] = [
    'Id',
    'FirstName',
    'LastName',
    'City',
    'Country',
    'Phone',
    'Buttons',
  ];

  constructor(private ps: PrestoService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getCustomers();
  }

  async getCustomers() {
    const suppliers = await this.ps.getCustomers();
    this.dataSource = new MatTableDataSource(suppliers || []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
  addRow() {
    if (!this.ps.getCurrentUser) return this.openDialog();
    this.dataSource.filter = '';
    this.dataSource.paginator.firstPage();
    //this.dataSource.data isn't directly mutable
    const arr = this.dataSource.data;
    arr.unshift(new Customer());
    this.dataSource.data = arr;
  }
  edit(c: Customer) {
    if (!this.ps.getCurrentUser) return this.openDialog();
    c.edit = true;
  }
  async save(c: Customer) {
    c.edit = false;
    if (c.Id) await this.ps.updateCustomer(c);
    else await this.ps.createCustomer(c);
    this.ngOnInit();
  }
  delete(c: Customer) {
    if (!this.ps.getCurrentUser) return this.openDialog();
    this.dataSource.data = this.dataSource.data.filter((d) => d.Id != c.Id);
    return this.ps.deleteCustomer(c);
  }
  cancel(c: Customer) {
    c.edit = false;
    this.ngOnInit();
  }
  openDialog() {
    return this.dialog.open(LoginComponent);
  }
}
