import { Component, OnInit, ViewChild } from '@angular/core';
import { PrestoService } from '../services/presto.service';
import { Product } from '../models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<Product>;
  loading = true;
  displayedColumns: string[] = [
    'Id',
    'ProductName',
    'Quantity',
    'UnitPrice',
    'SupplierId',
    'CompanyName',
    'Buttons',
  ];

  constructor(private ps: PrestoService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getProducts();
  }

  async getProducts() {
    const products = await this.ps.getProducts();
    this.dataSource = new MatTableDataSource(products || []);
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
    this.dataSource.filter = '';
    this.dataSource.paginator.firstPage();
    //this.dataSource.data isn't directly mutable
    const arr = this.dataSource.data;
    arr.unshift(new Product());
    this.dataSource.data = arr;
  }
  edit(p: Product) {
    if (this.ps.getCurrentUser) p.edit = true;
    else this.openDialog();
  }
  async save(p: Product) {
    p.edit = false;
    if (p.Id) await this.ps.updateProduct(p);
    else await this.ps.createProduct(p);
    this.ngOnInit();
  }
  delete(p: Product) {
    this.dataSource.data = this.dataSource.data.filter((d) => d.Id != p.Id);
    return this.ps.deleteProduct(p);
  }
  cancel(p: Product) {
    p.edit = false;
    this.ngOnInit();
  }
  openDialog() {
    return this.dialog.open(LoginComponent);
  }
}
