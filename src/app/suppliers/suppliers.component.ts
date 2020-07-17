import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Supplier } from '../models/supplier';
import { PrestoService } from '../services/presto.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
})
export class SuppliersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<Supplier>;
  loading = true;
  displayedColumns: string[] = [
    'Id',
    'CompanyName',
    'ContactName',
    'ContactTitle',
    'City',
    'Country',
    'Phone',
    'Fax',
    'Buttons',
  ];

  constructor(private ps: PrestoService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getSuppliers();
  }

  async getSuppliers() {
    const suppliers = await this.ps.getSuppliers();
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
    arr.unshift(new Supplier());
    this.dataSource.data = arr;
  }
  edit(s: Supplier) {
    if (!this.ps.getCurrentUser) return this.openDialog();
    s.edit = true;
  }
  async save(s: Supplier) {
    s.edit = false;
    if (s.Id) await this.ps.updateSupplier(s);
    else await this.ps.createSupplier(s);
    this.ngOnInit();
  }
  delete(s: Supplier) {
    this.dataSource.data = this.dataSource.data.filter((d) => d.Id != s.Id);
    return this.ps.deleteSupplier(s);
  }
  cancel(s: Supplier) {
    s.edit = false;
    this.ngOnInit();
  }
  openDialog() {
    return this.dialog.open(LoginComponent);
  }
}
